// バッジ画像生成システム（PNG形式）
function generateBadgePNG(badgeId, size = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 各地域の色とデザイン設定
    const badgeDesigns = {
        tsurugi: { 
            gradient: ['#E74C3C', '#C0392B'], 
            symbol: '⛩️', 
            name: '鶴来',
            accent: '#F39C12'
        },
        mikawa: { 
            gradient: ['#3498DB', '#2980B9'], 
            symbol: '🌊', 
            name: '美川',
            accent: '#85C1E9'
        },
        mattou: { 
            gradient: ['#2ECC71', '#27AE60'], 
            symbol: '🏛️', 
            name: '松任',
            accent: '#82E0AA'
        },
        kawachi: { 
            gradient: ['#F39C12', '#E67E22'], 
            symbol: '🌉', 
            name: '河内',
            accent: '#F7DC6F'
        },
        shiramine: { 
            gradient: ['#9B59B6', '#8E44AD'], 
            symbol: '⛰️', 
            name: '白峰',
            accent: '#D7BDE2',
            legendary: true
        },
        yoshinodani: { 
            gradient: ['#E67E22', '#D35400'], 
            symbol: '🌸', 
            name: '吉野谷',
            accent: '#F8C471'
        },
        torigoe: { 
            gradient: ['#1ABC9C', '#16A085'], 
            symbol: '🏰', 
            name: '鳥越',
            accent: '#A3E4D7'
        },
        oguchi: { 
            gradient: ['#34495E', '#2C3E50'], 
            symbol: '💧', 
            name: '尾口',
            accent: '#AEB6BF'
        }
    };

    const design = badgeDesigns[badgeId] || badgeDesigns.default;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    // 背景グラデーション
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, design.gradient[0]);
    gradient.addColorStop(1, design.gradient[1]);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 外枠
    ctx.strokeStyle = design.accent;
    ctx.lineWidth = size * 0.05;
    ctx.stroke();

    // 内側の装飾リング
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.8, 0, 2 * Math.PI);
    ctx.stroke();

    // 中央のシンボル（テキストとして描画）
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(design.symbol, centerX, centerY - size * 0.05);

    // 地域名
    ctx.font = `bold ${size * 0.12}px 'Noto Sans JP', Arial`;
    ctx.fillText(design.name, centerX, centerY + size * 0.25);

    // 白峰バッジの特別効果
    if (design.legendary) {
        // 光る効果
        const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.2);
        glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.2, 0, 2 * Math.PI);
        ctx.fill();
    }

    return canvas.toDataURL('image/png');
}

// バッジファイルを生成して保存
async function generateAndSaveBadges() {
    const badges = ['tsurugi', 'mikawa', 'mattou', 'kawachi', 'shiramine', 'yoshinodani', 'torigoe', 'oguchi'];
    
    for (const badgeId of badges) {
        const dataURL = generateBadgePNG(badgeId, 128);
        
        // Base64データをBlobに変換
        const response = await fetch(dataURL);
        const blob = await response.blob();
        
        // ダウンロードリンクを作成
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${badgeId}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 少し待つ（ブラウザの負荷軽減）
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('すべてのバッジPNGファイルの生成が完了しました');
}

// 使用法：コンソールで generateAndSaveBadges() を実行
console.log('バッジPNG生成システムが読み込まれました。generateAndSaveBadges() を実行してファイルを生成してください。');
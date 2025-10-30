// 白山市            mattou: { name: '松任地区', color: '#45B7D1', symbol: '松' },            kawachi: { name: '河内地区', color: '#96CEB4', symbol: '河' },               oguchi: { name: '尾口地区', color: '#E76F51', symbol: '尾' }      mattou: { name: '松任地区', color: '#45B7D1', symbol: '松' },            kawachi: { name: '河内地区', color: '#96CEB4', symbol: '河' },ジシス            oguchi: { name: '尾口地区', color: '#E76F51', symbol: '尾' }ム（画像ベース・商用権フリー）
class HakusanBadgeSystem {
    constructor() {
        this.regions = {
            tsurugi: { name: '鶴来地区', color: '#FF6B6B', symbol: '鶴' },
            mikawa: { name: '美川地区', color: '#4ECDC4', symbol: '◆' },
            mattou: { name: '松任地区', color: '#45B7D1', symbol: '◼' },
            kawachi: { name: '河内地区', color: '#96CEB4', symbol: '▣' },
            shiramine: { name: '白峰地区', color: '#FFEAA7', symbol: '白' },
            yoshinodani: { name: '吉野谷地区', color: '#DDA0DD', symbol: '◎' },
            torigoe: { name: '鳥越地区', color: '#F4A261', symbol: '◉' },
            oguchi: { name: '尾口地区', color: '#E76F51', symbol: '▲' }
        };
        
        this.rarityLevels = {
            common: { name: '一般', color: '#C0C0C0', urlSuffix: 'basic' },
            uncommon: { name: '発見', color: '#32CD32', urlSuffix: 'discover' },
            rare: { name: '探索', color: '#1E90FF', urlSuffix: 'explore' },
            epic: { name: '冒険', color: '#9370DB', urlSuffix: 'adventure' },
            legendary: { name: '制覇', color: '#FFD700', urlSuffix: 'master' }
        };
        
        this.collectedBadges = this.loadBadges();
        this.badgeImages = new Map();
        
        this.init();
    }
    
    init() {
        this.generateBadgeImages();
        this.setupURLHandling();
        console.log('バッジシステム初期化完了');
    }
    
    generateBadgeImages() {
        // Batch canvas operations for better performance
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 120;
        tempCanvas.height = 120;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Pre-cache color calculations
        const colorCache = new Map();
        
        for (const regionId in this.regions) {
            const regionData = this.regions[regionId];
            
            for (const rarity in this.rarityLevels) {
                const rarityData = this.rarityLevels[rarity];
                
                // Clear canvas for reuse
                tempCtx.clearRect(0, 0, 120, 120);
                
                const badgeImage = this.createBadgeImageOptimized(tempCtx, regionData, rarityData, colorCache);
                this.badgeImages.set(`${regionId}_${rarity}`, badgeImage);
            }
        }
    }
    
    createBadgeImageOptimized(ctx, regionData, rarityData, colorCache) {
        
        // 背景グラデーション
        const gradient = ctx.createRadialGradient(60, 60, 20, 60, 60, 60);
        gradient.addColorStop(0, rarityData.color);
        
        // Cache darkened colors
        const cacheKey1 = `${rarityData.color}_0.3`;
        const cacheKey2 = `${rarityData.color}_0.6`;
        
        if (!colorCache.has(cacheKey1)) {
            colorCache.set(cacheKey1, this.darkenColor(rarityData.color, 0.3));
        }
        if (!colorCache.has(cacheKey2)) {
            colorCache.set(cacheKey2, this.darkenColor(rarityData.color, 0.6));
        }
        
        gradient.addColorStop(0.7, colorCache.get(cacheKey1));
        gradient.addColorStop(1, colorCache.get(cacheKey2));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(60, 60, 55, 0, Math.PI * 2);
        ctx.fill();
        
        // 外枠
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // 内側の装飾リング
        ctx.strokeStyle = regionData.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(60, 60, 45, 0, Math.PI * 2);
        ctx.stroke();
        
        // 地域シンボル
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText(regionData.symbol, 60, 50);
        
        // 地域名
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(regionData.name, 60, 75);
        
        // レアリティ表示
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.fillText(rarityData.name, 60, 90);
        
        // 装飾パターン（レアリティに応じて）
        this.addRarityEffects(ctx, rarityData, 60, 60, 55);
        
        return ctx.canvas.toDataURL('image/png');
    }
    
    addRarityEffects(ctx, rarityData, centerX, centerY, radius) {
        switch (rarityData.name) {
            case '一般':
                // シンプルな点線
                ctx.setLineDash([2, 2]);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                break;
                
            case '発見':
                // 光る効果
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    const x1 = centerX + Math.cos(angle) * (radius - 5);
                    const y1 = centerY + Math.sin(angle) * (radius - 5);
                    const x2 = centerX + Math.cos(angle) * (radius + 5);
                    const y2 = centerY + Math.sin(angle) * (radius + 5);
                    
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                break;
                
            case '探索':
                // 波紋効果
                for (let i = 0; i < 3; i++) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - i * 0.1})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius - 15 + i * 8, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;
                
            case '冒険':
                // 星形パターン
                for (let i = 0; i < 5; i++) {
                    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                    const x = centerX + Math.cos(angle) * 25;
                    const y = centerY + Math.sin(angle) * 25;
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case '制覇':
                // 豪華な光の輪
                for (let i = 0; i < 16; i++) {
                    const angle = (i * Math.PI * 2) / 16;
                    const x1 = centerX + Math.cos(angle) * (radius - 8);
                    const y1 = centerY + Math.sin(angle) * (radius - 8);
                    const x2 = centerX + Math.cos(angle) * (radius + 8);
                    const y2 = centerY + Math.sin(angle) * (radius + 8);
                    
                    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
                    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
                    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                break;
        }
    }
    
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.floor(parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.floor(parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.floor(parseInt(hex.substr(4, 2), 16) * (1 - factor));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    setupURLHandling() {
        // URLパラメータからバッジ取得を処理
        const urlParams = new URLSearchParams(window.location.search);
        const regionParam = urlParams.get('region');
        const rarityParam = urlParams.get('rarity') || 'common';
        
        if (regionParam && this.regions[regionParam]) {
            this.collectBadge(regionParam, rarityParam);
            
            // URLをクリーンにする
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({path: newUrl}, '', newUrl);
        }
    }
    
    collectBadge(regionId, rarity = 'common') {
        const key = `${regionId}_${rarity}`;
        
        if (!this.collectedBadges.includes(key)) {
            this.collectedBadges.push(key);
            this.saveBadges();
            
            // 効果音とアニメーション
            this.showBadgeNotification(regionId, rarity);
            this.playCollectionSound(rarity);
            
            // SNSシェア提案（3秒後）
            setTimeout(() => {
                this.promptSocialShare(regionId, rarity);
            }, 3000);
            
            // 分析データに記録
            if (window.analyticsSystem) {
                window.analyticsSystem.recordBadgeCollection(regionId, rarity);
            }
            
            console.log(`🏷️ NFCバッジ取得: ${this.regions[regionId].name} (${this.rarityLevels[rarity].name})`);
            return true;
        }
        
        return false;
    }
    
    showBadgeNotification(regionId, rarity) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const badgeImage = this.badgeImages.get(`${regionId}_${rarity}`);
        
        // 通知要素を作成
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            border: 3px solid ${rarityData.color};
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.5s ease;
            max-width: 350px;
        `;
        
        // バッジ画像
        const badgeImg = document.createElement('img');
        badgeImg.src = badgeImage;
        badgeImg.style.cssText = 'width: 60px; height: 60px; border-radius: 50%;';
        
        // テキスト部分
        const textContainer = document.createElement('div');
        textContainer.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: ${rarityData.color};">
                ${rarityData.name}バッジ取得！
            </div>
            <div style="font-size: 14px; margin-top: 5px;">
                ${regionData.name}
            </div>
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
                ${regionData.symbol} 新しい地域を発見しました
            </div>
        `;
        
        notification.appendChild(badgeImg);
        notification.appendChild(textContainer);
        document.body.appendChild(notification);
        
        // アニメーション表示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自動削除
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
    
    playCollectionSound(rarity) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // レアリティに応じて音程を変更
            const frequencies = {
                common: 400,
                uncommon: 500,
                rare: 600,
                epic: 750,
                legendary: 900
            };
            
            const frequency = frequencies[rarity] || 400;
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not available');
        }
    }
    
    generateUniqueURLs() {
        const baseURL = window.location.origin + window.location.pathname;
        const urls = {};
        
        Object.keys(this.regions).forEach(regionId => {
            urls[regionId] = {};
            Object.keys(this.rarityLevels).forEach(rarity => {
                const rarityData = this.rarityLevels[rarity];
                urls[regionId][rarity] = `${baseURL}?region=${regionId}&rarity=${rarity}&spot=${rarityData.urlSuffix}`;
            });
        });
        
        return urls;
    }
    
    getBadgeImage(regionId, rarity = 'common') {
        return this.badgeImages.get(`${regionId}_${rarity}`);
    }
    
    getCollectedBadges() {
        return this.collectedBadges.map(badgeKey => {
            const [regionId, rarity] = badgeKey.split('_');
            return {
                regionId,
                rarity,
                regionName: this.regions[regionId]?.name,
                rarityName: this.rarityLevels[rarity]?.name,
                image: this.getBadgeImage(regionId, rarity)
            };
        });
    }
    
    getCollectionStats() {
        const totalPossible = Object.keys(this.regions).length * Object.keys(this.rarityLevels).length;
        const collected = this.collectedBadges.length;
        
        const byRegion = {};
        const byRarity = {};
        
        // Optimized loop
        for (let i = 0; i < this.collectedBadges.length; i++) {
            const badgeKey = this.collectedBadges[i];
            const [regionId, rarity] = badgeKey.split('_');
            byRegion[regionId] = (byRegion[regionId] || 0) + 1;
            byRarity[rarity] = (byRarity[rarity] || 0) + 1;
        }
        
        return {
            total: collected,
            totalPossible,
            completionRate: (collected / totalPossible) * 100,
            byRegion,
            byRarity,
            regions: Object.keys(this.regions).length,
            rarityLevels: Object.keys(this.rarityLevels).length
        };
    }
    
    exportBadgeData() {
        const data = {
            collected: this.getCollectedBadges(),
            stats: this.getCollectionStats(),
            urls: this.generateUniqueURLs(),
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hakusan-badges-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return data;
    }
    
    loadBadges() {
        try {
            const saved = localStorage.getItem('hakusan_collected_badges');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('バッジデータの読み込みに失敗:', e);
            return [];
        }
    }
    
    saveBadges() {
        try {
            localStorage.setItem('hakusan_collected_badges', JSON.stringify(this.collectedBadges));
        } catch (e) {
            console.error('バッジデータの保存に失敗:', e);
        }
    }
    
    clearAllBadges() {
        if (confirm('すべてのバッジデータを削除しますか？この操作は取り消せません。')) {
            this.collectedBadges = [];
            this.saveBadges();
            console.log('バッジデータを削除しました');
            return true;
        }
        return false;
    }
    
    // RPGエンジンとの連携（NFC専用）
    onRegionDiscovered(regionId) {
        // RPGエンジンからは地域ページ案内のみ - バッジ取得はNFC専用
        console.log(`地域発見: ${this.regions[regionId]?.name} - NFCタグでバッジを取得してください`);
        
        // 地域ページへのアクセス案内のみ
        setTimeout(() => {
            this.promptRegionPageVisit(regionId);
        }, 2000);
    }
    
    // NFCタグ専用バッジ取得
    collectBadgeFromNFC(regionId, rarity = 'common') {
        console.log(`🏷️ NFCタグ検出: ${regionId}`);
        return this.collectBadge(regionId, rarity);
    }
    
    // 地域ページ訪問案内
    promptRegionPageVisit(regionId) {
        const regionData = this.regions[regionId];
        if (!regionData) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9500;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, ${regionData.color}, #FFFFFF);
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                color: white;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 4em; margin-bottom: 20px;">${regionData.symbol}</div>
                <h2 style="margin: 0 0 15px 0;">${regionData.name}を発見！</h2>
                <p style="margin-bottom: 25px; font-size: 1.1em;">
                    この地域の詳細情報や観光スポットを<br>
                    専用ページで確認しませんか？
                </p>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="visitRegionPage('${regionId}')" style="
                        background: rgba(255,255,255,0.9);
                        color: ${regionData.color};
                        border: none;
                        padding: 15px 25px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 1.1em;
                    ">地域ページを見る</button>
                    
                    <button onclick="closeRegionModal()" style="
                        background: rgba(0,0,0,0.3);
                        color: white;
                        border: 2px solid white;
                        padding: 15px 25px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                    ">後で見る</button>
                </div>
            </div>
        `;
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
        
        // グローバル関数を定義
        window.visitRegionPage = function(regionId) {
            const townPages = {
                'tsurugi': 'town/tsurugi.html',
                'mikawa': 'town/mikawa.html', 
                'mattou': 'town/mattou.html',
                'kawachi': 'town/kawachi.html',
                'shiramine': 'town/shiramine.html',
                'yoshinodani': 'town/yoshinodani.html',
                'torigoe': 'town/torigoe.html',
                'oguchi': 'town/oguchi.html'
            };
            
            if (townPages[regionId]) {
                window.location.href = townPages[regionId];
            }
            
            document.body.removeChild(modal);
        };
        
        window.closeRegionModal = function() {
            document.body.removeChild(modal);
        };
        
        document.body.appendChild(modal);
    }
    
    // デバッグ用
    addTestBadge(regionId, rarity = 'common') {
        if (this.regions[regionId] && this.rarityLevels[rarity]) {
            this.collectBadge(regionId, rarity);
        }
    }
    
    // SNSシェア機能
    promptSocialShare(regionId, rarity) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const stats = this.getCollectionStats();
        
        // シェアモーダルを作成
        const modal = this.createShareModal(regionId, rarity, stats);
        document.body.appendChild(modal);
        
        // 3秒後に自動で閉じる（ユーザーが操作しなかった場合）
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 15000);
    }
    
    createShareModal(regionId, rarity, stats) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const badgeImage = this.badgeImages.get(`${regionId}_${rarity}`);
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
            align-items: center; justify-content: center; animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px; border-radius: 20px; max-width: 90%; max-width: 400px;
                text-align: center; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <h2 style="margin: 0 0 20px 0;">バッジ獲得おめでとう！</h2>
                
                <div style="margin: 20px 0;">
                    <img src="${badgeImage}" style="width: 80px; height: 80px; border-radius: 50%;">
                    <h3 style="margin: 10px 0;">${regionData.name} ${rarityData.name}バッジ</h3>
                    <p style="margin: 5px 0; opacity: 0.9;">コレクション進捗: ${stats.collectedCount}/${stats.totalPossible}</p>
                </div>
                
                <p style="margin: 20px 0; font-size: 16px;">みんなにシェアしませんか？</p>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
                    <button onclick="badgeSystem.shareToTwitter('${regionId}', '${rarity}')" style="
                        background: #1DA1F2; color: white; border: none; padding: 12px 20px;
                        border-radius: 25px; cursor: pointer; font-size: 14px; display: flex;
                        align-items: center; gap: 8px; transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        🐦 X (Twitter)
                    </button>
                    
                    <button onclick="badgeSystem.shareToLine('${regionId}', '${rarity}')" style="
                        background: #00C300; color: white; border: none; padding: 12px 20px;
                        border-radius: 25px; cursor: pointer; font-size: 14px; display: flex;
                        align-items: center; gap: 8px; transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        💬 LINE
                    </button>
                    
                    <button onclick="badgeSystem.shareToInstagram('${regionId}', '${rarity}')" style="
                        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
                        color: white; border: none; padding: 12px 20px; border-radius: 25px;
                        cursor: pointer; font-size: 14px; display: flex; align-items: center;
                        gap: 8px; transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        📸 Instagram
                    </button>
                </div>
                
                <button onclick="badgeSystem.shareGeneral('${regionId}', '${rarity}')" style="
                    background: #666; color: white; border: none; padding: 10px 20px;
                    border-radius: 20px; cursor: pointer; font-size: 14px; margin: 10px 5px;
                ">
                    📋 その他の方法でシェア
                </button>
                
                <div style="margin-top: 20px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: rgba(255,255,255,0.2); color: white; border: none;
                        padding: 8px 16px; border-radius: 15px; cursor: pointer; font-size: 12px;
                    ">
                        後で
                    </button>
                </div>
            </div>
        `;
        
        // フェードインアニメーション
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        return modal;
    }
    
    // X (Twitter) シェア
    shareToTwitter(regionId, rarity) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const stats = this.getCollectionStats();
        
        const shareText = `はくさんNFCバッジクエストで${regionData.name}の${rarityData.name}バッジを獲得！${regionData.symbol}
        
現在の進捗: ${stats.collectedCount}/${stats.totalPossible} (${Math.round(stats.completionRate)}%)
        
#はくさんNFCバッジクエスト #白山市 #${regionData.name} #地域探索 #石川県観光`;
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
        
        this.closeShareModal();
    }
    
    // LINE シェア
    shareToLine(regionId, rarity) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const stats = this.getCollectionStats();
        
        const shareText = `はくさんNFCバッジクエストで${regionData.name}の${rarityData.name}バッジを獲得！${regionData.symbol}
        
現在の進捗: ${stats.collectedCount}/${stats.totalPossible}
あなたも一緒に白山市8地域を探索しませんか？`;
        
        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
        window.open(lineUrl, '_blank', 'width=550,height=420');
        
        this.closeShareModal();
    }
    
    // Instagram シェア（ストーリー用テキスト）
    shareToInstagram(regionId, rarity) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const stats = this.getCollectionStats();
        
        const shareText = `はくさんNFCバッジクエスト ${regionData.name}の${rarityData.name}バッジ獲得！${regionData.symbol}
        
進捗: ${stats.collectedCount}/${stats.totalPossible}
        
#はくさんNFCバッジクエスト #白山市 #${regionData.name} #地域探索 #石川県 #観光 #バッジコレクション`;
        
        // Instagram用のテキストをクリップボードにコピー
        navigator.clipboard.writeText(shareText).then(() => {
            alert('📸 Instagramシェア用のテキストをコピーしました！\n\nInstagramアプリを開いて、ストーリーまたは投稿に貼り付けてください。');
        }).catch(() => {
            // フォールバック: テキストエリアに表示
            this.showCopyText(shareText, 'Instagram');
        });
        
        this.closeShareModal();
    }
    
    // その他の方法でシェア
    shareGeneral(regionId, rarity) {
        const regionData = this.regions[regionId];
        const rarityData = this.rarityLevels[rarity];
        const stats = this.getCollectionStats();
        
        const shareText = `はくさんNFCバッジクエストで${regionData.name}の${rarityData.name}バッジを獲得！${regionData.symbol}
        
現在の進捗: ${stats.collectedCount}/${stats.totalPossible} (${Math.round(stats.completionRate)}%)
        
白山市の8地域を巡って、すべてのバッジを集めよう！
${window.location.href}
        
#はくさんNFCバッジクエスト #白山市 #地域探索`;
        
        if (navigator.share) {
            // Web Share API が利用可能な場合
            navigator.share({
                title: `${regionData.name}バッジを獲得！ - 白山地域探索システム`,
                text: shareText,
                url: window.location.href
            }).catch(() => {
                this.showCopyText(shareText, '一般');
            });
        } else {
            // クリップボードにコピー
            this.showCopyText(shareText, '一般');
        }
        
        this.closeShareModal();
    }
    
    showCopyText(text, platform) {
        navigator.clipboard.writeText(text).then(() => {
            alert(`📋 ${platform}シェア用のテキストをクリップボードにコピーしました！\n\nお好きなアプリやSNSに貼り付けてシェアしてください。`);
        }).catch(() => {
            // 最終手段: テキストを表示
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.9); z-index: 10001; display: flex;
                align-items: center; justify-content: center;
            `;
            modal.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 90%; max-width: 500px;">
                    <h3 style="color: #333; margin-bottom: 15px;">📋 シェア用テキスト</h3>
                    <textarea style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" readonly>${text}</textarea>
                    <div style="margin-top: 15px; text-align: center;">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                            background: #007bff; color: white; border: none; padding: 10px 20px;
                            border-radius: 5px; cursor: pointer;">
                            閉じる
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        });
    }
    
    closeShareModal() {
        const modal = document.querySelector('[style*="z-index: 10000"]');
        if (modal) {
            modal.remove();
        }
    }
    
    // バッジコレクション全体をシェア
    shareCollectionProgress() {
        const stats = this.getCollectionStats();
        const completedRegions = this.getCompletedRegions();
        
        let shareText = `はくさんNFCバッジクエスト 進捗報告！
        
コンプリート率: ${Math.round(stats.completionRate)}%
獲得バッジ数: ${stats.collectedCount}/${stats.totalPossible}
`;
        
        if (completedRegions.length > 0) {
            shareText += `\n✅ 制覇済み地域: ${completedRegions.map(r => this.regions[r].name).join('、')}\n`;
        }
        
        shareText += `
白山市の8地域を巡る地域探索ゲーム！
${window.location.href}

#はくさんNFCバッジクエスト #白山市 #地域探索 #バッジコレクション #石川県観光`;
        
        if (navigator.share) {
            navigator.share({
                title: '白山地域探索システム 進捗報告',
                text: shareText,
                url: window.location.href
            });
        } else {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(twitterUrl, '_blank');
        }
    }
    
    getCompletedRegions() {
        const completedRegions = [];
        const rarityKeys = Object.keys(this.rarityLevels);
        
        for (const regionId in this.regions) {
            let hasAllRarities = true;
            for (let i = 0; i < rarityKeys.length; i++) {
                if (!this.collectedBadges.includes(`${regionId}_${rarityKeys[i]}`)) {
                    hasAllRarities = false;
                    break;
                }
            }
            if (hasAllRarities) {
                completedRegions.push(regionId);
            }
        }
        return completedRegions;
    }

    // コレクション進捗表示メソッド
    showCollectionProgress() {
        const stats = this.getCollectionStats();
        const collected = this.getCollectedBadges();
        
        // プログレス表示用のモーダルを作成
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
            align-items: center; justify-content: center; animation: fadeIn 0.3s ease;
        `;
        
        const progressHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px; border-radius: 20px; max-width: 90%; max-width: 600px;
                text-align: center; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                max-height: 80vh; overflow-y: auto;
            ">
                <h2 style="margin: 0 0 20px 0;">バッジコレクション進捗</h2>
                
                <div style="margin: 20px 0; font-size: 18px;">
                    <strong>進捗率: ${Math.round(stats.completionRate)}%</strong><br>
                    獲得バッジ数: ${stats.total}/${stats.totalPossible}
                </div>
                
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px; margin: 20px 0;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                        ${collected.map(badge => `
                            <div style="text-align: center;">
                                <img src="${badge.image}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 8px;">
                                <div style="font-size: 12px;">${badge.regionName}</div>
                                <div style="font-size: 10px; opacity: 0.8;">${badge.rarityName}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <button onclick="window.badgeSystem.shareCollectionProgress()" style="
                        background: #1DA1F2; color: white; border: none; padding: 12px 24px;
                        border-radius: 25px; cursor: pointer; font-size: 14px; margin: 0 10px;
                    ">
                        進捗をシェア
                    </button>
                    <button onclick="window.badgeSystem.exportBadgeData()" style="
                        background: #28a745; color: white; border: none; padding: 12px 24px;
                        border-radius: 25px; cursor: pointer; font-size: 14px; margin: 0 10px;
                    ">
                        データエクスポート
                    </button>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: rgba(255,255,255,0.2); color: white; border: none;
                    padding: 10px 20px; border-radius: 15px; cursor: pointer; font-size: 14px;
                ">
                    閉じる
                </button>
            </div>
        `;
        
        modal.innerHTML = progressHTML;
        document.body.appendChild(modal);
        
        return modal;
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.badgeSystem) {
        window.badgeSystem = new HakusanBadgeSystem();
    }
});

// グローバルエクスポート
window.HakusanBadges = HakusanBadgeSystem;

console.log('はくさんNFCバッジクエスト バッジシステム読み込み完了');

// デバッグ関数（基本情報のみ）
window.debugBadges = () => {
    console.log('バッジシステム情報:');
    console.log('取得済み:', window.badgeSystem.getCollectedBadges());
    const stats = window.badgeSystem.getCollectionStats();
    console.log('基本統計:', {
        total: stats.total,
        totalPossible: stats.totalPossible,
        completion: Math.round(stats.completionRate) + '%',
        regions: stats.regions,
        rarityLevels: stats.rarityLevels
    });
};

// 進捗シェア用グローバル関数
window.shareBadgeProgress = () => {
    if (window.badgeSystem) {
        window.badgeSystem.shareCollectionProgress();
    }
};

// UIアクセス用のエイリアス関数を追加
if (typeof window !== 'undefined') {
    // showBadgeModal エイリアス
    window.showBadgeModalAlias = function() {
        if (window.badgeSystem) {
            window.badgeSystem.showCollectionProgress();
        }
    };
    
    // showSocialShareModal エイリアス  
    window.showSocialShareModalAlias = function() {
        if (window.badgeSystem) {
            window.badgeSystem.shareCollectionProgress();
        }
    };
}
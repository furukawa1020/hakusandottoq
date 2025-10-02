// 白山市観光バッジコレクター（完全リニューアル版）- 著作権コンプライアンス対応
// すべての商業的著作権表現を除去し、画像ベースのバッジシステムを実装

// ===== 地域データ =====
const regions = {
    tsurugi: '鶴来地区',
    mikawa: '美川地区',
    mattou: '松任地区',
    kawachi: '河内地区',
    shiramine: '白峰地区',
    yoshinodani: '吉野谷地区',
    torigoe: '鳥越地区',
    oguchi: '尾口地区'
};

// ===== バッジ画像マッピング =====
const badgeImages = {
    tsurugi: '/images/badges/tsurugi-badge.png',
    mikawa: '/images/badges/mikawa-badge.png',
    mattou: '/images/badges/mattou-badge.png',
    kawachi: '/images/badges/kawachi-badge.png',
    shiramine: '/images/badges/shiramine-badge.png',
    yoshinodani: '/images/badges/yoshinodani-badge.png',
    torigoe: '/images/badges/torigoe-badge.png',
    oguchi: '/images/badges/oguchi-badge.png'
};

// ===== グローバル変数 =====
let deferredPrompt;
let isInstallPromptAvailable = false;

// ===== PWA関連機能 =====
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWAインストールプロンプト検出');
    e.preventDefault();
    deferredPrompt = e;
    isInstallPromptAvailable = true;
    showInstallButton();
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWAアプリがインストールされました');
    hideInstallButton();
    deferredPrompt = null;
    isInstallPromptAvailable = false;
});

function showInstallButton() {
    const installSection = document.getElementById('pwaInstallSection');
    if (installSection) {
        installSection.classList.add('show');
    }
}

function hideInstallButton() {
    const installSection = document.getElementById('pwaInstallSection');
    if (installSection) {
        installSection.classList.remove('show');
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        console.log('❌ インストールプロンプトが利用できません');
        return;
    }

    try {
        const installBtn = document.getElementById('pwaInstallBtn');
        installBtn.disabled = true;
        installBtn.textContent = '📱 インストール中...';

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`🔔 ユーザーの選択: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('✅ ユーザーがPWAインストールを承認');
        } else {
            console.log('❌ ユーザーがPWAインストールを拒否');
            installBtn.disabled = false;
            installBtn.textContent = '📱 アプリとしてインストール';
        }
        
        deferredPrompt = null;
        isInstallPromptAvailable = false;
    } catch (error) {
        console.error('❌ PWAインストールエラー:', error);
        const installBtn = document.getElementById('pwaInstallBtn');
        installBtn.disabled = false;
        installBtn.textContent = '📱 アプリとしてインストール';
    }
}

// ===== バッジシステム =====
function getBadges() {
    const badges = localStorage.getItem('hakusan_badges');
    return badges ? JSON.parse(badges) : [];
}

function saveBadges(badges) {
    localStorage.setItem('hakusan_badges', JSON.stringify(badges));
}

function addBadge(regionId) {
    const badges = getBadges();
    
    if (!badges.includes(regionId)) {
        badges.push(regionId);
        saveBadges(badges);
        
        // カスタムイベントを発火（分析システム用）
        window.dispatchEvent(new CustomEvent('badgeCollected', {
            detail: { badgeId: regionId, timestamp: Date.now() }
        }));
        
        console.log(`🏅 新しいバッジを取得: ${regions[regionId]}`);
        return true;
    }
    
    console.log(`ℹ️ 既に取得済み: ${regions[regionId]}`);
    return false;
}

function createBadgeElement(regionId, isObtained = false) {
    const badgeElement = document.createElement('div');
    badgeElement.className = `badge ${isObtained ? 'obtained' : 'locked'}`;
    badgeElement.dataset.region = regionId;
    
    const imageElement = document.createElement('img');
    imageElement.src = badgeImages[regionId];
    imageElement.alt = `${regions[regionId]}バッジ`;
    imageElement.className = 'badge-image';
    
    // 画像が見つからない場合のフォールバック
    imageElement.onerror = () => {
        imageElement.src = generateBadgeImageFallback(regionId);
    };
    
    const labelElement = document.createElement('div');
    labelElement.className = 'badge-label';
    labelElement.textContent = regions[regionId];
    
    badgeElement.appendChild(imageElement);
    badgeElement.appendChild(labelElement);
    
    return badgeElement;
}

function generateBadgeImageFallback(regionId) {
    // Canvas APIを使用してフォールバック画像を生成
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // 背景グラデーション
    const gradient = ctx.createRadialGradient(50, 50, 10, 50, 50, 50);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, Math.PI * 2);
    ctx.fill();
    
    // 境界線
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // テキスト
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(regions[regionId].substr(0, 2), 50, 55);
    
    return canvas.toDataURL();
}

function updateBadgeDisplay() {
    const badgeContainer = document.getElementById('badges');
    if (!badgeContainer) return;
    
    badgeContainer.innerHTML = '';
    
    const obtainedBadges = getBadges();
    
    // バッジ表示順序を定義
    const displayOrder = ['tsurugi', 'mikawa', 'mattou', 'kawachi', 'shiramine', 'yoshinodani', 'torigoe', 'oguchi'];
    
    displayOrder.forEach(regionId => {
        const isObtained = obtainedBadges.includes(regionId);
        const badgeElement = createBadgeElement(regionId, isObtained);
        badgeContainer.appendChild(badgeElement);
    });
    
    updateProgressStats();
}

function updateProgressStats() {
    const obtainedBadges = getBadges();
    const totalBadges = Object.keys(regions).length;
    const obtainedCount = obtainedBadges.length;
    
    // プログレスバー更新
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const percentage = (obtainedCount / totalBadges) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    // 統計表示更新
    const statsElement = document.getElementById('collectionStats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">取得済み:</span>
                <span class="stat-value">${obtainedCount} / ${totalBadges}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">達成率:</span>
                <span class="stat-value">${Math.round((obtainedCount / totalBadges) * 100)}%</span>
            </div>
        `;
    }
    
    // 完了メッセージ
    if (obtainedCount === totalBadges) {
        showCompletionMessage();
    }
}

function showCompletionMessage() {
    const messageElement = document.createElement('div');
    messageElement.className = 'completion-message';
    messageElement.innerHTML = `
        <div class="completion-content">
            <h2>🎉 コンプリート！</h2>
            <p>白山市全8地区のバッジをすべて取得しました！</p>
            <p>素晴らしい観光の旅をありがとうございました。</p>
        </div>
    `;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function showBadgeNotification(regionId) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <img src="${badgeImages[regionId]}" alt="${regions[regionId]}バッジ" class="notification-badge">
            <div class="notification-text">
                <h3>新しいバッジを取得！</h3>
                <p>${regions[regionId]}バッジ</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== URL処理とバッジ取得 =====
function processURLBadge() {
    const urlParams = new URLSearchParams(window.location.search);
    const badgeParam = urlParams.get('badge');
    
    if (badgeParam && regions[badgeParam]) {
        const isNewBadge = addBadge(badgeParam);
        
        if (isNewBadge) {
            showBadgeNotification(badgeParam);
            updateBadgeDisplay();
        }
        
        // URLからパラメータを削除
        const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newURL}, '', newURL);
    }
}

// ===== 地域ページナビゲーション =====
function navigateToRegion(regionId) {
    if (regions[regionId]) {
        window.location.href = `town/${regionId}.html`;
    }
}

// ===== AR写真機能 =====
function openARPhoto() {
    if (window.arPhotoSystem) {
        window.arPhotoSystem.startCamera();
    } else {
        alert('AR写真機能を読み込み中です。少々お待ちください。');
    }
}

// ===== 地域画像ギャラリー =====
function openLocationGallery() {
    if (window.locationImageSystem) {
        const galleryContainer = document.getElementById('locationGallery');
        if (!galleryContainer) {
            // ギャラリーコンテナを作成
            const container = document.createElement('div');
            container.id = 'locationGallery';
            container.className = 'modal-overlay';
            container.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📸 地域フォトギャラリー</h2>
                        <button onclick="closeLocationGallery()" class="close-btn">×</button>
                    </div>
                    <div id="galleryContent"></div>
                </div>
            `;
            document.body.appendChild(container);
        }
        
        window.locationImageSystem.displayLocationGallery('galleryContent');
        document.getElementById('locationGallery').style.display = 'flex';
    } else {
        alert('画像ギャラリーを読み込み中です。少々お待ちください。');
    }
}

function closeLocationGallery() {
    const galleryContainer = document.getElementById('locationGallery');
    if (galleryContainer) {
        galleryContainer.style.display = 'none';
    }
}

// ===== データエクスポート機能 =====
function exportCollectionData() {
    const data = {
        badges: getBadges(),
        timestamp: new Date().toISOString(),
        version: '2.0',
        regions: regions
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hakusan-collection-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== 研究データエクスポート =====
function exportResearchData() {
    if (window.serverlessAnalytics) {
        window.serverlessAnalytics.exportResearchData();
    } else {
        alert('分析システムを読み込み中です。少々お待ちください。');
    }
}

// ===== 設定機能 =====
function clearAllData() {
    if (confirm('すべてのバッジデータを削除しますか？この操作は取り消せません。')) {
        localStorage.removeItem('hakusan_badges');
        updateBadgeDisplay();
        alert('データを削除しました。');
    }
}

// ===== イベントリスナー設定 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 白山市観光バッジアプリを初期化中...');
    
    // 基本機能の初期化
    updateBadgeDisplay();
    processURLBadge();
    
    // 新機能の初期化を待機
    let retryCount = 0;
    const maxRetries = 10;
    
    const initializeAdvancedFeatures = () => {
        retryCount++;
        
        if (window.rarityBadgeSystem) {
            console.log('✅ レアリティバッジシステム初期化完了');
        }
        
        if (window.serverlessAnalytics) {
            console.log('✅ サーバーレス分析システム初期化完了');
        }
        
        if (window.locationImageSystem) {
            console.log('✅ 位置画像システム初期化完了');
        }
        
        if (window.arPhotoSystem) {
            console.log('✅ AR写真システム初期化完了');
        }
        
        if (window.pixelAvatarSystem) {
            console.log('✅ ピクセルアバターシステム初期化完了');
        }
        
        // 全機能が読み込まれていない場合は再試行
        if (retryCount < maxRetries && (!window.rarityBadgeSystem || !window.serverlessAnalytics)) {
            setTimeout(initializeAdvancedFeatures, 500);
        } else {
            console.log('🎮 アプリの初期化が完了しました！');
        }
    };
    
    setTimeout(initializeAdvancedFeatures, 1000);
});

// ===== ページ表示時の処理 =====
window.addEventListener('focus', () => {
    // ページが再フォーカスされた時にバッジ表示を更新
    updateBadgeDisplay();
});

// ===== オフライン対応 =====
window.addEventListener('online', () => {
    console.log('🌐 オンラインに復帰しました');
});

window.addEventListener('offline', () => {
    console.log('📴 オフラインモードになりました');
});

// ===== スタイル追加 =====
function addBadgeStyles() {
    if (document.getElementById('badge-system-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'badge-system-styles';
    styles.textContent = `
        .badges-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            border-radius: 12px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .badge.obtained {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
        }
        
        .badge.locked {
            opacity: 0.5;
            filter: grayscale(1);
        }
        
        .badge:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .badge-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
            margin-bottom: 10px;
        }
        
        .badge-label {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            color: #2c3e50;
        }
        
        .badge-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            padding: 20px;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }
        
        .badge-notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .notification-badge {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
        
        .notification-text h3 {
            margin: 0 0 5px 0;
            color: #27ae60;
            font-size: 16px;
        }
        
        .notification-text p {
            margin: 0;
            color: #2c3e50;
            font-size: 14px;
        }
        
        .completion-message {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .completion-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
        }
        
        .completion-content h2 {
            color: #f39c12;
            margin-bottom: 20px;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1500;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #galleryContent {
            overflow-y: auto;
            padding: 20px;
        }
        
        #collectionStats {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            margin: 20px 0;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-label {
            display: block;
            font-size: 14px;
            color: #7f8c8d;
            margin-bottom: 5px;
        }
        
        .stat-value {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        #progressBar {
            height: 8px;
            background: #3498db;
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        
        .progress-container {
            background: #ecf0f1;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
    `;
    
    document.head.appendChild(styles);
}

// スタイルを即座に追加
addBadgeStyles();

// ===== デバッグ用関数 =====
window.debugBadgeSystem = () => {
    console.log('🔍 バッジシステムデバッグ情報:');
    console.log('取得済みバッジ:', getBadges());
    console.log('地域データ:', regions);
    console.log('画像パス:', badgeImages);
};

console.log('🎯 白山市観光バッジシステムv2.0 読み込み完了！');
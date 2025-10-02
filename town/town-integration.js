// 町ページ用統合システム
class TownPageIntegration {
    constructor() {
        this.currentTown = this.detectCurrentTown();
        this.init();
    }
    
    init() {
        this.setupPhotoGallery();
        this.setupSocialShare();
        this.setupBadgeIntegration();
        this.setupNavigation();
        console.log(`🏘️ 町ページ統合システム初期化完了: ${this.currentTown}`);
    }
    
    detectCurrentTown() {
        const path = window.location.pathname;
        const townMatch = path.match(/\/town\/(\w+)\.html/);
        return townMatch ? townMatch[1] : null;
    }
    
    setupPhotoGallery() {
        if (!this.currentTown || !window.regionPhotos) return;
        
        // 写真ギャラリーの動的生成
        const photoContainer = document.getElementById(`${this.currentTown}Photos`);
        if (photoContainer) {
            this.displayRegionPhotos(this.currentTown);
        }
        
        // 写真ビューアーのスタイル追加
        this.addPhotoStyles();
    }
    
    displayRegionPhotos(regionId) {
        const photos = window.regionPhotos.getRegionPhotos(regionId);
        const container = document.getElementById(`${regionId}Photos`);
        
        if (container && photos) {
            container.innerHTML = photos.map((photo, index) => `
                <div class="photo-thumbnail" onclick="window.townIntegration.openPhotoDetail('${regionId}', ${index})">
                    <img src="${photo.dataURL}" alt="${photo.name}" loading="lazy" />
                    <div class="photo-caption">
                        <h4>${photo.name}</h4>
                        <p>${photo.description}</p>
                    </div>
                    <div class="photo-overlay">
                        <span class="view-icon">👁️</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    addPhotoStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .region-photos {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            
            .photo-thumbnail {
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }
            
            .photo-thumbnail:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            
            .photo-thumbnail img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .photo-thumbnail:hover img {
                transform: scale(1.05);
            }
            
            .photo-caption {
                padding: 15px;
            }
            
            .photo-caption h4 {
                margin: 0 0 5px 0;
                color: #333;
                font-size: 16px;
            }
            
            .photo-caption p {
                margin: 0;
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .photo-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .photo-thumbnail:hover .photo-overlay {
                opacity: 1;
            }
            
            .view-icon {
                font-size: 48px;
                color: white;
            }
            
            .photo-view-btn {
                background: linear-gradient(45deg, #4ECDC4, #45B7D1);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .photo-view-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(76, 205, 196, 0.3);
            }
            
            .share-section {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                margin: 30px 0;
                text-align: center;
            }
            
            .share-section h2 {
                margin-top: 0;
                margin-bottom: 15px;
            }
            
            .share-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 20px;
            }
            
            .share-btn {
                padding: 12px 20px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
            }
            
            .share-btn.twitter {
                background: #1DA1F2;
                color: white;
            }
            
            .share-btn.line {
                background: #00B900;
                color: white;
            }
            
            .share-btn.general {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 2px solid rgba(255,255,255,0.3);
            }
            
            .share-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .stamp-status-display {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px 20px;
                background: rgba(255,255,255,0.1);
                border-radius: 25px;
                margin: 20px 0;
            }
            
            .stamp-status-display.obtained {
                background: rgba(46, 204, 113, 0.2);
                border: 2px solid #2ecc71;
            }
            
            .stamp-icon {
                font-size: 24px;
            }
            
            .stamp-text {
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupSocialShare() {
        // ソーシャルシェア機能はHTMLに直接実装済み
    }
    
    setupBadgeIntegration() {
        if (!this.currentTown || !window.badgeSystem) return;
        
        // バッジ状態の表示
        this.updateBadgeStatus();
        
        // バッジ取得イベントのリスナー
        window.addEventListener('badgeCollected', (event) => {
            if (event.detail.regionId === this.currentTown) {
                this.updateBadgeStatus();
                this.showBadgeNotification(event.detail);
            }
        });
    }
    
    updateBadgeStatus() {
        const badges = window.badgeSystem.getCollectedBadges();
        const hasBadge = badges.some(badge => badge.regionId === this.currentTown);
        
        const statusElement = document.getElementById('stampStatus');
        if (statusElement) {
            if (hasBadge) {
                statusElement.innerHTML = `
                    <span class="stamp-icon obtained">✅</span>
                    <span class="stamp-text">バッジ取得済み！</span>
                `;
                statusElement.classList.add('obtained');
            } else {
                statusElement.innerHTML = `
                    <span class="stamp-icon pending">📍</span>
                    <span class="stamp-text">バッジを取得しよう！</span>
                `;
                statusElement.classList.remove('obtained');
            }
        }
    }
    
    showBadgeNotification(badgeData) {
        const notification = document.createElement('div');
        notification.className = 'badge-obtained-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #2ecc71, #27ae60);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.5s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 48px;">🏅</div>
                <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 18px;">バッジ取得！</h3>
                    <p style="margin: 0; opacity: 0.9;">${badgeData.regionName}バッジを獲得しました</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
    
    setupNavigation() {
        // RPGマップへの戻るボタンを追加
        this.addNavigationButtons();
    }
    
    addNavigationButtons() {
        const nav = document.createElement('div');
        nav.className = 'town-navigation';
        nav.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            gap: 15px;
            justify-content: center;
            z-index: 1000;
        `;
        
        nav.innerHTML = `
            <button class="nav-btn back-to-map" onclick="window.townIntegration.backToMap()">
                🗺️ マップに戻る
            </button>
            <button class="nav-btn open-camera" onclick="window.townIntegration.openARCamera()">
                📷 AR写真
            </button>
            <button class="nav-btn view-photos" onclick="window.townIntegration.openRegionPhotos()">
                🖼️ 写真ギャラリー
            </button>
        `;
        
        // ナビゲーションボタンのスタイル
        const navStyle = document.createElement('style');
        navStyle.textContent = `
            .town-navigation .nav-btn {
                background: rgba(76, 205, 196, 0.9);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .town-navigation .nav-btn:hover {
                background: rgba(76, 205, 196, 1);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(76, 205, 196, 0.3);
            }
        `;
        document.head.appendChild(navStyle);
        document.body.appendChild(nav);
    }
    
    // 外部から呼び出し可能なメソッド
    openPhotoDetail(regionId, photoIndex) {
        if (window.regionPhotos) {
            window.regionPhotos.openViewer(regionId, photoIndex);
        }
    }
    
    openRegionPhotos() {
        if (this.currentTown && window.regionPhotos) {
            window.regionPhotos.openViewer(this.currentTown, 0);
        }
    }
    
    backToMap() {
        window.location.href = '../index.html';
    }
    
    openARCamera() {
        if (window.arCamera) {
            const badgeData = this.getCurrentTownBadge();
            window.arCamera.openWithBadge(this.currentTown, badgeData?.rarity || 'common');
        } else {
            alert('ARカメラ機能を読み込み中です...');
        }
    }
    
    getCurrentTownBadge() {
        if (!window.badgeSystem) return null;
        
        const badges = window.badgeSystem.getCollectedBadges();
        return badges.find(badge => badge.regionId === this.currentTown);
    }
    
    shareTownExperience(townId, platform) {
        const townNames = {
            'mattou': '松任',
            'mikawa': '美川',
            'tsurugi': '鶴来',
            'kawachi': '河内',
            'shiramine': '白峰',
            'yoshinodani': '吉野谷',
            'torigoe': '鳥越',
            'oguchi': '尾口'
        };
        
        const townName = townNames[townId];
        const shareText = `はくさんNFCバッジクエストで${townName}地区を探索中！ #はくさんNFCバッジクエスト #白山市 #${townName}`;
        const shareUrl = window.location.href;
        
        switch (platform) {
            case 'twitter':
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(twitterUrl, '_blank');
                break;
                
            case 'line':
                const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                window.open(lineUrl, '_blank');
                break;
                
            case 'general':
                if (navigator.share) {
                    navigator.share({
                        title: `はくさんNFCバッジクエスト - ${townName}`,
                        text: shareText,
                        url: shareUrl
                    });
                } else {
                    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
                        alert('シェア用テキストをクリップボードにコピーしました！');
                    });
                }
                break;
        }
        
        // 分析データ記録
        if (window.analyticsSystem) {
            window.analyticsSystem.recordFeatureUsage('town_share', {
                townId,
                platform
            });
        }
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.townIntegration = new TownPageIntegration();
});

console.log('🏘️ 町ページ統合システム読み込み完了');
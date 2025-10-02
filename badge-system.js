// 白山市バッジシステム（画像ベース・商用権フリー）
class HakusanBadgeSystem {
    constructor() {
        this.regions = {
            tsurugi: { name: '鶴来地区', color: '#FF6B6B', symbol: '⛩️' },
            mikawa: { name: '美川地区', color: '#4ECDC4', symbol: '🌊' },
            mattou: { name: '松任地区', color: '#45B7D1', symbol: '🏛️' },
            kawachi: { name: '河内地区', color: '#96CEB4', symbol: '🏞️' },
            shiramine: { name: '白峰地区', color: '#FFEAA7', symbol: '⛰️' },
            yoshinodani: { name: '吉野谷地区', color: '#DDA0DD', symbol: '🌸' },
            torigoe: { name: '鳥越地区', color: '#F4A261', symbol: '🏰' },
            oguchi: { name: '尾口地区', color: '#E76F51', symbol: '🏔️' }
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
        console.log('🏅 バッジシステム初期化完了');
    }
    
    generateBadgeImages() {
        Object.entries(this.regions).forEach(([regionId, regionData]) => {
            Object.entries(this.rarityLevels).forEach(([rarity, rarityData]) => {
                const badgeImage = this.createBadgeImage(regionData, rarityData);
                this.badgeImages.set(`${regionId}_${rarity}`, badgeImage);
            });
        });
    }
    
    createBadgeImage(regionData, rarityData) {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        // 背景グラデーション
        const gradient = ctx.createRadialGradient(60, 60, 20, 60, 60, 60);
        gradient.addColorStop(0, rarityData.color);
        gradient.addColorStop(0.7, this.darkenColor(rarityData.color, 0.3));
        gradient.addColorStop(1, this.darkenColor(rarityData.color, 0.6));
        
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
        
        return canvas.toDataURL('image/png');
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
            
            // 分析データに記録
            if (window.analyticsSystem) {
                window.analyticsSystem.recordBadgeCollection(regionId, rarity);
            }
            
            console.log(`🏅 バッジ取得: ${this.regions[regionId].name} (${this.rarityLevels[rarity].name})`);
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
        
        this.collectedBadges.forEach(badgeKey => {
            const [regionId, rarity] = badgeKey.split('_');
            byRegion[regionId] = (byRegion[regionId] || 0) + 1;
            byRarity[rarity] = (byRarity[rarity] || 0) + 1;
        });
        
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
            console.log('🗑️ バッジデータを削除しました');
            return true;
        }
        return false;
    }
    
    // RPGエンジンとの連携
    onRegionDiscovered(regionId) {
        // RPGエンジンから地域発見時に呼ばれる
        this.collectBadge(regionId, 'common');
    }
    
    // デバッグ用
    addTestBadge(regionId, rarity = 'common') {
        if (this.regions[regionId] && this.rarityLevels[rarity]) {
            this.collectBadge(regionId, rarity);
        }
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.badgeSystem = new HakusanBadgeSystem();
});

console.log('🏅 白山バッジシステム読み込み完了');

// デバッグ関数
window.debugBadges = () => {
    console.log('🔍 バッジシステム情報:');
    console.log('取得済み:', window.badgeSystem.getCollectedBadges());
    console.log('統計:', window.badgeSystem.getCollectionStats());
    console.log('URL一覧:', window.badgeSystem.generateUniqueURLs());
};
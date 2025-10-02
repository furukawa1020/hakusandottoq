// レアリティ別URL取得システム
class RegionalBadgeSystem {
    constructor() {
        this.regions = {
            tsurugi: {
                name: '鶴来',
                rarity: 'common',
                urls: [
                    '?badge=tsurugi-shrine',  // 白山比咩神社
                    '?badge=tsurugi-river',   // 手取川
                    '?badge=tsurugi-town'     // 鶴来市街
                ],
                spots: [
                    { name: '白山比咩神社', rarity: 'rare' },
                    { name: '手取川', rarity: 'common' },
                    { name: '鶴来市街', rarity: 'common' }
                ]
            },
            mikawa: {
                name: '美川',
                rarity: 'common', 
                urls: [
                    '?badge=mikawa-coast',    // 美川海岸
                    '?badge=mikawa-port',     // 美川漁港
                    '?badge=mikawa-onsen'     // 美川温泉
                ],
                spots: [
                    { name: '美川海岸', rarity: 'common' },
                    { name: '美川漁港', rarity: 'uncommon' },
                    { name: '美川温泉', rarity: 'common' }
                ]
            },
            mattou: {
                name: '松任',
                rarity: 'common',
                urls: [
                    '?badge=mattou-station',  // 松任駅
                    '?badge=mattou-city',     // 白山市役所
                    '?badge=mattou-park'      // 松任海浜公園
                ],
                spots: [
                    { name: '松任駅', rarity: 'common' },
                    { name: '白山市役所', rarity: 'common' },
                    { name: '松任海浜公園', rarity: 'uncommon' }
                ]
            },
            kawachi: {
                name: '河内',
                rarity: 'uncommon',
                urls: [
                    '?badge=kawachi-valley',  // 手取渓谷
                    '?badge=kawachi-village', // 河内村
                    '?badge=kawachi-falls'    // 綿ヶ滝
                ],
                spots: [
                    { name: '手取渓谷', rarity: 'rare' },
                    { name: '河内村', rarity: 'uncommon' },
                    { name: '綿ヶ滝', rarity: 'rare' }
                ]
            },
            shiramine: {
                name: '白峰',
                rarity: 'legendary',
                urls: [
                    '?badge=shiramine-onsen',   // 白峰温泉
                    '?badge=shiramine-trail',   // 白山登山口
                    '?badge=shiramine-village'  // 白峰集落
                ],
                spots: [
                    { name: '白峰温泉', rarity: 'rare' },
                    { name: '白山登山口', rarity: 'legendary' },
                    { name: '白峰集落', rarity: 'epic' }
                ]
            },
            yoshinodani: {
                name: '吉野谷',
                rarity: 'uncommon',
                urls: [
                    '?badge=yoshinodani-onsen', // 中宮温泉
                    '?badge=yoshinodani-craft', // 吉野工芸の里
                    '?badge=yoshinodani-road'   // 白山スーパー林道
                ],
                spots: [
                    { name: '中宮温泉', rarity: 'rare' },
                    { name: '吉野工芸の里', rarity: 'uncommon' },
                    { name: '白山スーパー林道', rarity: 'epic' }
                ]
            },
            torigoe: {
                name: '鳥越',
                rarity: 'rare',
                urls: [
                    '?badge=torigoe-castle',  // 鳥越城跡
                    '?badge=torigoe-museum',  // 鳥越一向一揆歴史館
                    '?badge=torigoe-dam'      // 手取川ダム
                ],
                spots: [
                    { name: '鳥越城跡', rarity: 'epic' },
                    { name: '鳥越一向一揆歴史館', rarity: 'rare' },
                    { name: '手取川ダム', rarity: 'uncommon' }
                ]
            },
            oguchi: {
                name: '尾口',
                rarity: 'epic',
                urls: [
                    '?badge=oguchi-falls',    // 姥ヶ滝
                    '?badge=oguchi-village',  // 尾口村
                    '?badge=oguchi-park'      // 白山国立公園
                ],
                spots: [
                    { name: '姥ヶ滝', rarity: 'legendary' },
                    { name: '尾口村', rarity: 'epic' },
                    { name: '白山国立公園', rarity: 'rare' }
                ]
            }
        };
        
        this.rarityColors = {
            common: '#95A5A6',     // グレー
            uncommon: '#2ECC71',   // グリーン
            rare: '#3498DB',       // ブルー
            epic: '#9B59B6',       // パープル
            legendary: '#F39C12'   // ゴールド
        };
        
        this.init();
    }

    init() {
        this.checkURLForBadge();
        this.updateBadgeURLs();
    }

    checkURLForBadge() {
        const urlParams = new URLSearchParams(window.location.search);
        const badgeParam = urlParams.get('badge');
        
        if (badgeParam) {
            const result = this.processBadgeURL(badgeParam);
            if (result.success) {
                this.awardBadge(result.regionId, result.spotInfo, result.rarity);
                
                // URL をクリーンアップ
                const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({path: newURL}, '', newURL);
            }
        }
    }

    processBadgeURL(badgeParam) {
        // URL パラメータからリージョンとスポットを解析
        for (const [regionId, regionData] of Object.entries(this.regions)) {
            for (let i = 0; i < regionData.urls.length; i++) {
                const url = regionData.urls[i];
                const expectedParam = url.split('=')[1];
                
                if (badgeParam === expectedParam) {
                    return {
                        success: true,
                        regionId: regionId,
                        spotInfo: regionData.spots[i],
                        rarity: regionData.spots[i].rarity,
                        regionRarity: regionData.rarity
                    };
                }
            }
        }
        
        // 従来の単純なregion指定も対応
        if (this.regions[badgeParam]) {
            return {
                success: true,
                regionId: badgeParam,
                spotInfo: { name: this.regions[badgeParam].name, rarity: this.regions[badgeParam].rarity },
                rarity: this.regions[badgeParam].rarity,
                regionRarity: this.regions[badgeParam].rarity
            };
        }
        
        return { success: false };
    }

    awardBadge(regionId, spotInfo, rarity) {
        console.log(`🏅 バッジ取得: ${spotInfo.name} (${rarity})`);
        
        // 既存のバッジシステムと連携
        if (typeof addStamp === 'function') {
            addStamp(regionId);
        }
        
        // レアリティ情報を保存
        this.saveRarityInfo(regionId, spotInfo, rarity);
        
        // 通知表示
        this.showBadgeNotification(regionId, spotInfo, rarity);
        
        // 統計記録
        if (window.realStatsSystem) {
            window.realStatsSystem.trackBadgeCollection(regionId);
        }
    }

    saveRarityInfo(regionId, spotInfo, rarity) {
        const rarityData = JSON.parse(localStorage.getItem('hakusan_badge_rarity') || '{}');
        
        rarityData[regionId] = {
            spot: spotInfo,
            rarity: rarity,
            obtainedAt: Date.now(),
            obtainedDate: new Date().toISOString()
        };
        
        localStorage.setItem('hakusan_badge_rarity', JSON.stringify(rarityData));
    }

    showBadgeNotification(regionId, spotInfo, rarity) {
        const regionName = this.regions[regionId].name;
        const rarityColor = this.rarityColors[rarity];
        
        const notification = document.createElement('div');
        notification.className = 'rarity-badge-notification';
        notification.innerHTML = `
            <div class="rarity-notification-content">
                <div class="rarity-badge-icon" style="border-color: ${rarityColor}; box-shadow: 0 0 20px ${rarityColor};">
                    <img src="images/badges/${regionId}.png" alt="${regionName}バッジ">
                </div>
                <div class="rarity-notification-text">
                    <h3>${regionName}地域バッジ取得！</h3>
                    <p class="spot-name">${spotInfo.name}</p>
                    <p class="rarity-text" style="color: ${rarityColor};">
                        ★ ${this.getRarityDisplayName(rarity)} ★
                    </p>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2C3E50, #34495E);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 350px;
            animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 4.5s;
            border: 2px solid ${rarityColor};
        `;
        
        document.body.appendChild(notification);
        
        // レアリティ効果音
        this.playRaritySound(rarity);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    getRarityDisplayName(rarity) {
        const names = {
            common: 'コモン',
            uncommon: 'アンコモン', 
            rare: 'レア',
            epic: 'エピック',
            legendary: 'レジェンダリー'
        };
        return names[rarity] || rarity;
    }

    playRaritySound(rarity) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // レアリティに応じた音程
            const frequencies = {
                common: [400, 500],
                uncommon: [500, 600, 700],
                rare: [600, 750, 900],
                epic: [700, 850, 1000, 1200],
                legendary: [800, 1000, 1200, 1400, 1600]
            };
            
            const freqList = frequencies[rarity] || frequencies.common;
            
            freqList.forEach((freq, index) => {
                setTimeout(() => {
                    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                }, index * 150);
            });
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + freqList.length * 0.3);
            
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    updateBadgeURLs() {
        // 既存のボタンにレアリティ情報を追加
        Object.keys(this.regions).forEach(regionId => {
            const visitButtons = document.querySelectorAll(`[data-town="${regionId}"] .visit-btn`);
            visitButtons.forEach(btn => {
                const region = this.regions[regionId];
                btn.setAttribute('data-rarity', region.rarity);
                btn.style.borderLeft = `4px solid ${this.rarityColors[region.rarity]}`;
            });
        });
    }

    generateQRCode(regionId, spotIndex = 0) {
        const region = this.regions[regionId];
        if (!region || !region.urls[spotIndex]) return null;
        
        const fullURL = window.location.origin + window.location.pathname + region.urls[spotIndex];
        
        // QRコード生成（簡易版）
        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullURL)}`;
        
        return {
            qrCodeURL: qrURL,
            badgeURL: fullURL,
            spot: region.spots[spotIndex],
            rarity: region.spots[spotIndex].rarity
        };
    }

    getAllBadgeURLs() {
        const allURLs = [];
        
        Object.entries(this.regions).forEach(([regionId, regionData]) => {
            regionData.urls.forEach((url, index) => {
                const fullURL = window.location.origin + window.location.pathname + url;
                allURLs.push({
                    regionId,
                    regionName: regionData.name,
                    spotName: regionData.spots[index].name,
                    rarity: regionData.spots[index].rarity,
                    url: fullURL,
                    qrCode: this.generateQRCode(regionId, index)
                });
            });
        });
        
        return allURLs;
    }

    getRarityStats() {
        const rarityData = JSON.parse(localStorage.getItem('hakusan_badge_rarity') || '{}');
        const stats = {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0,
            total: 0
        };
        
        Object.values(rarityData).forEach(badge => {
            if (stats.hasOwnProperty(badge.rarity)) {
                stats[badge.rarity]++;
                stats.total++;
            }
        });
        
        return stats;
    }
}

// CSS スタイル
const rarityCSS = `
.rarity-badge-notification {
    font-family: 'Noto Sans JP', sans-serif;
}

.rarity-notification-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.rarity-badge-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.rarity-badge-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.rarity-notification-text h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.spot-name {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    opacity: 0.9;
}

.rarity-text {
    margin: 0.5rem 0 0 0;
    font-weight: bold;
    font-size: 0.9rem;
    text-shadow: 0 0 10px currentColor;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

.badge-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.badge-img.obtained {
    filter: brightness(1.1) contrast(1.1);
}

.badge-img.unknown {
    filter: grayscale(1) brightness(0.7);
}
`;

// CSS を動的に追加
if (!document.querySelector('#rarity-system-styles')) {
    const style = document.createElement('style');
    style.id = 'rarity-system-styles';
    style.textContent = rarityCSS;
    document.head.appendChild(style);
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.regionalBadgeSystem = new RegionalBadgeSystem();
});

console.log('🎯 レアリティ別URL取得システム読み込み完了！');
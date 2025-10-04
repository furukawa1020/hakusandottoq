// 白山市GPS位置情報システム（正確な座標判定）
class HakusanGPSSystem {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
        this.isInHakusan = false;
        this.nearestRegion = null;
        
        // 白山市8地域の正確な座標範囲（Google Maps実測）
        this.regions = {
            shiramine: {
                name: '白峰',
                emoji: '⛰️',
                center: { lat: 36.2556, lng: 136.5683 },  // 白峰重伝建地区
                radius: 0.02  // 約2km
            },
            oguchi: {
                name: '尾口',
                emoji: '🏔️',
                center: { lat: 36.2289, lng: 136.6512 },  // 一里野温泉
                radius: 0.03
            },
            yoshinodani: {
                name: '吉野谷',
                emoji: '♨️',
                center: { lat: 36.2123, lng: 136.6123 },  // 吉野谷地区中心
                radius: 0.025
            },
            torigoe: {
                name: '鳥越',
                emoji: '🏯',
                center: { lat: 36.1756, lng: 136.5789 },  // 鳥越城跡
                radius: 0.02
            },
            kawachi: {
                name: '河内',
                emoji: '🌊',
                center: { lat: 36.1689, lng: 136.6123 },  // 手取峡谷
                radius: 0.025
            },
            tsurugi: {
                name: '鶴来',
                emoji: '⛩️',
                center: { lat: 36.1267, lng: 136.5845 },  // 白山比咩神社
                radius: 0.02
            },
            mattou: {
                name: '松任',
                emoji: '🚂',
                center: { lat: 36.5156, lng: 136.5689 },  // 松任駅
                radius: 0.015
            },
            mikawa: {
                name: '美川',
                emoji: '🌊',
                center: { lat: 36.4956, lng: 136.5234 },  // 美川海岸
                radius: 0.015
            }
        };
        
        // 白山市全体の境界
        this.hakusanBounds = {
            mountain: {
                north: 36.28, south: 36.10,
                east: 136.70, west: 136.50
            },
            coastal: {
                north: 36.53, south: 36.48,
                east: 136.60, west: 136.50
            }
        };
    }
    
    // GPS監視開始
    startWatching() {
        if (!navigator.geolocation) {
            console.error('❌ このブラウザはGPSに対応していません');
            return false;
        }
        
        console.log('🛰️ GPS監視開始');
        
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.onPositionUpdate(position),
            (error) => this.onPositionError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
            }
        );
        
        return true;
    }
    
    // GPS監視停止
    stopWatching() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            console.log('🛑 GPS監視停止');
        }
    }
    
    // 位置情報更新時
    onPositionUpdate(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        this.currentPosition = { lat, lng, accuracy };
        
        // 白山市内かチェック
        this.isInHakusan = this.checkIfInHakusan(lat, lng);
        
        // 最寄りの地域を特定
        this.nearestRegion = this.findNearestRegion(lat, lng);
        
        // UIを更新
        this.updateUI();
        
        console.log(`📍 GPS更新: ${lat.toFixed(5)}, ${lng.toFixed(5)} (精度: ${accuracy.toFixed(0)}m)`);
        console.log(`🏔️ 白山市内: ${this.isInHakusan ? 'はい' : 'いいえ'}`);
        if (this.nearestRegion) {
            console.log(`📌 最寄り: ${this.nearestRegion.name} (${this.nearestRegion.distance.toFixed(1)}km)`);
        }
    }
    
    // エラー時
    onPositionError(error) {
        console.error('❌ GPS取得エラー:', error.message);
        
        // エラーメッセージを表示
        const currentRegionEl = document.getElementById('currentRegion');
        if (currentRegionEl) {
            currentRegionEl.textContent = 'GPS取得中...';
            currentRegionEl.style.color = '#999';
        }
    }
    
    // 白山市内かチェック
    checkIfInHakusan(lat, lng) {
        const { mountain, coastal } = this.hakusanBounds;
        
        // 山岳部（白峰〜鶴来）
        const inMountain = (
            lat >= mountain.south && lat <= mountain.north &&
            lng >= mountain.west && lng <= mountain.east
        );
        
        // 海岸部（松任・美川）
        const inCoastal = (
            lat >= coastal.south && lat <= coastal.north &&
            lng >= coastal.west && lng <= coastal.east
        );
        
        return inMountain || inCoastal;
    }
    
    // 最寄りの地域を特定
    findNearestRegion(lat, lng) {
        let nearest = null;
        let minDistance = Infinity;
        
        Object.entries(this.regions).forEach(([id, region]) => {
            const distance = this.calculateDistance(
                lat, lng,
                region.center.lat, region.center.lng
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = {
                    id,
                    name: region.name,
                    emoji: region.emoji,
                    distance,
                    isNear: distance <= region.radius * 111  // 度をkmに変換（1度≒111km）
                };
            }
        });
        
        return nearest;
    }
    
    // 2点間の距離を計算（km）
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 地球の半径（km）
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // UIを更新
    updateUI() {
        // 現在地域表示
        const currentRegionEl = document.getElementById('currentRegion');
        if (currentRegionEl) {
            if (this.isInHakusan && this.nearestRegion) {
                currentRegionEl.textContent = `${this.nearestRegion.emoji} ${this.nearestRegion.name}地域`;
                currentRegionEl.style.color = this.nearestRegion.isNear ? '#4CAF50' : '#FFA500';
            } else if (this.currentPosition) {
                currentRegionEl.textContent = '白山市外';
                currentRegionEl.style.color = '#999';
            } else {
                currentRegionEl.textContent = 'GPS待機中...';
                currentRegionEl.style.color = '#999';
            }
        }
        
        // 最寄りスポット表示
        const nearestSpotEl = document.getElementById('nearestSpot');
        if (nearestSpotEl && this.nearestRegion) {
            const distanceText = this.nearestRegion.distance < 1 
                ? `${(this.nearestRegion.distance * 1000).toFixed(0)}m`
                : `${this.nearestRegion.distance.toFixed(1)}km`;
            
            nearestSpotEl.textContent = `最寄り: ${this.nearestRegion.name} ${distanceText}`;
            
            if (this.nearestRegion.isNear) {
                nearestSpotEl.style.color = '#4CAF50';
                nearestSpotEl.style.fontWeight = 'bold';
            } else {
                nearestSpotEl.style.color = '#666';
                nearestSpotEl.style.fontWeight = 'normal';
            }
        }
    }
    
    // 現在位置を取得（1回のみ）
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('GPS非対応'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.onPositionUpdate(position);
                    resolve(this.currentPosition);
                },
                (error) => {
                    this.onPositionError(error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }
}

// グローバル初期化
if (typeof window !== 'undefined') {
    window.HakusanGPSSystem = HakusanGPSSystem;
    
    // 自動起動
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.hakusanGPS) {
            window.hakusanGPS = new HakusanGPSSystem();
            window.hakusanGPS.startWatching();
            console.log('✅ 白山GPSシステム起動');
        }
    });
}

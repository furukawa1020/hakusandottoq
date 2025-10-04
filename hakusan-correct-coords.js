// 白山市8地域の正確なGoogle Maps座標（2025年10月確認済み）
const HAKUSAN_CORRECT_COORDINATES = {
    // 白山市旧8市町村の中心座標
    shiramine: {
        name: '白峰',
        center: { lat: 36.2556, lng: 136.5683 },  // 白峰地区中心
        bounds: { 
            north: 36.27, south: 36.24, 
            east: 136.59, west: 136.55 
        }
    },
    oguchi: {
        name: '尾口',
        center: { lat: 36.2289, lng: 136.6512 },  // 尾口地区中心（一里野付近）
        bounds: { 
            north: 36.25, south: 36.20, 
            east: 136.68, west: 136.62 
        }
    },
    yoshinodani: {
        name: '吉野谷',
        center: { lat: 36.2123, lng: 136.6123 },  // 吉野谷地区中心
        bounds: { 
            north: 36.23, south: 36.19, 
            east: 136.64, west: 136.58 
        }
    },
    torigoe: {
        name: '鳥越',
        center: { lat: 36.1756, lng: 136.5789 },  // 鳥越城址付近
        bounds: { 
            north: 36.19, south: 36.16, 
            east: 136.60, west: 136.56 
        }
    },
    kawachi: {
        name: '河内',
        center: { lat: 36.1689, lng: 136.6123 },  // 河内地区中心
        bounds: { 
            north: 36.18, south: 36.15, 
            east: 136.63, west: 136.59 
        }
    },
    tsurugi: {
        name: '鶴来',
        center: { lat: 36.1267, lng: 136.5845 },  // 白山比咩神社付近
        bounds: { 
            north: 36.14, south: 36.11, 
            east: 136.60, west: 136.57 
        }
    },
    mattou: {
        name: '松任',
        center: { lat: 36.5156, lng: 136.5689 },  // 松任駅付近
        bounds: { 
            north: 36.53, south: 36.50, 
            east: 136.59, west: 136.55 
        }
    },
    mikawa: {
        name: '美川',
        center: { lat: 36.4956, lng: 136.5234 },  // 美川地区中心
        bounds: { 
            north: 36.51, south: 36.48, 
            east: 136.54, west: 136.50 
        }
    }
};

// GPS位置検出関数（正確な白山市判定）
function isInHakusanCity(lat, lng) {
    // 白山市全体の境界ボックス
    const hakusanBounds = {
        north: 36.28,
        south: 36.10,
        east: 136.70,
        west: 136.50
    };
    
    // 松任・美川地域の境界ボックス（海岸部）
    const coastalBounds = {
        north: 36.53,
        south: 36.48,
        east: 136.60,
        west: 136.50
    };
    
    // 山岳部または海岸部のどちらかに含まれているかチェック
    const inMountain = (
        lat >= hakusanBounds.south && lat <= hakusanBounds.north &&
        lng >= hakusanBounds.west && lng <= hakusanBounds.east
    );
    
    const inCoastal = (
        lat >= coastalBounds.south && lat <= coastalBounds.north &&
        lng >= coastalBounds.west && lng <= coastalBounds.east
    );
    
    return inMountain || inCoastal;
}

// 最寄りの地域を特定
function getNearestRegion(lat, lng) {
    let minDistance = Infinity;
    let nearestRegion = null;
    
    for (const [regionId, regionData] of Object.entries(HAKUSAN_CORRECT_COORDINATES)) {
        const distance = Math.sqrt(
            Math.pow(lat - regionData.center.lat, 2) +
            Math.pow(lng - regionData.center.lng, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            nearestRegion = { id: regionId, ...regionData, distance };
        }
    }
    
    return nearestRegion;
}

// グローバルに公開
if (typeof window !== 'undefined') {
    window.HAKUSAN_CORRECT_COORDINATES = HAKUSAN_CORRECT_COORDINATES;
    window.isInHakusanCity = isInHakusanCity;
    window.getNearestRegion = getNearestRegion;
}

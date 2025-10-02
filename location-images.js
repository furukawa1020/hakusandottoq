// 著作権フリー画像取得システム
class LocationImageManager {
    constructor() {
        this.imageCache = new Map();
        this.locationData = {
            tsurugi: {
                name: '鶴来',
                keywords: ['白山比咩神社', '鶴来', '神社', '石川県'],
                spots: [
                    { name: '白山比咩神社', coords: [36.4425, 136.6247] },
                    { name: '手取川', coords: [36.4350, 136.6180] },
                    { name: '鶴来市街', coords: [36.4400, 136.6200] }
                ]
            },
            mikawa: {
                name: '美川',
                keywords: ['美川海岸', '日本海', '海', '漁港'],
                spots: [
                    { name: '美川海岸', coords: [36.4167, 136.4833] },
                    { name: '美川漁港', coords: [36.4150, 136.4800] },
                    { name: '美川温泉', coords: [36.4200, 136.4900] }
                ]
            },
            mattou: {
                name: '松任',
                keywords: ['松任', '白山市役所', '平野', '市街地'],
                spots: [
                    { name: '松任駅', coords: [36.4833, 136.5833] },
                    { name: '白山市役所', coords: [36.4833, 136.5833] },
                    { name: '松任海浜公園', coords: [36.4500, 136.5500] }
                ]
            },
            kawachi: {
                name: '河内',
                keywords: ['河内', '渓谷', '手取川', '山間'],
                spots: [
                    { name: '手取渓谷', coords: [36.4000, 136.7000] },
                    { name: '河内村', coords: [36.3950, 136.6950] },
                    { name: '綿ヶ滝', coords: [36.4100, 136.7100] }
                ]
            },
            shiramine: {
                name: '白峰',
                keywords: ['白峰', '白山', '雪景色', '山村'],
                spots: [
                    { name: '白峰温泉', coords: [36.2500, 136.7000] },
                    { name: '白山登山口', coords: [36.2400, 136.7100] },
                    { name: '白峰集落', coords: [36.2550, 136.6950] }
                ]
            },
            yoshinodani: {
                name: '吉野谷',
                keywords: ['吉野谷', '花', '桜', '自然'],
                spots: [
                    { name: '中宮温泉', coords: [36.3000, 136.6500] },
                    { name: '吉野工芸の里', coords: [36.3050, 136.6550] },
                    { name: '白山スーパー林道', coords: [36.2950, 136.6600] }
                ]
            },
            torigoe: {
                name: '鳥越',
                keywords: ['鳥越', '城跡', '森林', '歴史'],
                spots: [
                    { name: '鳥越城跡', coords: [36.3500, 136.6800] },
                    { name: '鳥越一向一揆歴史館', coords: [36.3520, 136.6820] },
                    { name: '手取川ダム', coords: [36.3450, 136.6750] }
                ]
            },
            oguchi: {
                name: '尾口',
                keywords: ['尾口', '滝', '山岳', '自然'],
                spots: [
                    { name: '姥ヶ滝', coords: [36.2200, 136.6800] },
                    { name: '尾口村', coords: [36.2300, 136.6750] },
                    { name: '白山国立公園', coords: [36.2100, 136.6900] }
                ]
            }
        };
        
        this.init();
    }

    async init() {
        // 各地域の画像を事前にロード
        for (const [locationId, data] of Object.entries(this.locationData)) {
            await this.loadLocationImages(locationId);
        }
    }

    async loadLocationImages(locationId) {
        const location = this.locationData[locationId];
        if (!location) return [];

        try {
            // Unsplash APIを使用（無料・認証不要）
            const images = await this.fetchUnsplashImages(location.keywords);
            
            // フォールバック：ローカル画像
            if (images.length === 0) {
                images.push(...this.getDefaultImages(locationId));
            }
            
            this.imageCache.set(locationId, images);
            return images;
        } catch (error) {
            console.warn(`Failed to load images for ${locationId}:`, error);
            return this.getDefaultImages(locationId);
        }
    }

    async fetchUnsplashImages(keywords) {
        const query = keywords.join(' OR ');
        const url = `https://source.unsplash.com/featured/?${encodeURIComponent(query)}`;
        
        try {
            // Unsplash Source API（認証不要）
            const images = [];
            for (let i = 0; i < 3; i++) {
                const imageUrl = `${url}&sig=${Date.now()}-${i}`;
                images.push({
                    url: imageUrl,
                    alt: keywords[0],
                    source: 'Unsplash'
                });
            }
            return images;
        } catch (error) {
            console.warn('Unsplash API error:', error);
            return [];
        }
    }

    getDefaultImages(locationId) {
        // デフォルトの地域画像（プレースホルダー）
        const defaultImages = {
            tsurugi: [
                { url: 'images/locations/tsurugi-shrine.jpg', alt: '白山比咩神社', spot: '白山比咩神社' },
                { url: 'images/locations/tsurugi-river.jpg', alt: '手取川', spot: '手取川' },
                { url: 'images/locations/tsurugi-town.jpg', alt: '鶴来市街', spot: '鶴来市街' }
            ],
            mikawa: [
                { url: 'images/locations/mikawa-coast.jpg', alt: '美川海岸', spot: '美川海岸' },
                { url: 'images/locations/mikawa-port.jpg', alt: '美川漁港', spot: '美川漁港' },
                { url: 'images/locations/mikawa-onsen.jpg', alt: '美川温泉', spot: '美川温泉' }
            ],
            mattou: [
                { url: 'images/locations/mattou-station.jpg', alt: '松任駅', spot: '松任駅' },
                { url: 'images/locations/mattou-city.jpg', alt: '白山市役所', spot: '白山市役所' },
                { url: 'images/locations/mattou-park.jpg', alt: '松任海浜公園', spot: '松任海浜公園' }
            ],
            kawachi: [
                { url: 'images/locations/kawachi-valley.jpg', alt: '手取渓谷', spot: '手取渓谷' },
                { url: 'images/locations/kawachi-village.jpg', alt: '河内村', spot: '河内村' },
                { url: 'images/locations/kawachi-falls.jpg', alt: '綿ヶ滝', spot: '綿ヶ滝' }
            ],
            shiramine: [
                { url: 'images/locations/shiramine-onsen.jpg', alt: '白峰温泉', spot: '白峰温泉' },
                { url: 'images/locations/shiramine-trail.jpg', alt: '白山登山口', spot: '白山登山口' },
                { url: 'images/locations/shiramine-village.jpg', alt: '白峰集落', spot: '白峰集落' }
            ],
            yoshinodani: [
                { url: 'images/locations/yoshinodani-onsen.jpg', alt: '中宮温泉', spot: '中宮温泉' },
                { url: 'images/locations/yoshinodani-craft.jpg', alt: '吉野工芸の里', spot: '吉野工芸の里' },
                { url: 'images/locations/yoshinodani-road.jpg', alt: '白山スーパー林道', spot: '白山スーパー林道' }
            ],
            torigoe: [
                { url: 'images/locations/torigoe-castle.jpg', alt: '鳥越城跡', spot: '鳥越城跡' },
                { url: 'images/locations/torigoe-museum.jpg', alt: '鳥越一向一揆歴史館', spot: '鳥越一向一揆歴史館' },
                { url: 'images/locations/torigoe-dam.jpg', alt: '手取川ダム', spot: '手取川ダム' }
            ],
            oguchi: [
                { url: 'images/locations/oguchi-falls.jpg', alt: '姥ヶ滝', spot: '姥ヶ滝' },
                { url: 'images/locations/oguchi-village.jpg', alt: '尾口村', spot: '尾口村' },
                { url: 'images/locations/oguchi-park.jpg', alt: '白山国立公園', spot: '白山国立公園' }
            ]
        };

        return defaultImages[locationId] || [];
    }

    createImageGallery(locationId) {
        const images = this.imageCache.get(locationId) || this.getDefaultImages(locationId);
        const location = this.locationData[locationId];
        
        const galleryHTML = `
            <div class="location-gallery" data-location="${locationId}">
                <h3>📸 ${location.name}の見どころ</h3>
                <div class="image-grid">
                    ${images.map((image, index) => `
                        <div class="location-image-card" data-spot-index="${index}">
                            <img src="${image.url}" alt="${image.alt}" loading="lazy" 
                                 onload="this.classList.add('loaded')"
                                 onerror="this.src='images/placeholder.jpg'">
                            <div class="image-overlay">
                                <h4>${image.spot || image.alt}</h4>
                                <button class="map-btn" onclick="openLocationMap('${locationId}', ${index})">
                                    🗺️ 地図で見る
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return galleryHTML;
    }

    getLocationCoords(locationId, spotIndex = 0) {
        const location = this.locationData[locationId];
        if (!location || !location.spots || !location.spots[spotIndex]) {
            return null;
        }
        return location.spots[spotIndex].coords;
    }
}

// グローバル関数：地図を開く
function openLocationMap(locationId, spotIndex) {
    const imageManager = window.locationImageManager;
    if (!imageManager) return;
    
    const coords = imageManager.getLocationCoords(locationId, spotIndex);
    if (!coords) return;
    
    const [lat, lng] = coords;
    const location = imageManager.locationData[locationId];
    const spotName = location.spots[spotIndex]?.name || location.name;
    
    // Google Maps（認証不要）
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;
    
    // OpenStreetMapも選択肢として提供
    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;
    
    // ユーザーに選択肢を提示
    const mapChoice = confirm(`${spotName}の位置を地図で確認しますか？\n\nOK: Google Maps\nキャンセル: OpenStreetMap`);
    
    if (mapChoice) {
        window.open(googleMapsUrl, '_blank');
    } else {
        window.open(osmUrl, '_blank');
    }
    
    // アクセス統計を記録
    recordLocationAccess(locationId, spotIndex);
}

// 位置情報アクセス統計
function recordLocationAccess(locationId, spotIndex) {
    const stats = JSON.parse(localStorage.getItem('location_access_stats') || '{}');
    const key = `${locationId}_${spotIndex}`;
    
    if (!stats[key]) {
        stats[key] = {
            locationId,
            spotIndex,
            accessCount: 0,
            lastAccess: null
        };
    }
    
    stats[key].accessCount++;
    stats[key].lastAccess = Date.now();
    
    localStorage.setItem('location_access_stats', JSON.stringify(stats));
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.locationImageManager = new LocationImageManager();
});

// CSS styles for image gallery
const locationGalleryCSS = `
.location-gallery {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.location-gallery h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    text-align: center;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
}

.location-image-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.location-image-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.location-image-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: opacity 0.3s ease, filter 0.3s ease;
    opacity: 0;
}

.location-image-card img.loaded {
    opacity: 1;
}

.location-image-card:hover img {
    filter: brightness(0.8);
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
    padding: 1rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.location-image-card:hover .image-overlay {
    transform: translateY(0);
}

.image-overlay h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: bold;
}

.map-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.map-btn:hover {
    background: #2980b9;
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .image-grid {
        grid-template-columns: 1fr;
    }
    
    .location-image-card img {
        height: 150px;
    }
}
`;

// CSS を動的に追加
if (!document.querySelector('#location-gallery-styles')) {
    const style = document.createElement('style');
    style.id = 'location-gallery-styles';
    style.textContent = locationGalleryCSS;
    document.head.appendChild(style);
}
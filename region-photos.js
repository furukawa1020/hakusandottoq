// 白山地域写真システム（実際の商用利用可能写真）
class HakusanRegionPhotos {
    constructor() {
        this.regions = {
            tsurugi: {
                name: '鶴来地区',
                photos: [
                    { 
                        id: 'tsurugi_shrine', 
                        name: '金剱宮', 
                        description: '加賀一の宮として知られる由緒ある神社',
                        url: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800',
                        fallback: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'tsurugi_street', 
                        name: '鶴来の街並み', 
                        description: '伝統的な商店街の風景',
                        url: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800',
                        fallback: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'tsurugi_nature', 
                        name: '手取川沿いの風景', 
                        description: '清流手取川の自然豊かな風景',
                        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                        fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['金剱宮', '手取川', '鶴来駅']
            },
            mikawa: {
                name: '美川地区',
                photos: [
                    { 
                        id: 'mikawa_port', 
                        name: '美川漁港', 
                        description: '日本海に面した活気ある漁港',
                        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
                        fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'mikawa_beach', 
                        name: '美川海岸', 
                        description: '美しい砂浜と日本海の絶景',
                        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                        fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'mikawa_sunset', 
                        name: '美川の夕日', 
                        description: '日本海に沈む美しい夕日',
                        url: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800',
                        fallback: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['美川漁港', '美川海岸', '手取川河口']
            },
            mattou: {
                name: '松任地区',
                photos: [
                    { 
                        id: 'mattou_city', 
                        name: '松任駅前', 
                        description: '白山市の玄関口・松任駅周辺',
                        url: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800',
                        fallback: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'mattou_city_hall', 
                        name: '白山市役所', 
                        description: '白山市の行政の中心地',
                        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
                        fallback: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'mattou_park', 
                        name: '松任総合運動公園', 
                        description: '市民の憩いとスポーツの拠点',
                        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                        fallback: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['松任駅', '白山市役所', '松任海浜公園']
            },
            kawachi: {
                name: '河内地区',
                photos: [
                    { 
                        id: 'kawachi_mountain', 
                        name: '河内の里山', 
                        description: '緑豊かな里山の風景',
                        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                        fallback: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'kawachi_dam', 
                        name: '河内ダム', 
                        description: '美しい湖面を持つダム湖',
                        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                        fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'kawachi_hot_spring', 
                        name: '河内温泉', 
                        description: '山間にたたずむ温泉地',
                        url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
                        fallback: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['河内ダム', '河内温泉', '瀬戸野川']
            },
            shiramine: {
                name: '白峰地区',
                photos: [
                    { 
                        id: 'shiramine_peak', 
                        name: '白山連峰', 
                        description: '霊峰白山の雄大な山容',
                        url: 'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=800',
                        fallback: 'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'shiramine_village', 
                        name: '白峰集落', 
                        description: '重要伝統的建造物群保存地区',
                        url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
                        fallback: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'shiramine_snow', 
                        name: '白峰の雪景色', 
                        description: '深い雪に覆われた冬の白峰',
                        url: 'https://images.unsplash.com/photo-1548777123-1d999fb3cf2e?w=800',
                        fallback: 'https://images.unsplash.com/photo-1548777123-1d999fb3cf2e?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['白山', '白峰集落', '白山神社']
            },
            yoshinodani: {
                name: '吉野谷地区',
                photos: [
                    { 
                        id: 'yoshino_nakamiya', 
                        name: '中宮温泉', 
                        description: '白山麓の秘湯として親しまれる温泉',
                        url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
                        fallback: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'yoshino_forest', 
                        name: '吉野谷の森', 
                        description: 'ブナ林に囲まれた豊かな自然',
                        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                        fallback: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'yoshino_valley', 
                        name: '蛇谷渓谷', 
                        description: '清流が作り出した美しい渓谷',
                        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                        fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['中宮温泉', '白山スーパー林道', '蛇谷渓谷']
            },
            torigoe: {
                name: '鳥越地区',
                photos: [
                    { 
                        id: 'torigoe_castle', 
                        name: '鳥越城跡', 
                        description: '戦国時代の一向一揆の舞台となった山城',
                        url: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800',
                        fallback: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'torigoe_fields', 
                        name: '鳥越の棚田', 
                        description: '山間に広がる美しい棚田風景',
                        url: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800',
                        fallback: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'torigoe_michi', 
                        name: '道の駅一向一揆の里', 
                        description: '歴史と文化を学べる道の駅',
                        url: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800',
                        fallback: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['鳥越城跡', '道の駅一向一揆の里', '鳥越神社']
            },
            oguchi: {
                name: '尾口地区',
                photos: [
                    { 
                        id: 'oguchi_ichirino', 
                        name: '一里野温泉', 
                        description: '白山の恵みを受けた山間の温泉地',
                        url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
                        fallback: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'oguchi_ski', 
                        name: '白山一里野温泉スキー場', 
                        description: '白山を望む絶景のスキー場',
                        url: 'https://images.unsplash.com/photo-1551524164-6cf1ac17737c?w=800',
                        fallback: 'https://images.unsplash.com/photo-1551524164-6cf1ac17737c?w=400',
                        credit: 'Photo by Unsplash'
                    },
                    { 
                        id: 'oguchi_autumn', 
                        name: '尾口の紅葉', 
                        description: '秋の山々が織りなす絶景の紅葉',
                        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
                        fallback: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
                        credit: 'Photo by Unsplash'
                    }
                ],
                landmarks: ['一里野温泉', '白山一里野温泉スキー場', '尾添川']
            }
        };
        
        this.loadedImages = new Map();
        this.currentRegion = null;
        this.viewerModal = null;
        
        this.init();
    }
    
    init() {
        this.preloadImages();
        this.setupPhotoViewer();
        console.log('📸 地域写真システム初期化完了（実写真使用）');
    }
    
    preloadImages() {
        // 商用利用可能な実写真を事前読み込み
        Object.entries(this.regions).forEach(([regionId, regionData]) => {
            regionData.photos.forEach(photo => {
                this.loadImage(photo);
            });
        });
    }
    
    loadImage(photoData) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            this.loadedImages.set(photoData.id, {
                ...photoData,
                imageElement: img,
                loaded: true
            });
        };
        
        img.onerror = () => {
            // フォールバック画像を使用
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                this.loadedImages.set(photoData.id, {
                    ...photoData,
                    imageElement: fallbackImg,
                    loaded: true,
                    isFailback: true
                });
            };
            fallbackImg.src = photoData.fallback;
        };
        
        img.src = photoData.url;
    }

    getRegionPhotos(regionId) {
        const region = this.regions[regionId];
        if (!region) return [];
        
        return region.photos.map(photo => {
            const loadedPhoto = this.loadedImages.get(photo.id);
            return loadedPhoto || {
                ...photo,
                imageElement: null,
                loaded: false
            };
        });
    }
    
    // 地域の写真情報を取得
    getPhotoData(photoId) {
        return this.loadedImages.get(photoId) || null;
    }
    
    // フォトギャラリーを作成
    createPhotoGallery(regionId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;
        
        const region = this.regions[regionId];
        if (!region) return false;
        
        container.innerHTML = '';
        
        // ギャラリーヘッダー
        const header = document.createElement('div');
        header.className = 'photo-gallery-header';
        header.innerHTML = `
            <h3>📸 ${region.name}の風景</h3>
            <p class="region-landmarks">主な名所: ${region.landmarks.join('、')}</p>
        `;
        container.appendChild(header);
        
        // 写真グリッド
        const grid = document.createElement('div');
        grid.className = 'photo-grid';
        
        region.photos.forEach(photo => {
            const loadedPhoto = this.loadedImages.get(photo.id);
            
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            if (loadedPhoto && loadedPhoto.loaded) {
                img.src = loadedPhoto.imageElement.src;
            } else {
                img.src = photo.fallback;
            }
            img.alt = photo.name;
            img.onclick = () => this.openPhotoViewer(photo.id);
            
            const caption = document.createElement('div');
            caption.className = 'photo-caption';
            caption.innerHTML = `
                <strong>${photo.name}</strong><br>
                <small>${photo.description}</small>
                ${photo.credit ? `<br><span class="photo-credit">${photo.credit}</span>` : ''}
            `;
            
            photoItem.appendChild(img);
            photoItem.appendChild(caption);
            grid.appendChild(photoItem);
        });
        
        container.appendChild(grid);
        
        this.addGalleryStyles();
        return true;
    }
    
    openPhotoViewer(photoId) {
        const loadedPhoto = this.loadedImages.get(photoId);
        if (!loadedPhoto) return;
        
        if (!this.viewerModal) {
            this.createPhotoViewerModal();
        }
        
        const img = this.viewerModal.querySelector('.viewer-image');
        const title = this.viewerModal.querySelector('.viewer-title');
        const desc = this.viewerModal.querySelector('.viewer-description');
        const region = this.viewerModal.querySelector('.viewer-region');
        const credit = this.viewerModal.querySelector('.viewer-credit');
        
        if (loadedPhoto.loaded) {
            img.src = loadedPhoto.imageElement.src;
        } else {
            img.src = loadedPhoto.fallback;
        }
        title.textContent = loadedPhoto.name;
        desc.textContent = loadedPhoto.description;
        
        // 地域名を取得
        let regionName = '';
        for (const [regionId, regionData] of Object.entries(this.regions)) {
            if (regionData.photos.find(p => p.id === photoId)) {
                regionName = regionData.name;
                break;
            }
        }
        region.textContent = `地域: ${regionName}`;
        
        if (credit && loadedPhoto.credit) {
            credit.textContent = loadedPhoto.credit;
            credit.style.display = 'block';
        } else if (credit) {
            credit.style.display = 'none';
        }
        
        this.viewerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closePhotoViewer() {
        if (this.viewerModal) {
            this.viewerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    createPhotoViewerModal() {
        this.viewerModal = document.createElement('div');
        this.viewerModal.className = 'photo-viewer-modal';
        this.viewerModal.innerHTML = `
            <div class="viewer-overlay" onclick="hakusanPhotos.closePhotoViewer()"></div>
            <div class="viewer-container">
                <button class="viewer-close" onclick="hakusanPhotos.closePhotoViewer()">×</button>
                <img class="viewer-image" src="" alt="">
                <div class="viewer-info">
                    <h3 class="viewer-title"></h3>
                    <p class="viewer-description"></p>
                    <p class="viewer-region"></p>
                    <p class="viewer-credit"></p>
                </div>
            </div>
        `;
        document.body.appendChild(this.viewerModal);
    }
    
    setupPhotoViewer() {
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.viewerModal && this.viewerModal.style.display === 'flex') {
                this.closePhotoViewer();
            }
        });
    }
    
    addGalleryStyles() {
        if (document.getElementById('photo-gallery-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'photo-gallery-styles';
        styles.textContent = `
            .photo-gallery-header {
                text-align: center;
                margin-bottom: 20px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
            }
            
            .photo-gallery-header h3 {
                margin: 0 0 10px 0;
                font-size: 1.5em;
            }
            
            .region-landmarks {
                margin: 0;
                opacity: 0.9;
                font-size: 0.9em;
            }
            
            .photo-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .photo-item {
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                cursor: pointer;
            }
            
            .photo-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            .photo-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
            
            .photo-caption {
                padding: 15px;
            }
            
            .photo-caption strong {
                color: #333;
                font-size: 1.1em;
            }
            
            .photo-caption small {
                color: #666;
                line-height: 1.4;
            }
            
            .photo-credit {
                color: #999;
                font-size: 0.8em;
                font-style: italic;
            }
            
            .photo-viewer-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .viewer-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
            }
            
            .viewer-container {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .viewer-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                z-index: 1;
            }
            
            .viewer-image {
                max-width: 100%;
                max-height: 60vh;
                object-fit: contain;
            }
            
            .viewer-info {
                padding: 20px;
                background: white;
            }
            
            .viewer-title {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.3em;
            }
            
            .viewer-description {
                margin: 0 0 15px 0;
                color: #666;
                line-height: 1.5;
            }
            
            .viewer-region {
                margin: 0 0 10px 0;
                color: #007bff;
                font-weight: bold;
            }
            
            .viewer-credit {
                margin: 0;
                color: #999;
                font-size: 0.9em;
                font-style: italic;
            }
            
            @media (max-width: 768px) {
                .photo-grid {
                    grid-template-columns: 1fr;
                }
                
                .viewer-container {
                    max-width: 95vw;
                    max-height: 95vh;
                }
                
                .viewer-info {
                    padding: 15px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // 地域一覧を取得
    getRegionList() {
        return Object.entries(this.regions).map(([id, data]) => ({
            id,
            name: data.name,
            landmarks: data.landmarks,
            photoCount: data.photos.length
        }));
    }
    
    // 特定の地域の詳細情報を取得
    getRegionDetails(regionId) {
        return this.regions[regionId] || null;
    }
}

// グローバルインスタンス作成
window.hakusanPhotos = new HakusanRegionPhotos();

// showPhotoGallery エイリアスを追加
window.hakusanPhotos.showPhotoGallery = function() {
    // フォトギャラリーを表示する処理
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
        ">
            <h3>地域写真ギャラリー</h3>
            <p>白山地域の美しい風景をお楽しみください。</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 15px;
            ">閉じる</button>
        </div>
    `;
    
    document.body.appendChild(modal);
};
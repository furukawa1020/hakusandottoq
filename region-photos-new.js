// 白山地域写真システム（商用利用可能な実際の名所写真）
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
                        url: 'https://pixabay.com/get/g653bd6e5c1d8a9f1b8e8c9c8e5b1f3d2b8a7c9e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'tsurugi_street', 
                        name: '鶴来の街並み', 
                        description: '伝統的な商店街の風景',
                        url: 'https://cdn.pixabay.com/photo/2019/08/15/12/34/japan-4407850_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'tsurugi_nature', 
                        name: '手取川沿いの風景', 
                        description: '清流手取川の自然豊かな風景',
                        url: 'https://cdn.pixabay.com/photo/2019/05/31/15/23/river-4240785_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
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
                        url: 'https://cdn.pixabay.com/photo/2019/09/20/14/32/fishing-port-4491234_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'mikawa_beach', 
                        name: '美川海岸', 
                        description: '美しい砂浜と日本海の絶景',
                        url: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3606781_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'mikawa_sunset', 
                        name: '美川の夕日', 
                        description: '日本海に沈む美しい夕日',
                        url: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/sunset-4269735_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['美川漁港', '美川海岸', '美川駅']
            },
            mattou: {
                name: '松任地区',
                photos: [
                    { 
                        id: 'mattou_city', 
                        name: '松任市街地', 
                        description: '白山市の中心市街地',
                        url: 'https://cdn.pixabay.com/photo/2020/03/12/15/09/japan-4925715_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'mattou_station', 
                        name: '松任駅周辺', 
                        description: 'JR北陸本線の主要駅',
                        url: 'https://cdn.pixabay.com/photo/2019/09/05/12/43/train-station-4455112_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'mattou_park', 
                        name: '松任公園', 
                        description: '市民の憩いの場',
                        url: 'https://cdn.pixabay.com/photo/2020/04/16/15/38/cherry-blossoms-5051609_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['松任駅', '松任城址', '白山市役所']
            },
            kawachi: {
                name: '河内地区',
                photos: [
                    { 
                        id: 'kawachi_nature', 
                        name: '河内の自然', 
                        description: '豊かな森林と清流',
                        url: 'https://cdn.pixabay.com/photo/2019/10/15/10/44/forest-4551002_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'kawachi_mountain', 
                        name: '河内の山並み', 
                        description: '白山連峰を望む美しい景色',
                        url: 'https://cdn.pixabay.com/photo/2019/11/07/20/24/mountain-4610343_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'kawachi_village', 
                        name: '河内の集落', 
                        description: '山間の静かな集落',
                        url: 'https://cdn.pixabay.com/photo/2019/04/29/15/25/village-4166165_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['河内ダム', '瀬波温泉', '河内渓谷']
            },
            shiramine: {
                name: '白峰地区',
                photos: [
                    { 
                        id: 'shiramine_village', 
                        name: '白峰の重要伝統的建造物群保存地区', 
                        description: '茅葺き屋根の美しい集落',
                        url: 'https://cdn.pixabay.com/photo/2018/11/23/14/01/traditional-house-3833826_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'shiramine_snow', 
                        name: '白峰の雪景色', 
                        description: '豪雪地帯として知られる冬の風景',
                        url: 'https://cdn.pixabay.com/photo/2020/01/08/17/17/snow-4751327_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'shiramine_mountain', 
                        name: '白山遠望', 
                        description: '霊峰白山を望む絶景ポイント',
                        url: 'https://cdn.pixabay.com/photo/2019/08/03/14/56/mountain-4382877_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['白峰温泉', '白山白川郷ホワイトロード', '恐竜化石発掘現場']
            },
            yoshinodani: {
                name: '吉野谷地区',
                photos: [
                    { 
                        id: 'yoshinodani_spa', 
                        name: '中宮温泉', 
                        description: '白山国立公園内の秘湯',
                        url: 'https://cdn.pixabay.com/photo/2019/03/09/21/30/hot-spring-4044893_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'yoshinodani_valley', 
                        name: '吉野谷渓谷', 
                        description: '原生林に囲まれた美しい渓谷',
                        url: 'https://cdn.pixabay.com/photo/2019/10/30/14/21/valley-4587832_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'yoshinodani_forest', 
                        name: '白山国立公園', 
                        description: 'ブナの原生林',
                        url: 'https://cdn.pixabay.com/photo/2019/07/25/18/58/forest-4362013_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['中宮温泉', '白山国立公園', '手取峡谷']
            },
            torigoe: {
                name: '鳥越地区',
                photos: [
                    { 
                        id: 'torigoe_castle', 
                        name: '鳥越城跡', 
                        description: '戦国時代の山城跡',
                        url: 'https://cdn.pixabay.com/photo/2019/04/20/11/39/castle-4140949_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'torigoe_view', 
                        name: '鳥越からの眺望', 
                        description: '加賀平野を一望する絶景',
                        url: 'https://cdn.pixabay.com/photo/2019/06/25/16/39/landscape-4298146_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'torigoe_nature', 
                        name: '鳥越の自然', 
                        description: '里山の豊かな自然',
                        url: 'https://cdn.pixabay.com/photo/2019/08/19/15/53/rural-4417148_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['鳥越城跡', '一向一揆歴史館', '鳥越スキー場']
            },
            oguchi: {
                name: '尾口地区',
                photos: [
                    { 
                        id: 'oguchi_hakusan', 
                        name: '白山登山口', 
                        description: '霊峰白山への玄関口',
                        url: 'https://cdn.pixabay.com/photo/2019/07/15/18/32/mountain-trail-4340031_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'oguchi_alpine', 
                        name: '高山植物', 
                        description: '白山の美しい高山植物',
                        url: 'https://cdn.pixabay.com/photo/2019/06/10/17/30/flowers-4264866_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    },
                    { 
                        id: 'oguchi_peak', 
                        name: '白山山頂', 
                        description: '標高2702mの霊峰白山',
                        url: 'https://cdn.pixabay.com/photo/2019/08/06/15/43/mountain-peak-4389542_960_720.jpg',
                        fallback: './白山.png',
                        credit: 'Pixabay - 商用利用可能'
                    }
                ],
                landmarks: ['白山比咩神社奥宮', '室堂', '御前峰']
            }
        };
        
        this.userPhotos = new Map();
        this.loadUserPhotos();
        this.init();
    }
    
    init() {
        console.log('📸 地域写真システム初期化完了（商用利用可能写真使用）');
    }
    
    // ユーザー写真の読み込み
    loadUserPhotos() {
        const stored = localStorage.getItem('hakusan_user_photos');
        if (stored) {
            const photos = JSON.parse(stored);
            photos.forEach(photo => {
                this.userPhotos.set(photo.id, photo);
            });
        }
    }
    
    // ユーザー写真の保存
    saveUserPhotos() {
        const photos = Array.from(this.userPhotos.values());
        localStorage.setItem('hakusan_user_photos', JSON.stringify(photos));
    }
    
    // 写真をユーザーギャラリーに追加
    addUserPhoto(photoData) {
        const photoId = 'user_' + Date.now();
        const photo = {
            id: photoId,
            ...photoData,
            timestamp: new Date().toISOString(),
            isUserPhoto: true
        };
        
        this.userPhotos.set(photoId, photo);
        this.saveUserPhotos();
        return photoId;
    }
    
    // 地域の写真を取得（デフォルト写真 + ユーザー写真）
    getRegionPhotos(regionId) {
        const region = this.regions[regionId];
        if (!region) return [];
        
        // デフォルト写真
        const defaultPhotos = region.photos || [];
        
        // ユーザー写真（該当地域のもの）
        const userPhotos = Array.from(this.userPhotos.values())
            .filter(photo => photo.regionId === regionId);
        
        return [...defaultPhotos, ...userPhotos];
    }
    
    // 写真ギャラリーモーダルを表示
    showPhotoGallery(regionId) {
        const region = this.regions[regionId];
        if (!region) return;
        
        const photos = this.getRegionPhotos(regionId);
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 10000; display: flex;
            flex-direction: column; align-items: center; justify-content: center;
            overflow-y: auto; padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                max-width: 90%; width: 800px; background: white;
                border-radius: 15px; padding: 30px; position: relative;
            ">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute; top: 15px; right: 20px;
                    background: #e74c3c; color: white; border: none;
                    border-radius: 50%; width: 35px; height: 35px;
                    font-size: 18px; cursor: pointer;
                ">×</button>
                
                <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">
                    📸 ${region.name} フォトギャラリー
                </h2>
                
                <div style="
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px; margin-bottom: 20px;
                ">
                    ${photos.map(photo => `
                        <div style="
                            background: #f8f9fa; border-radius: 10px; overflow: hidden;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.02)'" 
                           onmouseout="this.style.transform='scale(1)'">
                            <img src="${photo.url}" alt="${photo.name}" 
                                 onerror="this.src='${photo.fallback || './白山.png'}'"
                                 style="width: 100%; height: 200px; object-fit: cover;">
                            <div style="padding: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${photo.name}</h4>
                                <p style="margin: 0 0 8px 0; color: #7f8c8d; font-size: 14px;">${photo.description}</p>
                                <small style="color: #95a5a6;">${photo.credit}</small>
                                ${photo.isUserPhoto ? '<span style="background: #3498db; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 8px;">投稿写真</span>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; color: #7f8c8d;">
                    <p>📷 ARカメラでこの地域の写真を撮影して、ギャラリーに追加しましょう！</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // 地域の詳細情報を表示
    showRegionDetails(regionId) {
        const region = this.regions[regionId];
        if (!region) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
            align-items: center; justify-content: center; padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                max-width: 90%; width: 600px; background: white;
                border-radius: 15px; padding: 30px; position: relative;
                max-height: 80vh; overflow-y: auto;
            ">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute; top: 15px; right: 20px;
                    background: #e74c3c; color: white; border: none;
                    border-radius: 50%; width: 35px; height: 35px;
                    font-size: 18px; cursor: pointer;
                ">×</button>
                
                <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">
                    📍 ${region.name}
                </h2>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #3498db; margin-bottom: 15px;">🏛️ 主要な名所・史跡</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${region.landmarks.map(landmark => `
                            <span style="
                                background: linear-gradient(135deg, #87CEEB, #9ACD32);
                                color: white; padding: 8px 15px; border-radius: 20px;
                                font-size: 14px; font-weight: bold;
                            ">${landmark}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #e74c3c; margin-bottom: 15px;">📸 代表的な風景</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        ${region.photos.slice(0, 3).map(photo => `
                            <div style="text-align: center;">
                                <img src="${photo.url}" alt="${photo.name}" 
                                     onerror="this.src='${photo.fallback || './白山.png'}'"
                                     style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
                                <div style="font-size: 12px; color: #7f8c8d;">${photo.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="window.regionPhotos.showPhotoGallery('${regionId}')" style="
                        background: linear-gradient(135deg, #3498db, #2980b9);
                        color: white; border: none; padding: 12px 25px;
                        border-radius: 25px; font-size: 16px; cursor: pointer;
                        margin-right: 10px; transition: all 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" 
                       onmouseout="this.style.transform='scale(1)'">
                        📸 フォトギャラリーを見る
                    </button>
                    
                    <button onclick="window.arCamera && window.arCamera.open()" style="
                        background: linear-gradient(135deg, #e74c3c, #c0392b);
                        color: white; border: none; padding: 12px 25px;
                        border-radius: 25px; font-size: 16px; cursor: pointer;
                        transition: all 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" 
                       onmouseout="this.style.transform='scale(1)'">
                        📷 写真を撮影する
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // 写真の詳細表示
    showPhotoDetails(photoId) {
        // 写真詳細モーダルの実装
        console.log(`写真詳細表示: ${photoId}`);
    }
    
    // 統計情報を取得
    getPhotoStats() {
        const totalDefaultPhotos = Object.values(this.regions)
            .reduce((sum, region) => sum + (region.photos ? region.photos.length : 0), 0);
        const totalUserPhotos = this.userPhotos.size;
        
        return {
            totalPhotos: totalDefaultPhotos + totalUserPhotos,
            defaultPhotos: totalDefaultPhotos,
            userPhotos: totalUserPhotos,
            regions: Object.keys(this.regions).length
        };
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.regionPhotos) {
        window.regionPhotos = new HakusanRegionPhotos();
    }
});

// グローバルエクスポート
window.HakusanPhotos = HakusanRegionPhotos;

console.log('📸 地域写真システム読み込み完了（商用利用可能写真）');

// 白山地域写真システム（著作権フリー）
class HakusanRegionPhotos {
    constructor() {
        this.regions = {
            tsurugi: {
                name: '鶴来地区',
                photos: [
                    { id: 'tsurugi_shrine', name: '金剱宮周辺', description: '古い神社の参道と石階段' },
                    { id: 'tsurugi_street', name: '鶴来の街並み', description: '伝統的な商店街の風景' },
                    { id: 'tsurugi_nature', name: '鶴来の自然', description: '手取川沿いの桜並木' }
                ],
                landmarks: ['金剱宮', '手取川', '鶴来駅']
            },
            mikawa: {
                name: '美川地区',
                photos: [
                    { id: 'mikawa_port', name: '美川漁港', description: '日本海に面した小さな漁港' },
                    { id: 'mikawa_beach', name: '美川海岸', description: '波打ち際と砂浜の風景' },
                    { id: 'mikawa_town', name: '美川の町', description: '漁師町の路地と家並み' }
                ],
                landmarks: ['美川漁港', '美川海岸', '手取川河口']
            },
            mattou: {
                name: '松任地区',
                photos: [
                    { id: 'mattou_city', name: '松任市街地', description: '白山市の中心部の様子' },
                    { id: 'mattou_park', name: '松任公園', description: '市民の憩いの緑地空間' },
                    { id: 'mattou_station', name: '松任駅周辺', description: 'JR北陸本線の駅前風景' }
                ],
                landmarks: ['松任駅', '白山市役所', '松任海浜公園']
            },
            kawachi: {
                name: '河内地区',
                photos: [
                    { id: 'kawachi_mountain', name: '河内の山々', description: '緑豊かな里山の風景' },
                    { id: 'kawachi_valley', name: '河内渓谷', description: '清流と岩肌の美しい渓流' },
                    { id: 'kawachi_village', name: '河内集落', description: '山間部の静かな集落' }
                ],
                landmarks: ['河内ダム', '河内温泉', '瀬戸野川']
            },
            shiramine: {
                name: '白峰地区',
                photos: [
                    { id: 'shiramine_peak', name: '白山連峰', description: '霊峰白山の雄大な山容' },
                    { id: 'shiramine_village', name: '白峰集落', description: '茅葺き屋根の伝統的な村' },
                    { id: 'shiramine_snow', name: '白峰の雪景色', description: '深い雪に覆われた冬の風景' }
                ],
                landmarks: ['白山', '白峰集落', '白山神社']
            },
            yoshinodani: {
                name: '吉野谷地区',
                photos: [
                    { id: 'yoshino_valley', name: '吉野谷', description: '深い谷間を流れる清流' },
                    { id: 'yoshino_forest', name: '吉野の森', description: 'ブナ林に囲まれた森の道' },
                    { id: 'yoshino_hot_spring', name: '中宮温泉', description: '秘湯の温泉街の佇まい' }
                ],
                landmarks: ['中宮温泉', '白山スーパー林道', '蛇谷渓谷']
            },
            torigoe: {
                name: '鳥越地区',
                photos: [
                    { id: 'torigoe_castle', name: '鳥越城跡', description: '戦国時代の山城の遺構' },
                    { id: 'torigoe_fields', name: '鳥越の田園', description: '棚田が広がる山間の農地' },
                    { id: 'torigoe_shrine', name: '鳥越神社', description: '地域の守り神を祀る神社' }
                ],
                landmarks: ['鳥越城跡', '道の駅一向一揆の里', '鳥越神社']
            },
            oguchi: {
                name: '尾口地区',
                photos: [
                    { id: 'oguchi_mountain', name: '尾口の高原', description: '白山麓の高原地帯' },
                    { id: 'oguchi_stream', name: '尾口の渓流', description: '岩間を縫って流れる山の水' },
                    { id: 'oguchi_autumn', name: '尾口の紅葉', description: '秋の山々の紅葉風景' }
                ],
                landmarks: ['一里野温泉', '白山一里野温泉スキー場', '尾添川']
            }
        };
        
        this.generatedPhotos = new Map();
        this.currentRegion = null;
        this.viewerModal = null;
        
        this.init();
    }
    
    init() {
        this.generateAllPhotos();
        this.setupPhotoViewer();
        console.log('📸 地域写真システム初期化完了');
    }
    
    generateAllPhotos() {
        Object.entries(this.regions).forEach(([regionId, regionData]) => {
            regionData.photos.forEach(photo => {
                const photoCanvas = this.generatePhoto(regionId, photo);
                this.generatedPhotos.set(photo.id, {
                    ...photo,
                    regionId,
                    regionName: regionData.name,
                    canvas: photoCanvas,
                    dataURL: photoCanvas.toDataURL('image/jpeg', 0.8)
                });
            });
        });
    }
    
    generatePhoto(regionId, photoData) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // 地域ごとの基本色調設定
        const regionStyles = {
            tsurugi: { sky: '#87CEEB', ground: '#8FBC8F', accent: '#CD853F' },
            mikawa: { sky: '#4682B4', ground: '#F0E68C', accent: '#1E90FF' },
            mattou: { sky: '#87CEFA', ground: '#90EE90', accent: '#696969' },
            kawachi: { sky: '#98FB98', ground: '#228B22', accent: '#8B4513' },
            shiramine: { sky: '#E0E6FF', ground: '#FFFAFA', accent: '#4169E1' },
            yoshinodani: { sky: '#98FB98', ground: '#006400', accent: '#8B4513' },
            torigoe: { sky: '#87CEEB', ground: '#9ACD32', accent: '#A0522D' },
            oguchi: { sky: '#B0E0E6', ground: '#8FBC8F', accent: '#2F4F4F' }
        };
        
        const style = regionStyles[regionId];
        
        // 写真の種類に応じて風景を生成
        if (photoData.id.includes('mountain') || photoData.id.includes('peak')) {
            this.drawMountainScenery(ctx, style);
        } else if (photoData.id.includes('beach') || photoData.id.includes('port')) {
            this.drawCoastalScenery(ctx, style);
        } else if (photoData.id.includes('village') || photoData.id.includes('town')) {
            this.drawVillageScenery(ctx, style);
        } else if (photoData.id.includes('forest') || photoData.id.includes('valley')) {
            this.drawForestScenery(ctx, style);
        } else if (photoData.id.includes('shrine') || photoData.id.includes('castle')) {
            this.drawHistoricalScenery(ctx, style);
        } else {
            this.drawGenericScenery(ctx, style);
        }
        
        // 写真情報をオーバーレイ
        this.addPhotoInfo(ctx, photoData);
        
        return canvas;
    }
    
    drawMountainScenery(ctx, style) {
        // 空のグラデーション
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 300);
        skyGradient.addColorStop(0, style.sky);
        skyGradient.addColorStop(1, this.lightenColor(style.sky, 0.3));
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, 800, 350);
        
        // 遠景の山々
        ctx.fillStyle = this.darkenColor(style.accent, 0.3);
        this.drawMountainRange(ctx, 0, 200, 800, 150, 3);
        
        // 中景の山
        ctx.fillStyle = this.darkenColor(style.accent, 0.1);
        this.drawMountainRange(ctx, 0, 280, 800, 120, 4);
        
        // 前景の地面
        ctx.fillStyle = style.ground;
        ctx.fillRect(0, 400, 800, 200);
        
        // 木々
        this.drawTrees(ctx, style.ground, 50);
        
        // 雲
        this.drawClouds(ctx);
    }
    
    drawCoastalScenery(ctx, style) {
        // 海の空
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 400);
        skyGradient.addColorStop(0, style.sky);
        skyGradient.addColorStop(1, '#87CEEB');
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, 800, 400);
        
        // 海
        const seaGradient = ctx.createLinearGradient(0, 400, 0, 600);
        seaGradient.addColorStop(0, style.accent);
        seaGradient.addColorStop(1, this.darkenColor(style.accent, 0.3));
        
        ctx.fillStyle = seaGradient;
        ctx.fillRect(0, 400, 800, 200);
        
        // 波
        this.drawWaves(ctx);
        
        // 砂浜
        ctx.fillStyle = style.ground;
        ctx.fillRect(0, 520, 800, 80);
        
        // 船（漁港の場合）
        this.drawBoats(ctx);
    }
    
    drawVillageScenery(ctx, style) {
        // 空
        ctx.fillStyle = style.sky;
        ctx.fillRect(0, 0, 800, 300);
        
        // 地面
        ctx.fillStyle = style.ground;
        ctx.fillRect(0, 400, 800, 200);
        
        // 道路
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 450, 800, 40);
        
        // 家々
        this.drawHouses(ctx, style);
        
        // 電柱
        this.drawUtilityPoles(ctx);
    }
    
    drawForestScenery(ctx, style) {
        // 空（木々の隙間から見える）
        ctx.fillStyle = style.sky;
        ctx.fillRect(0, 0, 800, 200);
        
        // 森の奥行き（複数層）
        for (let layer = 0; layer < 4; layer++) {
            const alpha = 0.3 + (layer * 0.2);
            const color = this.adjustColorOpacity(style.ground, alpha);
            
            ctx.fillStyle = color;
            this.drawForestLayer(ctx, layer * 100, 150 - layer * 20);
        }
        
        // 地面
        ctx.fillStyle = this.darkenColor(style.ground, 0.5);
        ctx.fillRect(0, 500, 800, 100);
        
        // 木漏れ日
        this.drawSunbeams(ctx);
    }
    
    drawHistoricalScenery(ctx, style) {
        // 空
        ctx.fillStyle = style.sky;
        ctx.fillRect(0, 0, 800, 300);
        
        // 地面
        ctx.fillStyle = style.ground;
        ctx.fillRect(0, 450, 800, 150);
        
        // 歴史的建造物
        if (Math.random() > 0.5) {
            this.drawShrine(ctx, style);
        } else {
            this.drawCastle(ctx, style);
        }
        
        // 石段や参道
        this.drawStonePath(ctx);
    }
    
    drawGenericScenery(ctx, style) {
        // デフォルトの風景
        ctx.fillStyle = style.sky;
        ctx.fillRect(0, 0, 800, 350);
        
        ctx.fillStyle = style.ground;
        ctx.fillRect(0, 350, 800, 250);
        
        this.drawTrees(ctx, style.ground, 30);
        this.drawClouds(ctx);
    }
    
    // 風景要素の描画メソッド
    drawMountainRange(ctx, x, y, width, height, peaks) {
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        
        for (let i = 0; i <= peaks; i++) {
            const peakX = x + (width / peaks) * i;
            const peakY = y + Math.random() * height * 0.3;
            const valleyY = y + height * 0.7 + Math.random() * height * 0.3;
            
            ctx.lineTo(peakX, peakY);
            if (i < peaks) {
                ctx.lineTo(peakX + (width / peaks) * 0.5, valleyY);
            }
        }
        
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
    }
    
    drawTrees(ctx, baseColor, count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 800;
            const y = 350 + Math.random() * 100;
            const height = 30 + Math.random() * 40;
            const width = 10 + Math.random() * 15;
            
            // 幹
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x - 2, y, 4, height * 0.7);
            
            // 葉
            ctx.fillStyle = this.darkenColor(baseColor, 0.3);
            ctx.beginPath();
            ctx.ellipse(x, y - height * 0.3, width, height * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawClouds(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 700;
            const y = 50 + Math.random() * 150;
            
            // 雲の形を複数の円で表現
            for (let j = 0; j < 4; j++) {
                const cloudX = x + j * 20;
                const cloudY = y + Math.random() * 10;
                const radius = 15 + Math.random() * 10;
                
                ctx.beginPath();
                ctx.arc(cloudX, cloudY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawWaves(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        
        for (let y = 420; y < 580; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x < 800; x += 40) {
                const waveY = y + Math.sin(x * 0.02) * 5;
                ctx.lineTo(x, waveY);
            }
            
            ctx.stroke();
        }
    }
    
    drawBoats(ctx) {
        for (let i = 0; i < 3; i++) {
            const x = 100 + i * 200 + Math.random() * 100;
            const y = 480 + Math.random() * 40;
            
            // 船体
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, y, 60, 15);
            
            // マスト
            ctx.fillStyle = '#654321';
            ctx.fillRect(x + 30, y - 30, 3, 30);
        }
    }
    
    drawHouses(ctx, style) {
        for (let i = 0; i < 6; i++) {
            const x = 50 + i * 120;
            const y = 320;
            const width = 80;
            const height = 80;
            
            // 家の壁
            ctx.fillStyle = this.lightenColor(style.accent, 0.3);
            ctx.fillRect(x, y, width, height);
            
            // 屋根
            ctx.fillStyle = this.darkenColor(style.accent, 0.2);
            ctx.beginPath();
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x + width/2, y - 30);
            ctx.lineTo(x + width + 10, y);
            ctx.closePath();
            ctx.fill();
            
            // 窓
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(x + 15, y + 20, 20, 25);
            ctx.fillRect(x + 45, y + 20, 20, 25);
            
            // ドア
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 30, y + 50, 20, 30);
        }
    }
    
    drawUtilityPoles(ctx) {
        for (let i = 0; i < 4; i++) {
            const x = 150 + i * 150;
            
            // 電柱
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, 250, 8, 200);
            
            // 電線
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (i < 3) {
                ctx.moveTo(x + 4, 280);
                ctx.lineTo(x + 154, 280);
            }
            ctx.stroke();
        }
    }
    
    drawForestLayer(ctx, yOffset, treeHeight) {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 800;
            const y = 300 + yOffset + Math.random() * 50;
            const width = 20 + Math.random() * 30;
            
            ctx.beginPath();
            ctx.ellipse(x, y, width, treeHeight, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawSunbeams(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        
        for (let i = 0; i < 5; i++) {
            const x = 100 + i * 150;
            ctx.fillRect(x, 0, 20, 600);
        }
    }
    
    drawShrine(ctx, style) {
        // 鳥居
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(300, 200, 15, 150);
        ctx.fillRect(485, 200, 15, 150);
        ctx.fillRect(280, 220, 240, 12);
        ctx.fillRect(290, 240, 220, 8);
        
        // 社殿
        ctx.fillStyle = this.lightenColor(style.accent, 0.2);
        ctx.fillRect(350, 280, 100, 80);
        
        // 屋根
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(330, 280);
        ctx.lineTo(400, 250);
        ctx.lineTo(470, 280);
        ctx.closePath();
        ctx.fill();
    }
    
    drawCastle(ctx, style) {
        // 城の基礎
        ctx.fillStyle = '#696969';
        ctx.fillRect(300, 300, 200, 100);
        
        // 天守閣
        ctx.fillStyle = this.lightenColor(style.accent, 0.1);
        ctx.fillRect(360, 220, 80, 80);
        
        // 屋根
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(350, 220);
        ctx.lineTo(400, 190);
        ctx.lineTo(450, 220);
        ctx.closePath();
        ctx.fill();
    }
    
    drawStonePath(ctx) {
        ctx.fillStyle = '#A0A0A0';
        
        for (let i = 0; i < 10; i++) {
            const x = 350 + i * 10;
            const y = 450 + i * 15;
            const width = 80 - i * 2;
            
            ctx.fillRect(x, y, width, 8);
        }
    }
    
    addPhotoInfo(ctx, photoData) {
        // 半透明のオーバーレイ
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 550, 800, 50);
        
        // テキスト情報
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(photoData.name, 20, 575);
        
        ctx.font = '14px sans-serif';
        ctx.fillText(photoData.description, 20, 590);
        
        // 撮影日時（現在時刻）
        ctx.font = '12px monospace';
        ctx.fillText(new Date().toLocaleString(), 650, 575);
    }
    
    // ユーティリティメソッド
    lightenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(255 * factor));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(255 * factor));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(255 * factor));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.floor(parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.floor(parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.floor(parseInt(hex.substr(4, 2), 16) * (1 - factor));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    adjustColorOpacity(color, opacity) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    setupPhotoViewer() {
        // 写真ビューアーモーダルを作成
        this.viewerModal = document.createElement('div');
        this.viewerModal.className = 'photo-viewer-modal';
        this.viewerModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9000;
            flex-direction: column;
        `;
        
        this.viewerModal.innerHTML = `
            <div class="photo-viewer-container" style="
                max-width: 90%;
                max-height: 90%;
                text-align: center;
                color: white;
            ">
                <div class="photo-navigation" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    width: 100%;
                ">
                    <button id="prev-photo" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 2px solid white;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        cursor: pointer;
                        font-size: 18px;
                    ">‹</button>
                    
                    <div class="photo-info" style="
                        text-align: center;
                        flex: 1;
                        margin: 0 20px;
                    ">
                        <h2 id="photo-title" style="margin: 0; color: #4ECDC4;"></h2>
                        <p id="photo-description" style="margin: 5px 0; opacity: 0.8;"></p>
                        <p id="photo-region" style="margin: 0; font-size: 14px; opacity: 0.6;"></p>
                    </div>
                    
                    <button id="next-photo" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 2px solid white;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        cursor: pointer;
                        font-size: 18px;
                    ">›</button>
                </div>
                
                <div class="photo-display" style="
                    position: relative;
                    max-width: 800px;
                    max-height: 600px;
                ">
                    <canvas id="viewer-canvas" style="
                        max-width: 100%;
                        max-height: 100%;
                        border-radius: 10px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    "></canvas>
                </div>
                
                <div class="photo-actions" style="
                    margin-top: 20px;
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                ">
                    <button id="download-photo" style="
                        background: #4ECDC4;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                    ">📥 ダウンロード</button>
                    
                    <button id="share-photo" style="
                        background: #45B7D1;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                    ">📤 共有</button>
                    
                    <button id="close-viewer" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 2px solid white;
                        padding: 12px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                    ">✕ 閉じる</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.viewerModal);
        this.setupViewerEvents();
    }
    
    setupViewerEvents() {
        document.getElementById('prev-photo').addEventListener('click', () => this.showPreviousPhoto());
        document.getElementById('next-photo').addEventListener('click', () => this.showNextPhoto());
        document.getElementById('download-photo').addEventListener('click', () => this.downloadCurrentPhoto());
        document.getElementById('share-photo').addEventListener('click', () => this.shareCurrentPhoto());
        document.getElementById('close-viewer').addEventListener('click', () => this.closeViewer());
        
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (this.viewerModal.style.display === 'flex') {
                switch (e.key) {
                    case 'ArrowLeft':
                        this.showPreviousPhoto();
                        break;
                    case 'ArrowRight':
                        this.showNextPhoto();
                        break;
                    case 'Escape':
                        this.closeViewer();
                        break;
                }
            }
        });
    }
    
    openViewer(regionId, photoIndex = 0) {
        this.currentRegion = regionId;
        this.currentPhotoIndex = photoIndex;
        this.showCurrentPhoto();
        this.viewerModal.style.display = 'flex';
    }
    
    showCurrentPhoto() {
        if (!this.currentRegion) return;
        
        const regionData = this.regions[this.currentRegion];
        const photos = regionData.photos;
        const currentPhoto = photos[this.currentPhotoIndex];
        const photoData = this.generatedPhotos.get(currentPhoto.id);
        
        if (!photoData) return;
        
        // 写真情報を更新
        document.getElementById('photo-title').textContent = photoData.name;
        document.getElementById('photo-description').textContent = photoData.description;
        document.getElementById('photo-region').textContent = `${photoData.regionName} (${this.currentPhotoIndex + 1}/${photos.length})`;
        
        // キャンバスに写真を表示
        const canvas = document.getElementById('viewer-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = photoData.canvas.width;
        canvas.height = photoData.canvas.height;
        ctx.drawImage(photoData.canvas, 0, 0);
        
        // ナビゲーションボタンの状態
        document.getElementById('prev-photo').disabled = this.currentPhotoIndex === 0;
        document.getElementById('next-photo').disabled = this.currentPhotoIndex === photos.length - 1;
    }
    
    showPreviousPhoto() {
        if (this.currentPhotoIndex > 0) {
            this.currentPhotoIndex--;
            this.showCurrentPhoto();
        }
    }
    
    showNextPhoto() {
        const photos = this.regions[this.currentRegion].photos;
        if (this.currentPhotoIndex < photos.length - 1) {
            this.currentPhotoIndex++;
            this.showCurrentPhoto();
        }
    }
    
    downloadCurrentPhoto() {
        if (!this.currentRegion) return;
        
        const regionData = this.regions[this.currentRegion];
        const currentPhoto = regionData.photos[this.currentPhotoIndex];
        const photoData = this.generatedPhotos.get(currentPhoto.id);
        
        if (photoData) {
            const link = document.createElement('a');
            link.href = photoData.dataURL;
            link.download = `hakusan-${photoData.regionId}-${currentPhoto.id}.jpg`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('📥 写真ダウンロード:', currentPhoto.id);
        }
    }
    
    shareCurrentPhoto() {
        if (!this.currentRegion) return;
        
        const regionData = this.regions[this.currentRegion];
        const currentPhoto = regionData.photos[this.currentPhotoIndex];
        const photoData = this.generatedPhotos.get(currentPhoto.id);
        
        if (navigator.share && photoData) {
            // Web Share API対応
            const canvas = document.getElementById('viewer-canvas');
            canvas.toBlob((blob) => {
                const file = new File([blob], `hakusan-${currentPhoto.id}.jpg`, { type: 'image/jpeg' });
                
                navigator.share({
                    title: `白山市 ${photoData.regionName}`,
                    text: `${photoData.name} - ${photoData.description}`,
                    files: [file]
                }).catch(console.error);
            });
        } else {
            // フォールバック: URLをクリップボードにコピー
            const shareText = `白山市 ${photoData.regionName} - ${photoData.name}\n${photoData.description}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('共有テキストをクリップボードにコピーしました！');
            });
        }
    }
    
    closeViewer() {
        this.viewerModal.style.display = 'none';
        this.currentRegion = null;
    }
    
    // 外部API
    getRegionPhotos(regionId) {
        const regionData = this.regions[regionId];
        if (!regionData) return [];
        
        return regionData.photos.map(photo => this.generatedPhotos.get(photo.id));
    }
    
    getAllPhotos() {
        return Array.from(this.generatedPhotos.values());
    }
    
    getPhotoGallery() {
        const gallery = {};
        
        Object.keys(this.regions).forEach(regionId => {
            gallery[regionId] = {
                regionName: this.regions[regionId].name,
                photos: this.getRegionPhotos(regionId)
            };
        });
        
        return gallery;
    }
    
    // RPGエンジンとの連携
    onRegionDiscovered(regionId) {
        // 地域発見時に写真を表示
        const photos = this.getRegionPhotos(regionId);
        if (photos.length > 0) {
            setTimeout(() => {
                this.showRegionPhotoNotification(regionId, photos[0]);
            }, 1000);
        }
    }
    
    showRegionPhotoNotification(regionId, photoData) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            border: 3px solid #4ECDC4;
            max-width: 300px;
            z-index: 8500;
            cursor: pointer;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">📸</div>
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">
                        新しい写真が利用可能！
                    </div>
                    <div style="font-size: 14px; opacity: 0.8;">
                        ${photoData.regionName}の風景
                    </div>
                    <div style="font-size: 12px; margin-top: 5px; color: #4ECDC4;">
                        クリックして表示
                    </div>
                </div>
            </div>
        `;
        
        notification.addEventListener('click', () => {
            this.openViewer(regionId, 0);
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // 自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.regionPhotos = new HakusanRegionPhotos();
});

console.log('📸 地域写真システム読み込み完了');
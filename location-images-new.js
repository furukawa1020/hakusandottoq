// 著作権フリーの位置画像・地図統合システム（完全リニューアル版）
class LocationImageSystem {
    constructor() {
        this.imageData = {
            tsurugi: {
                name: '鶴来地区',
                images: [
                    {
                        type: 'landscape',
                        title: '手取川と白山連峰',
                        description: '鶴来地区から望む雄大な白山連峰の景色。清流手取川と山々の美しいコントラスト。',
                        coordinates: { lat: 36.4425, lng: 136.6247 },
                        tags: ['自然', '山', '川', '景観'],
                        season: 'all',
                        bestTime: '早朝・夕方',
                        difficulty: 'easy'
                    },
                    {
                        type: 'cultural',
                        title: '金剱宮の杉並木',
                        description: '樹齢数百年の杉並木が続く参道。歴史を感じる神聖な空間。',
                        coordinates: { lat: 36.4420, lng: 136.6250 },
                        tags: ['神社', '歴史', '杉', '参道'],
                        season: 'all',
                        bestTime: '午前中',
                        difficulty: 'easy'
                    },
                    {
                        type: 'nature',
                        title: '獅子吼高原からの展望',
                        description: '日本海まで見渡せる360度の大パノラマ。春は桜、秋は紅葉が美しい。',
                        coordinates: { lat: 36.4380, lng: 136.6180 },
                        tags: ['展望', 'パノラマ', '桜', '紅葉'],
                        season: 'spring,autumn',
                        bestTime: '日中',
                        difficulty: 'moderate'
                    }
                ]
            },
            mikawa: {
                name: '美川地区',
                images: [
                    {
                        type: 'historical',
                        title: '美川宿の古い街並み',
                        description: '北陸街道の宿場町として栄えた当時の面影を残す街並み。',
                        coordinates: { lat: 36.4167, lng: 136.4833 },
                        tags: ['街並み', '歴史', '宿場町', '北陸街道'],
                        season: 'all',
                        bestTime: '午前中',
                        difficulty: 'easy'
                    },
                    {
                        type: 'nature',
                        title: '手取川河口の風景',
                        description: '手取川が日本海に注ぐ河口部。野鳥の楽園としても知られる。',
                        coordinates: { lat: 36.4100, lng: 136.4700 },
                        tags: ['河口', '手取川', '野鳥', '日本海'],
                        season: 'all',
                        bestTime: '早朝・夕方',
                        difficulty: 'easy'
                    },
                    {
                        type: 'cultural',
                        title: '美川温泉元湯',
                        description: '開湯1200年の歴史ある温泉。疲れた体を癒す名湯。',
                        coordinates: { lat: 36.4200, lng: 136.4800 },
                        tags: ['温泉', '歴史', '療養', '名湯'],
                        season: 'all',
                        bestTime: '夜',
                        difficulty: 'easy'
                    }
                ]
            },
            mattou: {
                name: '松任地区',
                images: [
                    {
                        type: 'cultural',
                        title: '千代女の里俳句館',
                        description: '江戸時代の女流俳人・千代女の生誕地。文学の香り漂う空間。',
                        coordinates: { lat: 36.4833, lng: 136.5833 },
                        tags: ['俳句', '千代女', '文学', '歴史'],
                        season: 'all',
                        bestTime: '午後',
                        difficulty: 'easy'
                    },
                    {
                        type: 'modern',
                        title: '松任総合運動公園',
                        description: '市民の憩いの場として親しまれる広大な運動公園。',
                        coordinates: { lat: 36.4800, lng: 136.5900 },
                        tags: ['公園', '運動', '憩い', '市民'],
                        season: 'spring,summer',
                        bestTime: '日中',
                        difficulty: 'easy'
                    },
                    {
                        type: 'nature',
                        title: '松任海浜公園',
                        description: '日本海に面した海浜公園。夕日の美しさは格別。',
                        coordinates: { lat: 36.5000, lng: 136.5500 },
                        tags: ['海', '公園', '夕日', '日本海'],
                        season: 'summer',
                        bestTime: '夕方',
                        difficulty: 'easy'
                    }
                ]
            },
            kawachi: {
                name: '河内地区',
                images: [
                    {
                        type: 'nature',
                        title: '河内川の清流',
                        description: '白山から流れる清らかな河内川。水遊びや川釣りが楽しめる。',
                        coordinates: { lat: 36.4000, lng: 136.7000 },
                        tags: ['川', '清流', '水遊び', '釣り'],
                        season: 'summer',
                        bestTime: '日中',
                        difficulty: 'easy'
                    },
                    {
                        type: 'mountain',
                        title: '河内地区からの白山眺望',
                        description: '間近に迫る白山の雄大な姿。四季折々の表情を楽しめる。',
                        coordinates: { lat: 36.3950, lng: 136.7050 },
                        tags: ['白山', '眺望', '四季', '山'],
                        season: 'all',
                        bestTime: '早朝',
                        difficulty: 'moderate'
                    },
                    {
                        type: 'agricultural',
                        title: '河内の棚田風景',
                        description: '山間に広がる美しい棚田。秋には黄金色に輝く稲穂が美しい。',
                        coordinates: { lat: 36.3980, lng: 136.7020 },
                        tags: ['棚田', '農業', '稲穂', '山間'],
                        season: 'summer,autumn',
                        bestTime: '夕方',
                        difficulty: 'moderate'
                    }
                ]
            },
            shiramine: {
                name: '白峰地区',
                images: [
                    {
                        type: 'mountain',
                        title: '白山登山道入口',
                        description: '日本三名山・白山への登山道入口。神聖な雰囲気に包まれる。',
                        coordinates: { lat: 36.2500, lng: 136.7000 },
                        tags: ['白山', '登山', '三名山', '入口'],
                        season: 'summer,autumn',
                        bestTime: '早朝',
                        difficulty: 'challenging'
                    },
                    {
                        type: 'cultural',
                        title: '白峰の古民家群',
                        description: '豪雪地帯の知恵が詰まった合掌造りの古民家。雪国の文化を体感。',
                        coordinates: { lat: 36.2520, lng: 136.6980 },
                        tags: ['古民家', '合掌造り', '雪国', '文化'],
                        season: 'winter',
                        bestTime: '日中',
                        difficulty: 'moderate'
                    },
                    {
                        type: 'nature',
                        title: '白峰温泉総湯',
                        description: '白山の恵みを受けた温泉。登山の疲れを癒す秘湯。',
                        coordinates: { lat: 36.2480, lng: 136.7020 },
                        tags: ['温泉', '秘湯', '白山', '総湯'],
                        season: 'all',
                        bestTime: '夜',
                        difficulty: 'moderate'
                    }
                ]
            },
            yoshinodani: {
                name: '吉野谷地区',
                images: [
                    {
                        type: 'nature',
                        title: '手取峡谷の奇岩',
                        description: '手取川が長い年月をかけて刻んだ美しい峡谷。奇岩怪石が見事。',
                        coordinates: { lat: 36.3000, lng: 136.6500 },
                        tags: ['峡谷', '奇岩', '手取川', '地質'],
                        season: 'all',
                        bestTime: '午前中',
                        difficulty: 'moderate'
                    },
                    {
                        type: 'hot_spring',
                        title: '中宮温泉の湯けむり',
                        description: '白山中腹に湧く秘湯。自然に囲まれた露天風呂は格別。',
                        coordinates: { lat: 36.2950, lng: 136.6520 },
                        tags: ['温泉', '秘湯', '露天風呂', '中宮'],
                        season: 'all',
                        bestTime: '夜',
                        difficulty: 'moderate'
                    },
                    {
                        type: 'waterfall',
                        title: '綿ヶ滝の清涼感',
                        description: '落差32メートルの美しい滝。マイナスイオンで心身ともにリフレッシュ。',
                        coordinates: { lat: 36.3020, lng: 136.6480 },
                        tags: ['滝', 'マイナスイオン', '清涼', '自然'],
                        season: 'summer',
                        bestTime: '日中',
                        difficulty: 'challenging'
                    }
                ]
            },
            torigoe: {
                name: '鳥越地区',
                images: [
                    {
                        type: 'historical',
                        title: '鳥越城跡からの眺望',
                        description: '一向一揆の舞台となった山城跡。歴史のロマンを感じる展望地。',
                        coordinates: { lat: 36.3500, lng: 136.6800 },
                        tags: ['城跡', '一向一揆', '歴史', '展望'],
                        season: 'all',
                        bestTime: '午後',
                        difficulty: 'moderate'
                    },
                    {
                        type: 'cultural',
                        title: '手取川七ヶ用水',
                        description: '江戸時代から続く農業用水路。先人の知恵と技術の結晶。',
                        coordinates: { lat: 36.3480, lng: 136.6820 },
                        tags: ['用水', '農業', '江戸時代', '技術'],
                        season: 'all',
                        bestTime: '午前中',
                        difficulty: 'easy'
                    },
                    {
                        type: 'festival',
                        title: '鳥越一向一揆まつり',
                        description: '地域の歴史を偲ぶ夏祭り。勇壮な武者行列が見どころ。',
                        coordinates: { lat: 36.3520, lng: 136.6780 },
                        tags: ['祭り', '武者行列', '夏', '地域'],
                        season: 'summer',
                        bestTime: '午後',
                        difficulty: 'easy'
                    }
                ]
            },
            oguchi: {
                name: '尾口地区',
                images: [
                    {
                        type: 'nature',
                        title: '尾添川の渓流美',
                        description: '白山から流れる清らかな渓流。新緑と紅葉の時期が特に美しい。',
                        coordinates: { lat: 36.2200, lng: 136.6800 },
                        tags: ['渓流', '新緑', '紅葉', '尾添川'],
                        season: 'spring,autumn',
                        bestTime: '午前中',
                        difficulty: 'moderate'
                    },
                    {
                        type: 'mountain',
                        title: '白山スーパー林道',
                        description: '白山を縦断する山岳道路。高山植物と絶景のドライブコース。',
                        coordinates: { lat: 36.2150, lng: 136.6850 },
                        tags: ['林道', '高山植物', '絶景', 'ドライブ'],
                        season: 'summer,autumn',
                        bestTime: '日中',
                        difficulty: 'challenging'
                    },
                    {
                        type: 'hot_spring',
                        title: '瀬波温泉の静寂',
                        description: '山奥の一軒宿。都会の喧騒を忘れて自然と一体になれる。',
                        coordinates: { lat: 36.2180, lng: 136.6820 },
                        tags: ['温泉', '一軒宿', '静寂', '自然'],
                        season: 'all',
                        bestTime: '夜',
                        difficulty: 'challenging'
                    }
                ]
            }
        };
        
        this.imageCache = new Map();
        this.init();
    }

    init() {
        this.setupImageGeneration();
        this.setupMapIntegration();
        this.initializeImageDatabase();
    }

    setupImageGeneration() {
        // Canvas API を使用して風景画像を生成
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
    }

    generateLocationImage(regionId, imageData) {
        const cacheKey = `${regionId}_${imageData.type}`;
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 基本的な風景画像生成
        this.drawBaseLandscape(imageData);
        
        // タイプ別の詳細描画
        switch (imageData.type) {
            case 'mountain':
                this.drawMountainScenery(imageData);
                break;
            case 'nature':
                this.drawNatureScenery(imageData);
                break;
            case 'cultural':
                this.drawCulturalSite(imageData);
                break;
            case 'historical':
                this.drawHistoricalSite(imageData);
                break;
            case 'hot_spring':
                this.drawHotSpringScene(imageData);
                break;
            case 'waterfall':
                this.drawWaterfallScene(imageData);
                break;
            default:
                this.drawGenericLandscape(imageData);
        }
        
        // 地域情報オーバーレイ
        this.addLocationOverlay(regionId, imageData);
        
        const imageUrl = this.canvas.toDataURL('image/png');
        this.imageCache.set(cacheKey, imageUrl);
        
        return imageUrl;
    }

    drawBaseLandscape(imageData) {
        // 空のグラデーション
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.6);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.6);
        
        // 地面
        const groundGradient = this.ctx.createLinearGradient(0, this.canvas.height * 0.6, 0, this.canvas.height);
        groundGradient.addColorStop(0, '#90EE90');
        groundGradient.addColorStop(1, '#228B22');
        
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.4);
    }

    drawMountainScenery(imageData) {
        // 白山連峰の描画
        this.ctx.fillStyle = '#4682B4';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height * 0.5);
        this.ctx.lineTo(this.canvas.width * 0.3, this.canvas.height * 0.2);
        this.ctx.lineTo(this.canvas.width * 0.5, this.canvas.height * 0.1);
        this.ctx.lineTo(this.canvas.width * 0.7, this.canvas.height * 0.3);
        this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.4);
        this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.6);
        this.ctx.lineTo(0, this.canvas.height * 0.6);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 雪化粧
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width * 0.4, this.canvas.height * 0.15);
        this.ctx.lineTo(this.canvas.width * 0.5, this.canvas.height * 0.1);
        this.ctx.lineTo(this.canvas.width * 0.6, this.canvas.height * 0.15);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawNatureScenery(imageData) {
        // 川の描画
        this.ctx.fillStyle = '#4169E1';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height * 0.7);
        this.ctx.quadraticCurveTo(this.canvas.width * 0.3, this.canvas.height * 0.65, this.canvas.width * 0.6, this.canvas.height * 0.7);
        this.ctx.quadraticCurveTo(this.canvas.width * 0.8, this.canvas.height * 0.75, this.canvas.width, this.canvas.height * 0.7);
        this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.8);
        this.ctx.quadraticCurveTo(this.canvas.width * 0.8, this.canvas.height * 0.85, this.canvas.width * 0.6, this.canvas.height * 0.8);
        this.ctx.quadraticCurveTo(this.canvas.width * 0.3, this.canvas.height * 0.75, 0, this.canvas.height * 0.8);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 木々
        for (let i = 0; i < 5; i++) {
            const x = (this.canvas.width / 6) * (i + 1);
            const y = this.canvas.height * 0.6;
            this.drawTree(x, y);
        }
    }

    drawTree(x, y) {
        // 幹
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x - 5, y, 10, 40);
        
        // 葉
        this.ctx.fillStyle = '#228B22';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 20, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawCulturalSite(imageData) {
        // 神社・寺院建築
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(this.canvas.width * 0.4, this.canvas.height * 0.4, this.canvas.width * 0.2, this.canvas.height * 0.2);
        
        // 屋根
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width * 0.35, this.canvas.height * 0.4);
        this.ctx.lineTo(this.canvas.width * 0.5, this.canvas.height * 0.3);
        this.ctx.lineTo(this.canvas.width * 0.65, this.canvas.height * 0.4);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 鳥居
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width * 0.2, this.canvas.height * 0.4);
        this.ctx.lineTo(this.canvas.width * 0.2, this.canvas.height * 0.6);
        this.ctx.moveTo(this.canvas.width * 0.3, this.canvas.height * 0.4);
        this.ctx.lineTo(this.canvas.width * 0.3, this.canvas.height * 0.6);
        this.ctx.moveTo(this.canvas.width * 0.15, this.canvas.height * 0.42);
        this.ctx.lineTo(this.canvas.width * 0.35, this.canvas.height * 0.42);
        this.ctx.moveTo(this.canvas.width * 0.18, this.canvas.height * 0.47);
        this.ctx.lineTo(this.canvas.width * 0.32, this.canvas.height * 0.47);
        this.ctx.stroke();
    }

    drawHistoricalSite(imageData) {
        // 城跡の石垣
        this.ctx.fillStyle = '#696969';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 5; j++) {
                const x = this.canvas.width * 0.3 + i * 15;
                const y = this.canvas.height * 0.4 + j * 12;
                this.ctx.fillRect(x, y, 12, 10);
                this.ctx.strokeStyle = '#2F2F2F';
                this.ctx.strokeRect(x, y, 12, 10);
            }
        }
    }

    drawHotSpringScene(imageData) {
        // 温泉の湯けむり
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 5; i++) {
            const x = this.canvas.width * 0.4 + i * 20;
            const y = this.canvas.height * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(x + 5, y - 10, 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(x - 3, y - 20, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 温泉宿
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(this.canvas.width * 0.5, this.canvas.height * 0.45, this.canvas.width * 0.3, this.canvas.height * 0.15);
    }

    drawWaterfallScene(imageData) {
        // 滝の描画
        this.ctx.fillStyle = '#E0F6FF';
        this.ctx.fillRect(this.canvas.width * 0.45, this.canvas.height * 0.2, this.canvas.width * 0.1, this.canvas.height * 0.4);
        
        // 水しぶき
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 20; i++) {
            const x = this.canvas.width * 0.4 + Math.random() * this.canvas.width * 0.2;
            const y = this.canvas.height * 0.55 + Math.random() * this.canvas.height * 0.1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawGenericLandscape(imageData) {
        // 汎用風景
        this.drawNatureScenery(imageData);
    }

    addLocationOverlay(regionId, imageData) {
        // 半透明の情報オーバーレイ
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, this.canvas.height - 120, this.canvas.width, 120);
        
        // タイトル
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 28px "Noto Sans JP", sans-serif';
        this.ctx.fillText(imageData.title, 20, this.canvas.height - 80);
        
        // 説明
        this.ctx.font = '16px "Noto Sans JP", sans-serif';
        const description = this.wrapText(imageData.description, this.canvas.width - 40, 16);
        description.forEach((line, index) => {
            this.ctx.fillText(line, 20, this.canvas.height - 50 + index * 20);
        });
        
        // タグ
        this.ctx.font = '14px "Noto Sans JP", sans-serif';
        this.ctx.fillStyle = '#87CEEB';
        const tagText = imageData.tags.map(tag => `#${tag}`).join(' ');
        this.ctx.fillText(tagText, 20, this.canvas.height - 10);
    }

    wrapText(text, maxWidth, fontSize) {
        const words = text.split('');
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i];
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        
        return lines.slice(0, 2); // 最大2行
    }

    setupMapIntegration() {
        // 地図統合機能
        this.mapData = {
            center: { lat: 36.3500, lng: 136.6000 },
            zoom: 10,
            markers: []
        };
        
        // 各地域の画像データをマーカーとして登録
        Object.entries(this.imageData).forEach(([regionId, regionData]) => {
            regionData.images.forEach((imageData, index) => {
                this.mapData.markers.push({
                    id: `${regionId}_${index}`,
                    regionId: regionId,
                    position: imageData.coordinates,
                    title: imageData.title,
                    description: imageData.description,
                    imageData: imageData,
                    type: 'photo_spot'
                });
            });
        });
    }

    initializeImageDatabase() {
        // ローカルストレージに画像データベースを保存
        const imageDatabase = {
            version: '1.0',
            lastUpdate: Date.now(),
            regions: this.imageData,
            mapData: this.mapData,
            metadata: {
                totalImages: this.getTotalImageCount(),
                totalRegions: Object.keys(this.imageData).length,
                copyright: 'All images are generated and copyright-free',
                license: 'Creative Commons CC0 1.0 Universal'
            }
        };
        
        localStorage.setItem('hakusan_image_database', JSON.stringify(imageDatabase));
    }

    getTotalImageCount() {
        return Object.values(this.imageData).reduce((total, region) => total + region.images.length, 0);
    }

    getLocationImages(regionId) {
        return this.imageData[regionId] || null;
    }

    getImageByCoordinates(lat, lng, radius = 0.01) {
        const nearbyImages = [];
        
        Object.entries(this.imageData).forEach(([regionId, regionData]) => {
            regionData.images.forEach((imageData, index) => {
                const distance = this.calculateDistance(
                    lat, lng,
                    imageData.coordinates.lat, imageData.coordinates.lng
                );
                
                if (distance <= radius) {
                    nearbyImages.push({
                        regionId,
                        imageIndex: index,
                        imageData,
                        distance
                    });
                }
            });
        });
        
        return nearbyImages.sort((a, b) => a.distance - b.distance);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 地球の半径（km）
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    createLocationPhotoElement(regionId, imageIndex) {
        const regionData = this.imageData[regionId];
        if (!regionData || !regionData.images[imageIndex]) return null;
        
        const imageData = regionData.images[imageIndex];
        const generatedImage = this.generateLocationImage(regionId, imageData);
        
        const photoElement = document.createElement('div');
        photoElement.className = 'location-photo';
        photoElement.innerHTML = `
            <div class="photo-container">
                <img src="${generatedImage}" alt="${imageData.title}" class="location-image">
                <div class="photo-overlay">
                    <h3 class="photo-title">${imageData.title}</h3>
                    <p class="photo-description">${imageData.description}</p>
                    <div class="photo-tags">
                        ${imageData.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                    <div class="photo-metadata">
                        <span class="best-time">撮影推奨: ${imageData.bestTime}</span>
                        <span class="difficulty">難易度: ${this.getDifficultyText(imageData.difficulty)}</span>
                    </div>
                </div>
            </div>
        `;
        
        return photoElement;
    }

    getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': '初級',
            'moderate': '中級',
            'challenging': '上級'
        };
        return difficultyMap[difficulty] || '不明';
    }

    displayLocationGallery(containerId, regionId = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        container.className = 'location-gallery';
        
        const regionsToShow = regionId ? [regionId] : Object.keys(this.imageData);
        
        regionsToShow.forEach(region => {
            const regionData = this.imageData[region];
            if (!regionData) return;
            
            const regionSection = document.createElement('div');
            regionSection.className = 'region-section';
            regionSection.innerHTML = `<h2 class="region-title">${regionData.name}</h2>`;
            
            const imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            
            regionData.images.forEach((imageData, index) => {
                const photoElement = this.createLocationPhotoElement(region, index);
                if (photoElement) {
                    imageGrid.appendChild(photoElement);
                }
            });
            
            regionSection.appendChild(imageGrid);
            container.appendChild(regionSection);
        });
        
        this.addGalleryStyles();
    }

    addGalleryStyles() {
        if (document.getElementById('location-gallery-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'location-gallery-styles';
        styles.textContent = `
            .location-gallery {
                padding: 20px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            
            .region-section {
                margin-bottom: 40px;
            }
            
            .region-title {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .location-photo {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            
            .location-photo:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            .photo-container {
                position: relative;
            }
            
            .location-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            
            .photo-overlay {
                padding: 15px;
            }
            
            .photo-title {
                font-size: 18px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 8px;
            }
            
            .photo-description {
                font-size: 14px;
                color: #7f8c8d;
                line-height: 1.4;
                margin-bottom: 10px;
            }
            
            .photo-tags {
                margin-bottom: 10px;
            }
            
            .tag {
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                margin-right: 5px;
                margin-bottom: 3px;
            }
            
            .photo-metadata {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #95a5a6;
            }
        `;
        
        document.head.appendChild(styles);
    }

    exportImageDatabase() {
        const database = JSON.parse(localStorage.getItem('hakusan_image_database') || '{}');
        const dataStr = JSON.stringify(database, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hakusan-image-database-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.locationImageSystem = new LocationImageSystem();
});

console.log('🖼️ 著作権フリー位置画像システム読み込み完了！');
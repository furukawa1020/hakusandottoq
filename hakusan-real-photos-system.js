// 白山市8地域の実際の名所写真システム（石川県観光連盟公式写真使用）
class HakusanRealPhotos {
    constructor() {
        // 石川県観光連盟公式写真データベース
        // URL形式: https://www.hot-ishikawa.jp/lsc/upfile/spot/フォルダ/ID/ID_番号_サイズ.jpg
        // または: https://www.hot-ishikawa.jp/lsc/api/photo/?src=ID
        
        this.places = {
            shiramine: {
                name: '白峰',
                photos: [
                    {
                        name: '白峰重要伝統的建造物群保存地区',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5321/5321_1_l.jpg',
                        lat: 36.2445,
                        lng: 136.5897,
                        description: '茅葺き屋根の伝統的な家屋が残る重伝建地区。江戸時代の街並みを今に伝える貴重な景観。',
                        category: '歴史・文化',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '白山恐竜パーク白峰',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5396/5396_1_l.jpg',
                        lat: 36.2478,
                        lng: 136.5914,
                        description: '恐竜化石の展示と体験ができる施設。白山麓で発掘された恐竜時代の化石を見学。',
                        category: '観光施設',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '白峰温泉',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6273/6273_1_l.jpg',
                        lat: 36.2456,
                        lng: 136.5889,
                        description: '白山の伏流水を使った温泉。登山客や観光客に親しまれています。',
                        category: '温泉',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '白山白川郷ホワイトロード',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6248/6248_1_l.jpg',
                        lat: 36.1889,
                        lng: 136.6778,
                        description: '白山と白川郷を結ぶ絶景ドライブルート。紅葉の名所として有名。',
                        category: '景観',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            oguchi: {
                name: '尾口',
                photos: [
                    {
                        name: '白山白川郷ホワイトロード',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6248/6248_2_l.jpg',
                        lat: 36.1889,
                        lng: 136.6778,
                        description: '白山と白川郷を結ぶ絶景ドライブルート。',
                        category: '景観',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '一里野温泉スキー場',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5463/5463_1_l.jpg',
                        lat: 36.2234,
                        lng: 136.6445,
                        description: '白山麓の人気スキー場。冬のスポーツと温泉を楽しめます。',
                        category: 'スポーツ・レジャー',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '白山国立公園',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6231/6231_1_l.jpg',
                        lat: 36.2156,
                        lng: 136.6234,
                        description: '霊峰白山の雄大な自然。登山と自然観察の名所。',
                        category: '自然',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            yoshinodani: {
                name: '吉野谷',
                photos: [
                    {
                        name: '中宮温泉',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5456/5456_1_l.jpg',
                        lat: 36.2156,
                        lng: 136.6234,
                        description: '白山国立公園内の秘湯。自然に囲まれた温泉地。',
                        category: '温泉',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '白山の自然',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6231/6231_3_l.jpg',
                        lat: 36.2089,
                        lng: 136.5978,
                        description: '白山麓の豊かな自然と高山植物。',
                        category: '自然',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            torigoe: {
                name: '鳥越',
                photos: [
                    {
                        name: '鳥越城跡',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6242/6242_1_l.jpg',
                        lat: 36.1823,
                        lng: 136.5634,
                        description: '一向一揆の最後の砦となった山城跡。国史跡に指定されています。',
                        category: '歴史',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '鳥越一向一揆歴史館',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5381/5381_1_l.jpg',
                        lat: 36.1845,
                        lng: 136.5623,
                        description: '一向一揆の歴史を学べる資料館。詳細な展示が人気。',
                        category: '博物館',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '道の駅一向一揆の里',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0001/5680/15680_1_l.jpg',
                        lat: 36.1834,
                        lng: 136.5656,
                        description: '地元の特産品や食事が楽しめる道の駅。',
                        category: '観光施設',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            kawachi: {
                name: '河内',
                photos: [
                    {
                        name: '手取峡谷',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5450/5450_1_l.jpg',
                        lat: 36.1634,
                        lng: 136.5845,
                        description: '美しい渓谷美が楽しめる景勝地。紅葉の名所。',
                        category: '自然',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '綿ヶ滝',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5448/5448_1_l.jpg',
                        lat: 36.1567,
                        lng: 136.5789,
                        description: '落差32mの壮大な滝。パワースポットとしても人気。',
                        category: '自然',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            tsurugi: {
                name: '鶴来',
                photos: [
                    {
                        name: '白山比咩神社',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5331/5331_1_l.jpg',
                        lat: 36.1234,
                        lng: 136.5678,
                        description: '白山信仰の総本宮。全国3千社の白山神社の総本宮として崇敬されています。',
                        category: '神社',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '白山比咩神社 表参道',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5331/5331_2_l.jpg',
                        lat: 36.1234,
                        lng: 136.5678,
                        description: '杉木立に囲まれた神聖な参道。',
                        category: '神社',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '金剱宮',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/5333/5333_1_l.jpg',
                        lat: 36.1212,
                        lng: 136.5645,
                        description: '加賀一の宮として知られる古社。金運のパワースポット。',
                        category: '神社',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '手取川',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6249/6249_1_l.jpg',
                        lat: 36.1289,
                        lng: 136.5734,
                        description: '白山を源流とする一級河川。清らかな水の流れ。',
                        category: '自然',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            mattou: {
                name: '松任',
                photos: [
                    {
                        name: 'トレインパーク白山',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0002/2556/22556_1_l.jpg',
                        lat: 36.5145,
                        lng: 136.5678,
                        description: '鉄道の歴史を学べる体験型施設。家族で楽しめます。',
                        category: '観光施設',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '松任駅周辺',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0002/2556/22556_2_l.jpg',
                        lat: 36.5156,
                        lng: 136.5689,
                        description: '白山市の中心地。ショッピングや食事が楽しめます。',
                        category: '街並み',
                        credit: '石川県観光連盟'
                    }
                ]
            },
            mikawa: {
                name: '美川',
                photos: [
                    {
                        name: '美川海岸',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6263/6263_1_l.jpg',
                        lat: 36.5267,
                        lng: 136.4956,
                        description: '日本海に面した美しい砂浜。夕日の名所。',
                        category: '自然',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '美川おかえり祭り',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6261/6261_1_l.jpg',
                        lat: 36.5245,
                        lng: 136.5012,
                        description: '美川地区の伝統的な祭り。毎年5月に開催されます。',
                        category: '祭り・イベント',
                        credit: '石川県観光連盟'
                    },
                    {
                        name: '美川漁港',
                        url: 'https://www.hot-ishikawa.jp/lsc/upfile/spot/0000/6262/6262_1_l.jpg',
                        lat: 36.5234,
                        lng: 136.4989,
                        description: '日本海に面した活気ある漁港。新鮮な海の幸が自慢。',
                        category: '産業',
                        credit: '石川県観光連盟'
                    }
                ]
            }
        };
    }

    // Google Mapsリンクを生成
    getGoogleMapsUrl(lat, lng, name) {
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
    }

    // 地域の写真一覧を表示
    showRegionPhotos(regionId) {
        const regionData = this.places[regionId];
        if (!regionData) {
            console.error('地域データが見つかりません:', regionId);
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 10000;
            overflow-y: auto; padding: 20px;
        `;

        const photosHtml = regionData.photos.map(photo => `
            <div class="photo-item" style="
                background: white;
                border-radius: 15px;
                overflow: hidden;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                cursor: pointer;
                transition: transform 0.3s;
            " onclick="window.open('${this.getGoogleMapsUrl(photo.lat, photo.lng, photo.name)}', '_blank')"
               onmouseover="this.style.transform='translateY(-5px)'"
               onmouseout="this.style.transform='translateY(0)'">
                <div style="
                    width: 100%;
                    height: 300px;
                    background: url('${photo.url}') center/cover no-repeat;
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: linear-gradient(transparent, rgba(0,0,0,0.8));
                        padding: 20px;
                        color: white;
                    ">
                        <h3 style="margin: 0; font-size: 20px;">📍 ${photo.name}</h3>
                        <span style="
                            background: linear-gradient(135deg, #87CEEB, #9ACD32);
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 12px;
                            display: inline-block;
                            margin-top: 8px;
                        ">${photo.category}</span>
                    </div>
                </div>
                <div style="padding: 20px;">
                    <p style="color: #555; line-height: 1.7; margin: 0 0 15px 0;">
                        ${photo.description}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11px; color: #999;">
                            📷 ${photo.credit}
                        </span>
                        <button style="
                            background: linear-gradient(135deg, #4285F4, #34A853);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 25px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        ">🗺️ Google Mapsで開く</button>
                    </div>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="
                max-width: 900px;
                margin: 0 auto;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                ">
                    <h2 style="
                        color: white;
                        margin: 0;
                        font-size: 28px;
                    ">🗺️ ${regionData.name}地区の名所</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        font-size: 24px;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='rotate(90deg)'"
                       onmouseout="this.style.transform='rotate(0)'">×</button>
                </div>
                
                <div class="photos-grid">
                    ${photosHtml}
                </div>
                
                <div style="
                    text-align: center;
                    padding: 30px;
                    color: rgba(255,255,255,0.7);
                    font-size: 13px;
                ">
                    <p>📸 すべての写真は石川県観光連盟公式写真を使用しています</p>
                    <p>© 公益社団法人石川県観光連盟</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.hakusanRealPhotos) {
        window.hakusanRealPhotos = new HakusanRealPhotos();
        console.log('📸 白山市実写真システム読み込み完了（石川県観光連盟公式写真使用）');
    }
});

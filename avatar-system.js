// ピクセルアバターシステム
class HakusanAvatarSystem {
    constructor() {
        this.currentAvatar = {
            body: 'default',
            hair: 'short',
            outfit: 'casual',
            accessory: 'none',
            colors: {
                skin: '#FDBCB4',
                hair: '#8B4513',
                outfit: '#4ECDC4',
                accessory: '#FFD700'
            }
        };
        
        this.avatarParts = {
            body: {
                default: { name: '標準', unlocked: true },
                athletic: { name: '運動', unlocked: false, requirement: 'visit_5_regions' },
                explorer: { name: '探険', unlocked: false, requirement: 'rare_badge' }
            },
            hair: {
                short: { name: 'ショート', unlocked: true },
                long: { name: 'ロング', unlocked: false, requirement: 'visit_3_regions' },
                ponytail: { name: 'ポニテ', unlocked: false, requirement: 'epic_badge' },
                hat: { name: '帽子', unlocked: false, requirement: 'photo_10' }
            },
            outfit: {
                casual: { name: 'カジュアル', unlocked: true },
                outdoor: { name: 'アウトドア', unlocked: false, requirement: 'visit_mountain' },
                traditional: { name: '伝統', unlocked: false, requirement: 'legendary_badge' },
                modern: { name: 'モダン', unlocked: false, requirement: 'collection_50' }
            },
            accessory: {
                none: { name: 'なし', unlocked: true },
                backpack: { name: 'リュック', unlocked: false, requirement: 'walk_1000m' },
                camera: { name: 'カメラ', unlocked: false, requirement: 'photo_5' },
                badge: { name: 'バッジ', unlocked: false, requirement: 'uncommon_badge' }
            }
        };
        
        this.colorPalettes = {
            skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'],
            hair: ['#8B4513', '#FFD700', '#000000', '#654321', '#DC143C', '#4B0082'],
            outfit: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F4A261'],
            accessory: ['#FFD700', '#C0C0C0', '#8B4513', '#000000', '#FF6B6B', '#32CD32']
        };
        
        this.animations = {
            idle: { frames: 4, speed: 800 },
            walk: { frames: 4, speed: 200 },
            discover: { frames: 6, speed: 150 },
            celebrate: { frames: 8, speed: 100 }
        };
        
        this.currentAnimation = 'idle';
        this.animationFrame = 0;
        this.lastAnimationTime = 0;
        
        this.init();
    }
    
    init() {
        this.loadAvatar();
        this.checkUnlocks();
        this.setupCustomizer();
        console.log('👤 アバターシステム初期化完了');
    }
    
    setupCustomizer() {
        // アバターカスタマイザーのUI要素を作成
        const customizerModal = document.createElement('div');
        customizerModal.id = 'avatar-customizer';
        customizerModal.className = 'avatar-customizer-modal';
        customizerModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 8000;
            overflow-y: auto;
        `;
        
        customizerModal.innerHTML = `
            <div class="customizer-container" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 30px;
                max-width: 800px;
                width: 90%;
                max-height: 90%;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div class="customizer-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    color: white;
                ">
                    <h2 style="margin: 0; font-size: 24px;">👤 アバターカスタマイズ</h2>
                    <button id="close-customizer" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        font-size: 18px;
                    ">✕</button>
                </div>
                
                <div class="customizer-content" style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    align-items: start;
                ">
                    <div class="avatar-preview" style="
                        background: rgba(255,255,255,0.1);
                        border-radius: 15px;
                        padding: 20px;
                        text-align: center;
                    ">
                        <div style="color: white; margin-bottom: 15px; font-weight: bold;">プレビュー</div>
                        <canvas id="avatar-preview-canvas" style="
                            width: 200px;
                            height: 200px;
                            background: rgba(255,255,255,0.1);
                            border-radius: 10px;
                            image-rendering: pixelated;
                        " width="64" height="64"></canvas>
                        
                        <div style="margin-top: 15px;">
                            <button id="test-walk" style="
                                background: #4ECDC4;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 20px;
                                cursor: pointer;
                                margin: 5px;
                                font-size: 12px;
                            ">🚶 歩行</button>
                            <button id="test-discover" style="
                                background: #FFD700;
                                color: black;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 20px;
                                cursor: pointer;
                                margin: 5px;
                                font-size: 12px;
                            ">🔍 発見</button>
                            <button id="test-celebrate" style="
                                background: #FF6B6B;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 20px;
                                cursor: pointer;
                                margin: 5px;
                                font-size: 12px;
                            ">🎉 祝福</button>
                        </div>
                    </div>
                    
                    <div class="avatar-options" style="
                        color: white;
                    ">
                        <div class="option-section" style="margin-bottom: 25px;">
                            <h3 style="margin-bottom: 15px; color: #FFEAA7;">🧍 体型</h3>
                            <div id="body-options" class="option-grid"></div>
                        </div>
                        
                        <div class="option-section" style="margin-bottom: 25px;">
                            <h3 style="margin-bottom: 15px; color: #FFEAA7;">💇 髪型</h3>
                            <div id="hair-options" class="option-grid"></div>
                        </div>
                        
                        <div class="option-section" style="margin-bottom: 25px;">
                            <h3 style="margin-bottom: 15px; color: #FFEAA7;">👔 服装</h3>
                            <div id="outfit-options" class="option-grid"></div>
                        </div>
                        
                        <div class="option-section" style="margin-bottom: 25px;">
                            <h3 style="margin-bottom: 15px; color: #FFEAA7;">🎒 アクセサリー</h3>
                            <div id="accessory-options" class="option-grid"></div>
                        </div>
                        
                        <div class="color-section">
                            <h3 style="margin-bottom: 15px; color: #FFEAA7;">🎨 カラー</h3>
                            <div id="color-options"></div>
                        </div>
                        
                        <div style="margin-top: 30px; text-align: center;">
                            <button id="save-avatar" style="
                                background: linear-gradient(45deg, #4ECDC4, #45B7D1);
                                color: white;
                                border: none;
                                padding: 15px 30px;
                                border-radius: 25px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 16px;
                                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                            ">💾 アバター保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(customizerModal);
        
        // CSS追加
        const style = document.createElement('style');
        style.textContent = `
            .option-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 10px;
            }
            
            .option-button {
                padding: 10px;
                border: 2px solid transparent;
                border-radius: 10px;
                background: rgba(255,255,255,0.1);
                color: white;
                cursor: pointer;
                text-align: center;
                font-size: 12px;
                transition: all 0.3s;
            }
            
            .option-button:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }
            
            .option-button.selected {
                border-color: #4ECDC4;
                background: rgba(76, 205, 196, 0.3);
            }
            
            .option-button.locked {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .color-palette {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .color-option {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                border: 3px solid transparent;
                transition: transform 0.2s;
            }
            
            .color-option:hover {
                transform: scale(1.1);
            }
            
            .color-option.selected {
                border-color: white;
                box-shadow: 0 0 10px rgba(255,255,255,0.5);
            }
        `;
        document.head.appendChild(style);
        
        this.setupCustomizerEvents();
        this.updateCustomizerUI();
    }
    
    setupCustomizerEvents() {
        // 閉じるボタン
        document.getElementById('close-customizer').addEventListener('click', () => {
            this.closeCustomizer();
        });
        
        // 保存ボタン
        document.getElementById('save-avatar').addEventListener('click', () => {
            this.saveAvatar();
            this.closeCustomizer();
        });
        
        // アニメーションテストボタン
        document.getElementById('test-walk').addEventListener('click', () => {
            this.playAnimation('walk', 2000);
        });
        
        document.getElementById('test-discover').addEventListener('click', () => {
            this.playAnimation('discover', 1500);
        });
        
        document.getElementById('test-celebrate').addEventListener('click', () => {
            this.playAnimation('celebrate', 2000);
        });
    }
    
    updateCustomizerUI() {
        // 各パーツのオプションボタンを作成
        Object.entries(this.avatarParts).forEach(([partType, parts]) => {
            const container = document.getElementById(`${partType}-options`);
            container.innerHTML = '';
            
            Object.entries(parts).forEach(([partId, partData]) => {
                const button = document.createElement('div');
                button.className = 'option-button';
                button.textContent = partData.name;
                
                if (!partData.unlocked) {
                    button.classList.add('locked');
                    button.title = `要件: ${this.getRequirementText(partData.requirement)}`;
                } else {
                    button.addEventListener('click', () => {
                        this.selectPart(partType, partId);
                    });
                }
                
                if (this.currentAvatar[partType] === partId) {
                    button.classList.add('selected');
                }
                
                container.appendChild(button);
            });
        });
        
        // カラーパレットを作成
        const colorContainer = document.getElementById('color-options');
        colorContainer.innerHTML = '';
        
        Object.entries(this.colorPalettes).forEach(([colorType, colors]) => {
            const section = document.createElement('div');
            section.innerHTML = `
                <div style="margin-bottom: 8px; font-size: 14px; font-weight: bold;">
                    ${this.getColorTypeName(colorType)}
                </div>
                <div class="color-palette" id="${colorType}-colors"></div>
            `;
            
            colorContainer.appendChild(section);
            
            const palette = document.getElementById(`${colorType}-colors`);
            colors.forEach(color => {
                const colorOption = document.createElement('div');
                colorOption.className = 'color-option';
                colorOption.style.backgroundColor = color;
                
                if (this.currentAvatar.colors[colorType] === color) {
                    colorOption.classList.add('selected');
                }
                
                colorOption.addEventListener('click', () => {
                    this.selectColor(colorType, color);
                });
                
                palette.appendChild(colorOption);
            });
        });
        
        // プレビュー更新
        this.updatePreview();
    }
    
    selectPart(partType, partId) {
        if (this.avatarParts[partType][partId].unlocked) {
            this.currentAvatar[partType] = partId;
            this.updateCustomizerUI();
        }
    }
    
    selectColor(colorType, color) {
        this.currentAvatar.colors[colorType] = color;
        this.updateCustomizerUI();
    }
    
    updatePreview() {
        const canvas = document.getElementById('avatar-preview-canvas');
        if (canvas) {
            this.drawAvatar(canvas.getContext('2d'), 32, 32, 64, this.currentAnimation, this.animationFrame);
        }
    }
    
    drawAvatar(ctx, x, y, size, animation = 'idle', frame = 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const centerX = x;
        const centerY = y;
        const scale = size / 64;
        
        ctx.save();
        ctx.scale(scale, scale);
        
        // アニメーションオフセット計算
        const animData = this.animations[animation];
        const frameOffset = this.calculateAnimationOffset(animation, frame);
        
        // 体を描画
        this.drawBody(ctx, centerX/scale, centerY/scale, frameOffset);
        
        // 髪を描画
        this.drawHair(ctx, centerX/scale, centerY/scale, frameOffset);
        
        // 服装を描画
        this.drawOutfit(ctx, centerX/scale, centerY/scale, frameOffset);
        
        // アクセサリーを描画
        this.drawAccessory(ctx, centerX/scale, centerY/scale, frameOffset);
        
        ctx.restore();
    }
    
    drawBody(ctx, x, y, offset) {
        const bodyColor = this.currentAvatar.colors.skin;
        const bodyType = this.currentAvatar.body;
        
        ctx.fillStyle = bodyColor;
        
        // 頭
        ctx.fillRect(x - 8, y - 16, 16, 16);
        
        // 体（体型に応じて調整）
        if (bodyType === 'athletic') {
            ctx.fillRect(x - 6, y, 12, 20 + offset.bodyBob);
        } else if (bodyType === 'explorer') {
            ctx.fillRect(x - 7, y, 14, 22 + offset.bodyBob);
        } else {
            ctx.fillRect(x - 6, y, 12, 20 + offset.bodyBob);
        }
        
        // 腕
        ctx.fillRect(x - 12 + offset.armSwing, y + 4, 4, 12);
        ctx.fillRect(x + 8 - offset.armSwing, y + 4, 4, 12);
        
        // 脚
        ctx.fillRect(x - 6 + offset.legStep, y + 20, 4, 12);
        ctx.fillRect(x + 2 - offset.legStep, y + 20, 4, 12);
    }
    
    drawHair(ctx, x, y, offset) {
        const hairColor = this.currentAvatar.colors.hair;
        const hairType = this.currentAvatar.hair;
        
        ctx.fillStyle = hairColor;
        
        switch (hairType) {
            case 'short':
                ctx.fillRect(x - 8, y - 20, 16, 8);
                break;
            case 'long':
                ctx.fillRect(x - 8, y - 20, 16, 8);
                ctx.fillRect(x - 6, y - 12, 12, 16);
                break;
            case 'ponytail':
                ctx.fillRect(x - 8, y - 20, 16, 8);
                ctx.fillRect(x + 6, y - 16, 4, 12 + offset.hairSway);
                break;
            case 'hat':
                ctx.fillStyle = this.currentAvatar.colors.accessory;
                ctx.fillRect(x - 10, y - 22, 20, 6);
                ctx.fillStyle = hairColor;
                ctx.fillRect(x - 6, y - 16, 12, 4);
                break;
        }
    }
    
    drawOutfit(ctx, x, y, offset) {
        const outfitColor = this.currentAvatar.colors.outfit;
        const outfitType = this.currentAvatar.outfit;
        
        ctx.fillStyle = outfitColor;
        
        switch (outfitType) {
            case 'casual':
                // シンプルなTシャツ
                ctx.fillRect(x - 6, y, 12, 16);
                break;
            case 'outdoor':
                // アウトドアジャケット
                ctx.fillRect(x - 7, y, 14, 18);
                ctx.fillStyle = this.darkenColor(outfitColor, 0.2);
                ctx.fillRect(x - 6, y + 2, 12, 2);
                break;
            case 'traditional':
                // 伝統的な服装
                ctx.fillRect(x - 8, y, 16, 20);
                ctx.fillStyle = this.darkenColor(outfitColor, 0.3);
                ctx.fillRect(x - 6, y + 4, 12, 2);
                break;
            case 'modern':
                // モダンなスタイル
                ctx.fillRect(x - 6, y, 12, 16);
                ctx.fillStyle = this.darkenColor(outfitColor, 0.2);
                ctx.fillRect(x - 4, y + 2, 8, 2);
                break;
        }
    }
    
    drawAccessory(ctx, x, y, offset) {
        const accessoryColor = this.currentAvatar.colors.accessory;
        const accessoryType = this.currentAvatar.accessory;
        
        ctx.fillStyle = accessoryColor;
        
        switch (accessoryType) {
            case 'backpack':
                ctx.fillRect(x + 6, y + 2, 4, 12);
                break;
            case 'camera':
                ctx.fillRect(x - 2, y + 8, 4, 3);
                ctx.fillStyle = '#000000';
                ctx.fillRect(x - 1, y + 9, 2, 1);
                break;
            case 'badge':
                ctx.fillRect(x - 8, y + 4, 3, 3);
                break;
        }
    }
    
    calculateAnimationOffset(animation, frame) {
        const offset = {
            bodyBob: 0,
            armSwing: 0,
            legStep: 0,
            hairSway: 0
        };
        
        switch (animation) {
            case 'walk':
                offset.bodyBob = Math.sin(frame * 0.5) * 1;
                offset.armSwing = Math.sin(frame * 0.5) * 2;
                offset.legStep = Math.sin(frame * 0.5 + Math.PI) * 1;
                break;
            case 'discover':
                offset.bodyBob = Math.sin(frame * 0.3) * 2;
                offset.armSwing = Math.sin(frame * 0.8) * 3;
                break;
            case 'celebrate':
                offset.bodyBob = Math.sin(frame * 0.8) * 3;
                offset.armSwing = Math.sin(frame * 1.2) * 4;
                offset.hairSway = Math.sin(frame * 0.6) * 2;
                break;
        }
        
        return offset;
    }
    
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.floor(parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.floor(parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.floor(parseInt(hex.substr(4, 2), 16) * (1 - factor));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    playAnimation(animation, duration = 1000) {
        const oldAnimation = this.currentAnimation;
        this.currentAnimation = animation;
        this.animationFrame = 0;
        
        setTimeout(() => {
            this.currentAnimation = oldAnimation;
        }, duration);
    }
    
    updateAnimation() {
        const now = Date.now();
        const animData = this.animations[this.currentAnimation];
        
        if (now - this.lastAnimationTime > animData.speed) {
            this.animationFrame = (this.animationFrame + 1) % animData.frames;
            this.lastAnimationTime = now;
            
            // プレビュー更新
            this.updatePreview();
        }
    }
    
    checkUnlocks() {
        if (!window.badgeSystem) return;
        
        const stats = window.badgeSystem.getCollectionStats();
        const badges = window.badgeSystem.getCollectedBadges();
        
        // 要件チェック
        Object.entries(this.avatarParts).forEach(([partType, parts]) => {
            Object.entries(parts).forEach(([partId, partData]) => {
                if (!partData.unlocked && partData.requirement) {
                    partData.unlocked = this.checkRequirement(partData.requirement, stats, badges);
                }
            });
        });
    }
    
    checkRequirement(requirement, stats, badges) {
        switch (requirement) {
            case 'visit_3_regions':
                return Object.keys(stats.byRegion).length >= 3;
            case 'visit_5_regions':
                return Object.keys(stats.byRegion).length >= 5;
            case 'uncommon_badge':
                return badges.some(b => b.rarity === 'uncommon');
            case 'rare_badge':
                return badges.some(b => b.rarity === 'rare');
            case 'epic_badge':
                return badges.some(b => b.rarity === 'epic');
            case 'legendary_badge':
                return badges.some(b => b.rarity === 'legendary');
            case 'collection_50':
                return stats.completionRate >= 50;
            case 'visit_mountain':
                return stats.byRegion.shiramine || stats.byRegion.oguchi;
            case 'photo_5':
                return window.arCamera && window.arCamera.getPhotoGallery().length >= 5;
            case 'photo_10':
                return window.arCamera && window.arCamera.getPhotoGallery().length >= 10;
            case 'walk_1000m':
                return window.rpgEngine && window.rpgEngine.getTotalDistance() >= 1000;
            default:
                return false;
        }
    }
    
    getRequirementText(requirement) {
        const texts = {
            'visit_3_regions': '3地域訪問',
            'visit_5_regions': '5地域訪問',
            'uncommon_badge': '発見バッジ取得',
            'rare_badge': '探索バッジ取得',
            'epic_badge': '冒険バッジ取得',
            'legendary_badge': '制覇バッジ取得',
            'collection_50': 'コレクション50%',
            'visit_mountain': '山岳地域訪問',
            'photo_5': '写真5枚撮影',
            'photo_10': '写真10枚撮影',
            'walk_1000m': '1000m歩行'
        };
        
        return texts[requirement] || requirement;
    }
    
    getColorTypeName(colorType) {
        const names = {
            skin: '肌色',
            hair: '髪色',
            outfit: '服装色',
            accessory: 'アクセサリー色'
        };
        
        return names[colorType] || colorType;
    }
    
    openCustomizer() {
        this.checkUnlocks();
        this.updateCustomizerUI();
        document.getElementById('avatar-customizer').style.display = 'flex';
        
        // アニメーション開始
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 50);
    }
    
    closeCustomizer() {
        document.getElementById('avatar-customizer').style.display = 'none';
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
    
    saveAvatar() {
        try {
            localStorage.setItem('hakusan_avatar', JSON.stringify(this.currentAvatar));
            console.log('👤 アバター保存完了');
            
            // 成功通知
            this.showNotification('アバターを保存しました！', '#4ECDC4');
            
            // RPGエンジンに通知
            if (window.rpgEngine) {
                window.rpgEngine.updatePlayerAvatar(this.currentAvatar);
            }
            
        } catch (e) {
            console.error('アバター保存エラー:', e);
            this.showNotification('保存に失敗しました', '#FF6B6B');
        }
    }
    
    loadAvatar() {
        try {
            const saved = localStorage.getItem('hakusan_avatar');
            if (saved) {
                this.currentAvatar = { ...this.currentAvatar, ...JSON.parse(saved) };
                console.log('👤 アバター読み込み完了');
            }
        } catch (e) {
            console.error('アバター読み込みエラー:', e);
        }
    }
    
    showNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: bold;
            transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getCurrentAvatar() {
        return this.currentAvatar;
    }
    
    getAvatarData() {
        return {
            avatar: this.currentAvatar,
            unlockedParts: this.getUnlockedParts(),
            stats: this.getAvatarStats()
        };
    }
    
    getUnlockedParts() {
        const unlocked = {};
        
        Object.entries(this.avatarParts).forEach(([partType, parts]) => {
            unlocked[partType] = {};
            Object.entries(parts).forEach(([partId, partData]) => {
                unlocked[partType][partId] = partData.unlocked;
            });
        });
        
        return unlocked;
    }
    
    getAvatarStats() {
        let totalParts = 0;
        let unlockedParts = 0;
        
        Object.values(this.avatarParts).forEach(parts => {
            Object.values(parts).forEach(partData => {
                totalParts++;
                if (partData.unlocked) unlockedParts++;
            });
        });
        
        return {
            totalParts,
            unlockedParts,
            unlockRate: (unlockedParts / totalParts) * 100
        };
    }
    
    // RPGマップとの連携
    setMap(mapEngine) {
        this.mapEngine = mapEngine;
        console.log('🔗 アバターシステム <-> マップエンジン連携完了');
    }
    
    getCurrentAvatar() {
        return {
            ...this.currentAvatar,
            sprite: this.generateAvatarSprite(),
            animation: this.currentAnimation
        };
    }
    
    generateAvatarSprite() {
        // 16x16ピクセルのアバタースプライトを生成
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        // 背景透明
        ctx.clearRect(0, 0, 16, 16);
        
        // 体の描画
        ctx.fillStyle = this.currentAvatar.colors.skin;
        ctx.fillRect(6, 4, 4, 6); // 頭
        ctx.fillRect(5, 10, 6, 6); // 体
        
        // 髪の描画
        ctx.fillStyle = this.currentAvatar.colors.hair;
        switch(this.currentAvatar.hair) {
            case 'short':
                ctx.fillRect(5, 3, 6, 3);
                break;
            case 'long':
                ctx.fillRect(4, 3, 8, 4);
                break;
            case 'ponytail':
                ctx.fillRect(5, 3, 6, 3);
                ctx.fillRect(11, 4, 2, 3);
                break;
            case 'hat':
                ctx.fillStyle = this.currentAvatar.colors.accessory;
                ctx.fillRect(4, 2, 8, 4);
                break;
        }
        
        // 服装の描画
        ctx.fillStyle = this.currentAvatar.colors.outfit;
        switch(this.currentAvatar.outfit) {
            case 'casual':
                ctx.fillRect(5, 10, 6, 4);
                break;
            case 'outdoor':
                ctx.fillRect(4, 10, 8, 4);
                ctx.fillRect(5, 14, 6, 2);
                break;
            case 'traditional':
                ctx.fillRect(4, 10, 8, 6);
                break;
        }
        
        // アクセサリーの描画
        if (this.currentAvatar.accessory !== 'none') {
            ctx.fillStyle = this.currentAvatar.colors.accessory;
            switch(this.currentAvatar.accessory) {
                case 'backpack':
                    ctx.fillRect(2, 11, 2, 3);
                    break;
                case 'camera':
                    ctx.fillRect(8, 12, 2, 2);
                    break;
                case 'badge':
                    ctx.fillRect(4, 11, 1, 1);
                    break;
            }
        }
        
        return canvas.toDataURL();
    }
    
    playAnimation(animationType) {
        if (this.animations[animationType]) {
            this.currentAnimation = animationType;
            this.animationFrame = 0;
            this.lastAnimationTime = Date.now();
            
            // マップエンジンに通知
            if (this.mapEngine) {
                this.mapEngine.updatePlayerAppearance();
            }
        }
    }
    
    onRegionDiscovered(regionId) {
        // 地域発見時のアバターアニメーション
        this.playAnimation('celebrate');
        
        // 新パーツのアンロック判定
        this.checkUnlocks();
        
        // 発見アニメーション後に通常に戻す
        setTimeout(() => {
            this.playAnimation('idle');
        }, 2000);
    }
    
    onBadgeCollected(badgeType) {
        // バッジ収集時のパーツアンロック
        this.playAnimation('discover');
        this.checkUnlocks();
        
        setTimeout(() => {
            this.playAnimation('idle');
        }, 1500);
    }
    
    // デバッグ用
    unlockAllParts() {
        Object.values(this.avatarParts).forEach(parts => {
            Object.values(parts).forEach(partData => {
                partData.unlocked = true;
            });
        });
        
        console.log('🔓 全パーツアンロック完了');
        this.updateCustomizerUI();
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.avatarSystem) {
        window.avatarSystem = new HakusanAvatarSystem();
    }
});

// エクスポート
window.HakusanAvatar = HakusanAvatarSystem;

console.log('👤 アバターシステム読み込み完了');
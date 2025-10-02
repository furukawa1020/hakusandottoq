// 白山ピクセルマップRPGエンジン
class HakusanRPGEngine {
    constructor() {
        this.canvas = document.getElementById('pixelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.miniMapCanvas = document.getElementById('miniMapCanvas');
        this.miniMapCtx = this.miniMapCanvas.getContext('2d');
        
        // マップ設定
        this.mapImage = null;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.scale = 2; // ピクセル倍率
        
        // カメラ設定
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // プレイヤー設定
        this.player = {
            x: 300, // 初期位置（白山市中央付近）
            y: 250,
            width: 16,
            height: 16,
            speed: 2,
            direction: 'down',
            animFrame: 0,
            animTimer: 0,
            isMoving: false
        };
        
        // バッジポイント（白山.pngの実際の地形に合わせて設定）
        this.badgePoints = {
            tsurugi: { x: 320, y: 280, name: '鶴来', discovered: false },
            mikawa: { x: 280, y: 350, name: '美川', discovered: false },
            mattou: { x: 300, y: 300, name: '松任', discovered: false },
            kawachi: { x: 380, y: 200, name: '河内', discovered: false },
            shiramine: { x: 450, y: 150, name: '白峰', discovered: false },
            yoshinodani: { x: 420, y: 180, name: '吉野谷', discovered: false },
            torigoe: { x: 350, y: 220, name: '鳥越', discovered: false },
            oguchi: { x: 480, y: 120, name: '尾口', discovered: false }
        };
        
        // 入力管理
        this.keys = {};
        this.lastMoveTime = 0;
        
        // ゲーム状態
        this.gameState = {
            badgesCollected: 0,
            currentRegion: null,
            nearestPoint: null,
            totalSteps: 0
        };
        
        this.init();
    }
    
    async init() {
        await this.loadMapImage();
        this.setupCanvas();
        this.setupControls();
        this.loadPlayerProgress();
        this.gameLoop();
        
        console.log('🗺️ 白山RPGマップエンジン初期化完了');
    }
    
    async loadMapImage() {
        return new Promise((resolve, reject) => {
            this.mapImage = new Image();
            this.mapImage.onload = () => {
                this.mapWidth = this.mapImage.width;
                this.mapHeight = this.mapImage.height;
                console.log(`📍 白山マップ読み込み完了: ${this.mapWidth}x${this.mapHeight}`);
                resolve();
            };
            this.mapImage.onerror = () => {
                console.error('❌ 白山.pngの読み込みに失敗');
                this.createFallbackMap();
                resolve();
            };
            this.mapImage.src = '白山.png';
        });
    }
    
    createFallbackMap() {
        // 白山.pngが読み込めない場合のフォールバック
        this.mapWidth = 600;
        this.mapHeight = 400;
        
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = this.mapWidth;
        fallbackCanvas.height = this.mapHeight;
        const fallbackCtx = fallbackCanvas.getContext('2d');
        
        // 基本的な地形を描画
        const gradient = fallbackCtx.createLinearGradient(0, 0, 0, this.mapHeight);
        gradient.addColorStop(0, '#87CEEB'); // 空
        gradient.addColorStop(0.3, '#228B22'); // 山
        gradient.addColorStop(0.7, '#90EE90'); // 平地
        gradient.addColorStop(1, '#4169E1'); // 海
        
        fallbackCtx.fillStyle = gradient;
        fallbackCtx.fillRect(0, 0, this.mapWidth, this.mapHeight);
        
        // 白山を描画
        fallbackCtx.fillStyle = '#F0F8FF';
        fallbackCtx.beginPath();
        fallbackCtx.arc(450, 120, 40, 0, Math.PI * 2);
        fallbackCtx.fill();
        
        // 手取川を描画
        fallbackCtx.strokeStyle = '#4169E1';
        fallbackCtx.lineWidth = 8;
        fallbackCtx.beginPath();
        fallbackCtx.moveTo(450, 160);
        fallbackCtx.quadraticCurveTo(350, 200, 300, 280);
        fallbackCtx.quadraticCurveTo(290, 320, 280, 380);
        fallbackCtx.stroke();
        
        this.mapImage = fallbackCanvas;
        console.log('🎨 フォールバックマップを生成');
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // ピクセル表現を維持
        this.ctx.imageSmoothingEnabled = false;
        this.miniMapCtx.imageSmoothingEnabled = false;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }
    
    setupControls() {
        // キーボード制御
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // タッチ制御（モバイル対応）
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            const threshold = 30;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > threshold) this.movePlayer('right');
                else if (deltaX < -threshold) this.movePlayer('left');
            } else {
                if (deltaY > threshold) this.movePlayer('down');
                else if (deltaY < -threshold) this.movePlayer('up');
            }
            e.preventDefault();
        });
        
        // クリック移動
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // カメラオフセットを考慮した実際の座標
            const worldX = (clickX / this.scale) + this.camera.x;
            const worldY = (clickY / this.scale) + this.camera.y;
            
            this.movePlayerToward(worldX, worldY);
        });
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.handleInput();
        this.updatePlayer();
        this.updateCamera();
        this.checkBadgePoints();
        this.updateGameState();
    }
    
    handleInput() {
        const now = Date.now();
        if (now - this.lastMoveTime < 150) return; // 移動速度制限
        
        let moved = false;
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.movePlayer('up');
            moved = true;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.movePlayer('down');
            moved = true;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.movePlayer('left');
            moved = true;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.movePlayer('right');
            moved = true;
        }
        if (this.keys['Space']) {
            this.interact();
            moved = true;
        }
        
        if (moved) {
            this.lastMoveTime = now;
        }
    }
    
    movePlayer(direction) {
        const oldX = this.player.x;
        const oldY = this.player.y;
        
        this.player.direction = direction;
        this.player.isMoving = true;
        
        switch (direction) {
            case 'up':
                this.player.y = Math.max(0, this.player.y - this.player.speed);
                break;
            case 'down':
                this.player.y = Math.min(this.mapHeight - this.player.height, this.player.y + this.player.speed);
                break;
            case 'left':
                this.player.x = Math.max(0, this.player.x - this.player.speed);
                break;
            case 'right':
                this.player.x = Math.min(this.mapWidth - this.player.width, this.player.x + this.player.speed);
                break;
        }
        
        // 移動した場合のみ歩数をカウント
        if (oldX !== this.player.x || oldY !== this.player.y) {
            this.gameState.totalSteps++;
            
            // 移動分析データを記録
            if (window.analyticsSystem) {
                window.analyticsSystem.recordMovement(this.player.x, this.player.y, direction);
            }
        }
        
        setTimeout(() => {
            this.player.isMoving = false;
        }, 200);
    }
    
    movePlayerToward(targetX, targetY) {
        const deltaX = targetX - this.player.x;
        const deltaY = targetY - this.player.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.movePlayer(deltaX > 0 ? 'right' : 'left');
        } else {
            this.movePlayer(deltaY > 0 ? 'down' : 'up');
        }
    }
    
    updatePlayer() {
        if (this.player.isMoving) {
            this.player.animTimer += 16;
            if (this.player.animTimer > 200) {
                this.player.animFrame = (this.player.animFrame + 1) % 4;
                this.player.animTimer = 0;
            }
        } else {
            this.player.animFrame = 0;
        }
    }
    
    updateCamera() {
        // プレイヤーを中心にカメラを配置
        this.camera.targetX = this.player.x - (this.canvas.width / this.scale) / 2;
        this.camera.targetY = this.player.y - (this.canvas.height / this.scale) / 2;
        
        // マップ境界内に制限
        this.camera.targetX = Math.max(0, Math.min(this.mapWidth - (this.canvas.width / this.scale), this.camera.targetX));
        this.camera.targetY = Math.max(0, Math.min(this.mapHeight - (this.canvas.height / this.scale), this.camera.targetY));
        
        // スムーズな カメラ移動
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
    }
    
    checkBadgePoints() {
        let nearestPoint = null;
        let nearestDistance = Infinity;
        
        Object.entries(this.badgePoints).forEach(([id, point]) => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - point.x, 2) + 
                Math.pow(this.player.y - point.y, 2)
            );
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPoint = { id, ...point, distance };
            }
            
            // バッジ取得範囲内かチェック
            if (distance < 30 && !point.discovered) {
                this.discoverBadgePoint(id, point);
            }
        });
        
        this.gameState.nearestPoint = nearestPoint;
    }
    
    discoverBadgePoint(id, point) {
        point.discovered = true;
        this.gameState.badgesCollected++;
        
        // バッジ取得を他のシステムに通知
        if (window.badgeSystem) {
            window.badgeSystem.collectBadge(id);
        }
        
        // 通知表示
        this.showNotification(`🏅 ${point.name}地区を発見！`, `新しいバッジを取得しました`);
        
        // 効果音（可能であれば）
        this.playDiscoverySound();
        
        console.log(`🎉 バッジ発見: ${point.name}`);
    }
    
    interact() {
        const nearest = this.gameState.nearestPoint;
        if (nearest && nearest.distance < 50) {
            // 近くのポイントと相互作用
            if (nearest.discovered) {
                this.showNotification(`📍 ${nearest.name}地区`, '既に発見済みの地域です');
            } else {
                this.showNotification(`🔍 ${nearest.name}地区`, 'もう少し近づいてみましょう');
            }
        }
    }
    
    updateGameState() {
        // 現在地域の判定
        let currentRegion = null;
        Object.entries(this.badgePoints).forEach(([id, point]) => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - point.x, 2) + 
                Math.pow(this.player.y - point.y, 2)
            );
            if (distance < 80) {
                currentRegion = point.name;
            }
        });
        
        this.gameState.currentRegion = currentRegion;
    }
    
    render() {
        // メインキャンバスをクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 背景マップを描画
        this.renderMap();
        
        // バッジポイントを描画
        this.renderBadgePoints();
        
        // プレイヤーを描画
        this.renderPlayer();
        
        // エフェクトを描画
        this.renderEffects();
        
        // ミニマップを描画
        this.renderMiniMap();
        
        // UIを更新
        this.updateUI();
    }
    
    renderMap() {
        if (!this.mapImage) return;
        
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // 白山.pngを描画
        this.ctx.drawImage(this.mapImage, 0, 0);
        
        this.ctx.restore();
    }
    
    renderBadgePoints() {
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        Object.entries(this.badgePoints).forEach(([id, point]) => {
            if (point.discovered) {
                // 発見済みポイント
                this.ctx.fillStyle = '#FFD700';
                this.ctx.strokeStyle = '#FFA500';
                this.ctx.lineWidth = 2;
            } else {
                // 未発見ポイント
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                this.ctx.strokeStyle = '#CCCCCC';
                this.ctx.lineWidth = 1;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // ラベル表示
            this.ctx.fillStyle = point.discovered ? '#FFD700' : '#FFFFFF';
            this.ctx.font = '12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(point.name, point.x, point.y - 15);
        });
        
        this.ctx.restore();
    }
    
    renderPlayer() {
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // プレイヤーの影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.player.x + 8, this.player.y + 14, 6, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // プレイヤー本体（ピクセルアート風）
        this.drawPixelPlayer();
        
        this.ctx.restore();
    }
    
    drawPixelPlayer() {
        const x = this.player.x;
        const y = this.player.y;
        const frame = this.player.animFrame;
        
        // 基本カラー（アバターシステムで変更可能）
        const colors = this.getPlayerColors();
        
        // 頭
        this.ctx.fillStyle = colors.skin;
        this.ctx.fillRect(x + 6, y + 2, 4, 4);
        
        // 髪
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 5, y + 1, 6, 3);
        
        // 体
        this.ctx.fillStyle = colors.clothing;
        this.ctx.fillRect(x + 5, y + 6, 6, 6);
        
        // 腕（アニメーション）
        const armOffset = this.player.isMoving ? (frame % 2 === 0 ? 1 : -1) : 0;
        this.ctx.fillStyle = colors.skin;
        this.ctx.fillRect(x + 3, y + 7 + armOffset, 2, 4);
        this.ctx.fillRect(x + 11, y + 7 - armOffset, 2, 4);
        
        // 足（アニメーション）
        const legOffset = this.player.isMoving ? (frame % 2 === 0 ? 1 : -1) : 0;
        this.ctx.fillStyle = colors.pants;
        this.ctx.fillRect(x + 6 + legOffset, y + 12, 2, 4);
        this.ctx.fillRect(x + 8 - legOffset, y + 12, 2, 4);
        
        // アクセサリ（バッジ数に応じて）
        if (this.gameState.badgesCollected > 0) {
            this.ctx.fillStyle = colors.accessory;
            this.ctx.fillRect(x + 7, y + 8, 2, 1); // バッジ
        }
    }
    
    getPlayerColors() {
        // アバターシステムからカラーを取得、デフォルト値を設定
        return {
            skin: '#FFDBAC',
            hair: '#8B4513',
            clothing: '#FF6347',
            pants: '#4169E1',
            accessory: '#FFD700'
        };
    }
    
    renderEffects() {
        // 発見エフェクトなどを描画
        const nearest = this.gameState.nearestPoint;
        if (nearest && nearest.distance < 50) {
            this.ctx.save();
            this.ctx.scale(this.scale, this.scale);
            this.ctx.translate(-this.camera.x, -this.camera.y);
            
            // 近接インジケーター
            const alpha = 0.5 + 0.3 * Math.sin(Date.now() * 0.01);
            this.ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(nearest.x, nearest.y, 20, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            this.ctx.restore();
        }
    }
    
    renderMiniMap() {
        this.miniMapCtx.clearRect(0, 0, 146, 146);
        
        // ミニマップ背景
        this.miniMapCtx.fillStyle = 'rgba(0, 50, 0, 0.8)';
        this.miniMapCtx.fillRect(0, 0, 146, 146);
        
        // マップを縮小して描画
        if (this.mapImage) {
            const scale = 140 / Math.max(this.mapWidth, this.mapHeight);
            const drawWidth = this.mapWidth * scale;
            const drawHeight = this.mapHeight * scale;
            const offsetX = (146 - drawWidth) / 2;
            const offsetY = (146 - drawHeight) / 2;
            
            this.miniMapCtx.drawImage(this.mapImage, offsetX, offsetY, drawWidth, drawHeight);
            
            // プレイヤー位置
            const playerX = offsetX + (this.player.x / this.mapWidth) * drawWidth;
            const playerY = offsetY + (this.player.y / this.mapHeight) * drawHeight;
            
            this.miniMapCtx.fillStyle = '#FF0000';
            this.miniMapCtx.beginPath();
            this.miniMapCtx.arc(playerX, playerY, 3, 0, Math.PI * 2);
            this.miniMapCtx.fill();
            
            // バッジポイント
            Object.values(this.badgePoints).forEach(point => {
                const pointX = offsetX + (point.x / this.mapWidth) * drawWidth;
                const pointY = offsetY + (point.y / this.mapHeight) * drawHeight;
                
                this.miniMapCtx.fillStyle = point.discovered ? '#FFD700' : '#FFFFFF';
                this.miniMapCtx.beginPath();
                this.miniMapCtx.arc(pointX, pointY, 2, 0, Math.PI * 2);
                this.miniMapCtx.fill();
            });
        }
    }
    
    updateUI() {
        // バッジカウント更新
        const badgeCountEl = document.getElementById('badgeCount');
        if (badgeCountEl) {
            badgeCountEl.textContent = `バッジ: ${this.gameState.badgesCollected}/8`;
        }
        
        // 現在地更新
        const currentLocationEl = document.getElementById('currentLocation');
        if (currentLocationEl) {
            const location = this.gameState.currentRegion || '冒険中';
            currentLocationEl.textContent = `現在地: ${location}`;
        }
        
        // 最寄りスポット更新
        const nearestSpotEl = document.getElementById('nearestSpot');
        if (nearestSpotEl) {
            const nearest = this.gameState.nearestPoint;
            if (nearest) {
                const distance = Math.round(nearest.distance);
                nearestSpotEl.textContent = `最寄り: ${nearest.name} (${distance}m)`;
            } else {
                nearestSpotEl.textContent = '最寄り: 探索中...';
            }
        }
    }
    
    showNotification(title, text) {
        const notification = document.getElementById('notification');
        const notificationTitle = document.getElementById('notificationTitle');
        const notificationText = document.getElementById('notificationText');
        
        if (notification && notificationTitle && notificationText) {
            notificationTitle.textContent = title;
            notificationText.textContent = text;
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    playDiscoverySound() {
        // Web Audio APIで簡単な効果音を生成
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    loadPlayerProgress() {
        const saved = localStorage.getItem('hakusan_rpg_progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.player.x = progress.playerX || this.player.x;
                this.player.y = progress.playerY || this.player.y;
                this.gameState.totalSteps = progress.totalSteps || 0;
                
                // バッジ状態を復元
                if (progress.discoveredBadges) {
                    progress.discoveredBadges.forEach(badgeId => {
                        if (this.badgePoints[badgeId]) {
                            this.badgePoints[badgeId].discovered = true;
                            this.gameState.badgesCollected++;
                        }
                    });
                }
                
                console.log('💾 プレイヤー進行状況を復元');
            } catch (e) {
                console.error('❌ 進行状況の復元に失敗:', e);
            }
        }
    }
    
    savePlayerProgress() {
        const discoveredBadges = Object.entries(this.badgePoints)
            .filter(([id, point]) => point.discovered)
            .map(([id, point]) => id);
        
        const progress = {
            playerX: this.player.x,
            playerY: this.player.y,
            totalSteps: this.gameState.totalSteps,
            discoveredBadges: discoveredBadges,
            timestamp: Date.now()
        };
        
        localStorage.setItem('hakusan_rpg_progress', JSON.stringify(progress));
    }
    
    // 外部からアクセス可能なメソッド
    moveToRegion(regionId) {
        const point = this.badgePoints[regionId];
        if (point) {
            this.player.x = point.x;
            this.player.y = point.y;
            this.camera.x = point.x - (this.canvas.width / this.scale) / 2;
            this.camera.y = point.y - (this.canvas.height / this.scale) / 2;
        }
    }
    
    getPlayerStats() {
        return {
            position: { x: this.player.x, y: this.player.y },
            totalSteps: this.gameState.totalSteps,
            badgesCollected: this.gameState.badgesCollected,
            currentRegion: this.gameState.currentRegion,
            discoveredRegions: Object.entries(this.badgePoints)
                .filter(([id, point]) => point.discovered)
                .map(([id, point]) => ({ id, name: point.name }))
        };
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.rpgEngine = new HakusanRPGEngine();
    
    // 定期的にプログレスを保存
    setInterval(() => {
        if (window.rpgEngine) {
            window.rpgEngine.savePlayerProgress();
        }
    }, 10000); // 10秒ごと
});

// ページ離脱時にプログレスを保存
window.addEventListener('beforeunload', () => {
    if (window.rpgEngine) {
        window.rpgEngine.savePlayerProgress();
    }
});

console.log('🎮 白山RPGエンジン読み込み完了');

// グローバル関数（HTMLから呼び出し用）
window.toggleRegionPhotos = function() {
    const panel = document.getElementById('regionPhotos');
    if (panel) {
        panel.classList.toggle('show');
    }
};

window.openAvatarCustomizer = function() {
    const customizer = document.getElementById('avatarCustomizer');
    if (customizer) {
        customizer.classList.add('show');
    }
};

window.closeAvatarCustomizer = function() {
    const customizer = document.getElementById('avatarCustomizer');
    if (customizer) {
        customizer.classList.remove('show');
    }
};

window.saveAvatar = function() {
    // アバター設定を保存
    console.log('アバターを保存しました');
    closeAvatarCustomizer();
};

window.exportAdventureData = function() {
    if (window.rpgEngine) {
        const stats = window.rpgEngine.getPlayerStats();
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hakusan-adventure-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
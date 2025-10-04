// ARカメラシステム（バッジオーバーレイ付き）
class HakusanARCamera {
    constructor() {
        this.isActive = false;
        this.stream = null;
        this.canvas = null;
        this.ctx = null;
        this.video = null;
        this.modal = null;
        this.currentBadge = null;
        this.photos = [];
        
        this.init();
    }
    
    init() {
        this.setupModal();
        this.setupEventListeners();
        console.log('ARカメラシステム初期化完了');
    }
    
    setupModal() {
        // ARカメラ用のモーダルを作成
        this.modal = document.createElement('div');
        this.modal.className = 'ar-camera-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            flex-direction: column;
        `;
        
        this.modal.innerHTML = `
            <div class="camera-container" style="
                position: relative;
                width: 90%;
                max-width: 600px;
                aspect-ratio: 4/3;
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                border: 3px solid #4ECDC4;
            ">
                <video id="ar-video" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                " autoplay muted playsinline></video>
                
                <canvas id="ar-overlay" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                "></canvas>
                
                <div class="camera-overlay" style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    color: white;
                    font-family: 'Courier New', monospace;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="location-info">
                            <div style="font-size: 18px; font-weight: bold;" id="current-location">位置取得中...</div>
                            <div style="font-size: 12px; opacity: 0.8;" id="current-coords">GPS: --</div>
                        </div>
                        <div class="ar-status" style="
                            background: rgba(76, 205, 196, 0.8);
                            padding: 8px 12px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: bold;
                        ">
                            📷 AR MODE
                        </div>
                    </div>
                </div>
                
                <div class="crosshair" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 40px;
                    height: 40px;
                    transform: translate(-50%, -50%);
                    border: 2px solid #4ECDC4;
                    border-radius: 50%;
                    opacity: 0.7;
                    animation: pulse 2s infinite;
                "></div>
            </div>
            
            <div class="camera-controls" style="
                display: flex;
                gap: 20px;
                margin-top: 20px;
                align-items: center;
            ">
                <button id="capture-btn" style="
                    width: 70px;
                    height: 70px;
                    border: 4px solid #fff;
                    border-radius: 50%;
                    background: #4ECDC4;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">📸</button>
                
                <button id="badge-toggle" style="
                    padding: 12px 20px;
                    background: rgba(255, 107, 107, 0.8);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                ">バッジ表示</button>
                
                <button id="close-camera" style="
                    padding: 12px 20px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 2px solid white;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                ">✕ 閉じる</button>
            </div>
            
            <div class="photo-gallery-preview" style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                height: 80px;
                display: none;
                overflow-x: auto;
                gap: 10px;
                align-items: center;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border-radius: 10px;
            " id="photo-preview"></div>
        `;
        
        document.body.appendChild(this.modal);
        
        // CSS アニメーション
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
            }
            
            #capture-btn:hover {
                background: #45B7D1 !important;
                transform: scale(1.1);
            }
            
            #capture-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
        
        this.video = document.getElementById('ar-video');
        this.canvas = document.getElementById('ar-overlay');
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupEventListeners() {
        document.getElementById('capture-btn').addEventListener('click', () => this.capturePhoto());
        document.getElementById('badge-toggle').addEventListener('click', () => this.toggleBadgeOverlay());
        document.getElementById('close-camera').addEventListener('click', () => this.close());
        
        // GPSの監視
        this.watchPosition();
    }
    
    async open(badgeData = null) {
        try {
            this.currentBadge = badgeData;
            
            // カメラストリーム開始
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });
            
            this.video.srcObject = this.stream;
            this.modal.style.display = 'flex';
            this.isActive = true;
            
            // キャンバスサイズを調整
            this.resizeCanvas();
            
            // オーバーレイ描画開始
            this.startOverlayRendering();
            
            // 分析記録
            if (window.analyticsSystem) {
                window.analyticsSystem.recordCameraUsage();
            }
            
            console.log('📷 ARカメラ開始');
            
        } catch (error) {
            console.error('カメラアクセスエラー:', error);
            alert('カメラにアクセスできません。権限を確認してください。');
        }
    }
    
    close() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        this.modal.style.display = 'none';
        this.isActive = false;
        this.stream = null;
        
        console.log('📷 ARカメラ終了');
    }
    
    resizeCanvas() {
        const rect = this.video.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    startOverlayRendering() {
        const render = () => {
            if (!this.isActive) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // ARバッジオーバーレイ
            if (this.currentBadge) {
                this.drawBadgeOverlay();
            }
            
            // GPS情報オーバーレイ
            this.drawLocationOverlay();
            
            // フレーム情報
            this.drawFrameInfo();
            
            requestAnimationFrame(render);
        };
        
        render();
    }
    
    drawBadgeOverlay() {
        if (!this.currentBadge) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const size = 120;
        
        // バッジ背景（グラデーション）
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
        gradient.addColorStop(1, 'rgba(154, 205, 50, 0.8)');
        
        this.ctx.save();
        
        // 背景円
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size/2 + 15, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fill();
        
        // バッジ円（ジオパークカラー）
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size/2, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        
        // バッジ絵文字
        this.ctx.font = 'bold 50px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(this.currentBadge.emoji || '★', centerX, centerY);
        
        // バッジ名
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(this.currentBadge.name || 'バッジ', centerX, centerY + size/2 + 30);
        this.ctx.fillText(this.currentBadge.name || 'バッジ', centerX, centerY + size/2 + 30);
        
        this.ctx.restore();
    }
    
    drawLocationOverlay() {
        // GPS座標の表示更新は別メソッドで処理
    }
    
    drawFrameInfo() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(76, 205, 196, 0.8)';
        this.ctx.font = '12px Courier New';
        this.ctx.textAlign = 'left';
        
        const timestamp = new Date().toLocaleTimeString();
        this.ctx.fillText(`TIME: ${timestamp}`, 10, this.canvas.height - 30);
        this.ctx.fillText(`RES: ${this.canvas.width}x${this.canvas.height}`, 10, this.canvas.height - 15);
        
        this.ctx.restore();
    }
    
    capturePhoto() {
        if (!this.isActive) return;
        
        // フラッシュ効果
        this.showFlashEffect();
        
        // 写真撮影
        const captureCanvas = document.createElement('canvas');
        const captureCtx = captureCanvas.getContext('2d');
        
        captureCanvas.width = this.video.videoWidth;
        captureCanvas.height = this.video.videoHeight;
        
        // ビデオフレームを描画
        captureCtx.drawImage(this.video, 0, 0);
        
        // オーバーレイを合成
        if (this.currentBadge) {
            const overlayCanvas = document.createElement('canvas');
            const overlayCtx = overlayCanvas.getContext('2d');
            overlayCanvas.width = captureCanvas.width;
            overlayCanvas.height = captureCanvas.height;
            
            // バッジオーバーレイを高解像度で描画
            this.drawHighResBadgeOverlay(overlayCtx, overlayCanvas.width, overlayCanvas.height);
            
            // 合成
            captureCtx.drawImage(overlayCanvas, 0, 0);
        }
        
        // 写真データ作成
        const photoData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            dataURL: captureCanvas.toDataURL('image/jpeg', 0.8),
            badge: this.currentBadge,
            location: this.currentLocation || null
        };
        
        this.photos.push(photoData);
        this.updatePhotoPreview();
        
        // ダウンロード
        this.downloadPhoto(photoData);
        
        // 音効果
        this.playShutterSound();
        
        // 分析記録
        if (window.analyticsSystem) {
            window.analyticsSystem.recordPhotoCapture(this.currentBadge?.regionId);
        }
        
        console.log('📸 写真撮影完了:', photoData.id);
    }
    
    drawHighResBadgeOverlay(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.15; // 画面サイズに比例
        
        if (this.currentBadge && this.currentBadge.image) {
            const img = new Image();
            img.onload = () => {
                ctx.save();
                ctx.globalAlpha = 0.9;
                
                // バッジ背景
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(centerX - size/2 - 15, centerY - size/2 - 15, size + 30, size + 30);
                
                // バッジ画像
                ctx.drawImage(img, centerX - size/2, centerY - size/2, size, size);
                
                // テキスト
                ctx.fillStyle = 'white';
                ctx.font = `bold ${size * 0.12}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                
                const text = `${this.currentBadge.regionName} ${this.currentBadge.rarityName}`;
                ctx.strokeText(text, centerX, centerY + size/2 + size * 0.2);
                ctx.fillText(text, centerX, centerY + size/2 + size * 0.2);
                
                ctx.restore();
            };
            img.src = this.currentBadge.image;
        }
    }
    
    showFlashEffect() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 10000;
            opacity: 0.8;
            pointer-events: none;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            flash.style.transition = 'opacity 0.2s';
            
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 200);
        }, 100);
    }
    
    playShutterSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not available');
        }
    }
    
    downloadPhoto(photoData) {
        const link = document.createElement('a');
        link.href = photoData.dataURL;
        link.download = `hakusan-photo-${photoData.id}.jpg`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    updatePhotoPreview() {
        const preview = document.getElementById('photo-preview');
        preview.innerHTML = '';
        
        if (this.photos.length > 0) {
            preview.style.display = 'flex';
            
            this.photos.slice(-5).forEach(photo => {
                const thumb = document.createElement('img');
                thumb.src = photo.dataURL;
                thumb.style.cssText = `
                    width: 60px;
                    height: 45px;
                    object-fit: cover;
                    border-radius: 5px;
                    border: 2px solid #4ECDC4;
                    cursor: pointer;
                `;
                
                thumb.addEventListener('click', () => {
                    this.showPhotoDetail(photo);
                });
                
                preview.appendChild(thumb);
            });
        } else {
            preview.style.display = 'none';
        }
    }
    
    showPhotoDetail(photo) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            flex-direction: column;
        `;
        
        modal.innerHTML = `
            <img src="${photo.dataURL}" style="
                max-width: 90%;
                max-height: 70%;
                border-radius: 10px;
                border: 3px solid #4ECDC4;
            ">
            <div style="
                color: white;
                text-align: center;
                margin-top: 20px;
                font-family: sans-serif;
            ">
                <div style="font-size: 18px; margin-bottom: 10px;">
                    📸 ${new Date(photo.timestamp).toLocaleString()}
                </div>
                ${photo.badge ? `
                    <div style="font-size: 14px; opacity: 0.8;">
                        バッジ: ${photo.badge.regionName} ${photo.badge.rarityName}
                    </div>
                ` : ''}
                ${photo.location ? `
                    <div style="font-size: 12px; opacity: 0.6; margin-top: 5px;">
                        位置: ${photo.location.lat}, ${photo.location.lng}
                    </div>
                ` : ''}
            </div>
            <button style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #4ECDC4;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            " onclick="this.parentElement.remove()">閉じる</button>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    toggleBadgeOverlay() {
        // バッジ表示の切り替え（現在は常に表示）
        const button = document.getElementById('badge-toggle');
        if (this.currentBadge) {
            this.currentBadge = null;
            button.textContent = 'バッジ非表示';
            button.style.background = 'rgba(128, 128, 128, 0.8)';
        } else if (window.badgeSystem) {
            // 最新のバッジを表示
            const badges = window.badgeSystem.getCollectedBadges();
            if (badges.length > 0) {
                this.currentBadge = badges[badges.length - 1];
                button.textContent = 'バッジ表示';
                button.style.background = 'rgba(255, 107, 107, 0.8)';
            }
        }
    }
    
    watchPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude.toFixed(6),
                        lng: position.coords.longitude.toFixed(6),
                        accuracy: position.coords.accuracy
                    };
                    
                    this.updateLocationDisplay();
                },
                (error) => {
                    console.log('GPS error:', error);
                    document.getElementById('current-coords').textContent = 'GPS: 取得不可';
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        }
    }
    
    updateLocationDisplay() {
        if (this.currentLocation) {
            document.getElementById('current-coords').textContent = 
                `GPS: ${this.currentLocation.lat}, ${this.currentLocation.lng}`;
            
            // 地域判定
            this.detectCurrentRegion();
        }
    }
    
    detectCurrentRegion() {
        if (!this.currentLocation || !window.badgeSystem) return;
        
        // 簡易的な地域判定（実際の座標範囲は要調整）
        const lat = parseFloat(this.currentLocation.lat);
        const lng = parseFloat(this.currentLocation.lng);
        
        // 白山市の大まかな地域判定
        let detectedRegion = '白山市';
        
        if (lat > 36.3 && lng > 136.6) {
            detectedRegion = '白山市内';
        }
        
        document.getElementById('current-location').textContent = detectedRegion;
    }
    
    getPhotoGallery() {
        return this.photos;
    }
    
    clearPhotoGallery() {
        this.photos = [];
        this.updatePhotoPreview();
    }
    
    // 外部から呼び出し可能
    openWithBadge(regionId, rarity = 'common') {
        if (window.badgeSystem) {
            const badge = {
                regionId,
                rarity,
                regionName: window.badgeSystem.regions[regionId]?.name,
                rarityName: window.badgeSystem.rarityLevels[rarity]?.name,
                image: window.badgeSystem.getBadgeImage(regionId, rarity)
            };
            
            this.open(badge);
        }
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.arCamera) {
        window.arCamera = new HakusanARCamera();
        
        // startCamera 関数を完全修正
        window.arCamera.startCamera = function() {
            console.log('📷 ARカメラ起動中...');
            return this.open();
        };
        
        // グローバル関数も定義
        window.openARCamera = function() {
            if (window.arCamera && typeof window.arCamera.open === 'function') {
                return window.arCamera.open();
            } else {
                console.error('ARカメラシステムが初期化されていません');
                alert('ARカメラシステムが読み込まれていません。ページを再読み込みしてください。');
            }
        };
    }
});

// グローバルエクスポート
window.HakusanAR = HakusanARCamera;

console.log('ARカメラシステム読み込み完了');
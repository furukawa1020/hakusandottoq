// AR写真撮影システム
class ARPhotoSystem {
    constructor() {
        this.isARActive = false;
        this.currentBadge = null;
        this.canvas = null;
        this.video = null;
        this.stream = null;
        this.photoHistory = [];
        
        this.init();
    }

    async init() {
        this.loadPhotoHistory();
        this.createARInterface();
    }

    loadPhotoHistory() {
        const saved = localStorage.getItem('ar_photo_history');
        this.photoHistory = saved ? JSON.parse(saved) : [];
    }

    savePhotoHistory() {
        localStorage.setItem('ar_photo_history', JSON.stringify(this.photoHistory));
    }

    createARInterface() {
        const arContainer = document.createElement('div');
        arContainer.id = 'ar-photo-container';
        arContainer.innerHTML = `
            <div class="ar-interface" style="display: none;">
                <div class="ar-header">
                    <h3>📱 ARバッジ写真撮影</h3>
                    <button class="close-ar-btn" onclick="arPhotoSystem.closeAR()">✕</button>
                </div>
                
                <div class="ar-camera-container">
                    <video id="ar-video" autoplay playsinline></video>
                    <canvas id="ar-canvas" style="display: none;"></canvas>
                    
                    <div class="ar-overlay">
                        <div class="badge-overlay" id="badge-overlay">
                            <!-- バッジがここに表示される -->
                        </div>
                        
                        <div class="ar-controls">
                            <button class="badge-position-btn" onclick="arPhotoSystem.cycleBadgePosition()">
                                📍 位置変更
                            </button>
                            <button class="badge-size-btn" onclick="arPhotoSystem.cycleBadgeSize()">
                                🔍 サイズ変更
                            </button>
                            <button class="capture-btn" onclick="arPhotoSystem.capturePhoto()">
                                📸 撮影
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="photo-preview" id="photo-preview" style="display: none;">
                    <img id="captured-photo" alt="Captured photo">
                    <div class="preview-controls">
                        <button class="save-photo-btn" onclick="arPhotoSystem.savePhoto()">
                            💾 保存
                        </button>
                        <button class="retake-btn" onclick="arPhotoSystem.retakePhoto()">
                            🔄 撮り直し
                        </button>
                        <button class="share-btn" onclick="arPhotoSystem.sharePhoto()">
                            📤 共有
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(arContainer);
        
        this.video = document.getElementById('ar-video');
        this.canvas = document.getElementById('ar-canvas');
    }

    async startAR(badgeId) {
        try {
            this.currentBadge = badgeId;
            
            // カメラアクセス
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',  // 背面カメラを優先
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            this.video.srcObject = this.stream;
            
            // ARインターフェースを表示
            document.querySelector('.ar-interface').style.display = 'block';
            this.isARActive = true;
            
            // バッジオーバーレイを設定
            this.setupBadgeOverlay(badgeId);
            
            // フルスクリーンモード
            this.enterFullscreen();
            
        } catch (error) {
            console.error('AR開始エラー:', error);
            alert('カメラへのアクセスができませんでした。\nブラウザの設定でカメラの使用を許可してください。');
        }
    }

    setupBadgeOverlay(badgeId) {
        const badgeOverlay = document.getElementById('badge-overlay');
        const badgeData = this.getBadgeData(badgeId);
        
        badgeOverlay.innerHTML = `
            <div class="ar-badge" data-position="top-right" data-size="medium">
                <img src="images/badges/${badgeId}.png" alt="${badgeData.name}バッジ" class="badge-image">
                <div class="badge-label">${badgeData.name}</div>
                <div class="badge-date">${new Date().toLocaleDateString('ja-JP')}</div>
            </div>
        `;
        
        this.badgePosition = 'top-right';
        this.badgeSize = 'medium';
    }

    getBadgeData(badgeId) {
        const badges = {
            tsurugi: { name: '鶴来', color: '#E74C3C' },
            mikawa: { name: '美川', color: '#3498DB' },
            mattou: { name: '松任', color: '#2ECC71' },
            kawachi: { name: '河内', color: '#F39C12' },
            shiramine: { name: '白峰', color: '#9B59B6' },
            yoshinodani: { name: '吉野谷', color: '#E67E22' },
            torigoe: { name: '鳥越', color: '#1ABC9C' },
            oguchi: { name: '尾口', color: '#34495E' }
        };
        
        return badges[badgeId] || { name: badgeId, color: '#95A5A6' };
    }

    cycleBadgePosition() {
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
        const currentIndex = positions.indexOf(this.badgePosition);
        this.badgePosition = positions[(currentIndex + 1) % positions.length];
        
        const badge = document.querySelector('.ar-badge');
        badge.setAttribute('data-position', this.badgePosition);
    }

    cycleBadgeSize() {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(this.badgeSize);
        this.badgeSize = sizes[(currentIndex + 1) % sizes.length];
        
        const badge = document.querySelector('.ar-badge');
        badge.setAttribute('data-size', this.badgeSize);
    }

    capturePhoto() {
        const canvas = this.canvas;
        const video = this.video;
        const ctx = canvas.getContext('2d');
        
        // キャンバスサイズをビデオに合わせる
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // ビデオフレームを描画
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // バッジオーバーレイを描画
        this.drawBadgeOverlay(ctx, canvas.width, canvas.height);
        
        // 撮影した画像を表示
        const capturedImage = canvas.toDataURL('image/jpeg', 0.9);
        document.getElementById('captured-photo').src = capturedImage;
        document.getElementById('photo-preview').style.display = 'block';
        
        // 撮影音効果
        this.playShutterSound();
        
        // 画面フラッシュ効果
        this.flashEffect();
    }

    drawBadgeOverlay(ctx, canvasWidth, canvasHeight) {
        const badge = document.querySelector('.ar-badge');
        const badgeData = this.getBadgeData(this.currentBadge);
        
        // バッジサイズを計算
        const sizes = {
            small: 0.15,
            medium: 0.2,
            large: 0.25
        };
        const sizeRatio = sizes[this.badgeSize];
        const badgeSize = Math.min(canvasWidth, canvasHeight) * sizeRatio;
        
        // バッジ位置を計算
        let x, y;
        const margin = 20;
        
        switch (this.badgePosition) {
            case 'top-left':
                x = margin;
                y = margin;
                break;
            case 'top-right':
                x = canvasWidth - badgeSize - margin;
                y = margin;
                break;
            case 'bottom-left':
                x = margin;
                y = canvasHeight - badgeSize - margin;
                break;
            case 'bottom-right':
                x = canvasWidth - badgeSize - margin;
                y = canvasHeight - badgeSize - margin;
                break;
            case 'center':
                x = (canvasWidth - badgeSize) / 2;
                y = (canvasHeight - badgeSize) / 2;
                break;
        }
        
        // バッジ背景（半透明円）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x + badgeSize/2, y + badgeSize/2, badgeSize/2 + 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // バッジ枠
        ctx.strokeStyle = badgeData.color;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // バッジテキスト（簡易版）
        ctx.fillStyle = badgeData.color;
        ctx.font = `bold ${badgeSize * 0.3}px 'Noto Sans JP', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(badgeData.name, x + badgeSize/2, y + badgeSize/2 + badgeSize * 0.1);
        
        // 日付
        ctx.font = `${badgeSize * 0.15}px 'Noto Sans JP', sans-serif`;
        ctx.fillStyle = '#666';
        ctx.fillText(new Date().toLocaleDateString('ja-JP'), x + badgeSize/2, y + badgeSize + 25);
    }

    playShutterSound() {
        // Web Audio APIを使用してシャッター音を生成
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    flashEffect() {
        const flashDiv = document.createElement('div');
        flashDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 10000;
            pointer-events: none;
            animation: flash 0.2s ease-out;
        `;
        
        document.body.appendChild(flashDiv);
        
        setTimeout(() => {
            document.body.removeChild(flashDiv);
        }, 200);
    }

    savePhoto() {
        const canvas = this.canvas;
        const photoData = {
            id: Date.now(),
            badgeId: this.currentBadge,
            imageData: canvas.toDataURL('image/jpeg', 0.9),
            timestamp: new Date().toISOString(),
            location: this.getBadgeData(this.currentBadge).name,
            position: this.badgePosition,
            size: this.badgeSize
        };
        
        this.photoHistory.push(photoData);
        this.savePhotoHistory();
        
        // 成功メッセージ
        this.showSuccessMessage('写真を保存しました！');
        
        // ダウンロードリンクを作成
        this.downloadPhoto(photoData);
        
        this.retakePhoto();
    }

    downloadPhoto(photoData) {
        const link = document.createElement('a');
        link.download = `hakusan-badge-${photoData.location}-${new Date(photoData.timestamp).toLocaleDateString('ja-JP')}.jpg`;
        link.href = photoData.imageData;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    sharePhoto() {
        const canvas = this.canvas;
        
        if (navigator.share) {
            // Web Share API使用
            canvas.toBlob(blob => {
                const file = new File([blob], 'hakusan-badge-photo.jpg', { type: 'image/jpeg' });
                navigator.share({
                    title: 'ハクサンリーグ バッジ写真',
                    text: `${this.getBadgeData(this.currentBadge).name}でバッジをゲット！`,
                    files: [file]
                });
            }, 'image/jpeg', 0.9);
        } else {
            // フォールバック: クリップボードにコピー
            this.copyToClipboard();
        }
    }

    async copyToClipboard() {
        try {
            const canvas = this.canvas;
            canvas.toBlob(async blob => {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                this.showSuccessMessage('写真をクリップボードにコピーしました！');
            });
        } catch (error) {
            console.error('クリップボードエラー:', error);
            alert('共有機能が利用できません');
        }
    }

    retakePhoto() {
        document.getElementById('photo-preview').style.display = 'none';
    }

    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2ECC71;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10001;
            font-size: 1.1rem;
            animation: fadeInOut 2s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 2000);
    }

    enterFullscreen() {
        const container = document.getElementById('ar-photo-container');
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }

    closeAR() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        document.querySelector('.ar-interface').style.display = 'none';
        this.isARActive = false;
        
        // フルスクリーン終了
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    getPhotoHistory() {
        return this.photoHistory;
    }
}

// CSS styles for AR interface
const arPhotoCSS = `
#ar-photo-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}

.ar-interface {
    width: 100%;
    height: 100%;
    background: black;
    color: white;
    overflow: hidden;
}

.ar-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10001;
}

.close-ar-btn {
    background: #E74C3C;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    cursor: pointer;
}

.ar-camera-container {
    position: relative;
    width: 100%;
    height: 100%;
}

#ar-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.badge-overlay {
    position: relative;
    width: 100%;
    height: 100%;
}

.ar-badge {
    position: absolute;
    transition: all 0.3s ease;
    pointer-events: none;
}

.ar-badge[data-position="top-left"] {
    top: 80px;
    left: 20px;
}

.ar-badge[data-position="top-right"] {
    top: 80px;
    right: 20px;
}

.ar-badge[data-position="bottom-left"] {
    bottom: 120px;
    left: 20px;
}

.ar-badge[data-position="bottom-right"] {
    bottom: 120px;
    right: 20px;
}

.ar-badge[data-position="center"] {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.ar-badge[data-size="small"] .badge-image {
    width: 60px;
    height: 60px;
}

.ar-badge[data-size="medium"] .badge-image {
    width: 80px;
    height: 80px;
}

.ar-badge[data-size="large"] .badge-image {
    width: 100px;
    height: 100px;
}

.badge-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.badge-label {
    text-align: center;
    margin-top: 0.5rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.badge-date {
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.8;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.ar-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    pointer-events: auto;
}

.ar-controls button {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 2px solid white;
    border-radius: 25px;
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.ar-controls button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.capture-btn {
    background: #E74C3C !important;
    width: 70px;
    height: 70px;
    border-radius: 50% !important;
    font-size: 1.5rem !important;
}

.photo-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}

#captured-photo {
    max-width: 90%;
    max-height: 70%;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.preview-controls {
    display: flex;
    gap: 1rem;
}

.preview-controls button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid white;
    border-radius: 25px;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.preview-controls button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.save-photo-btn {
    background: #2ECC71 !important;
}

.share-btn {
    background: #3498DB !important;
}

.success-message {
    font-family: 'Noto Sans JP', sans-serif;
}

@keyframes flash {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
}

@media (max-width: 768px) {
    .ar-controls {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .ar-controls button {
        font-size: 0.8rem;
        padding: 0.6rem 1rem;
    }
    
    .preview-controls {
        flex-direction: column;
        width: 90%;
    }
    
    .preview-controls button {
        width: 100%;
    }
}
`;

// CSS を動的に追加
if (!document.querySelector('#ar-photo-styles')) {
    const style = document.createElement('style');
    style.id = 'ar-photo-styles';
    style.textContent = arPhotoCSS;
    document.head.appendChild(style);
}

// グローバル関数：AR写真を開始
function startARPhoto(badgeId) {
    if (!window.arPhotoSystem) {
        window.arPhotoSystem = new ARPhotoSystem();
    }
    window.arPhotoSystem.startAR(badgeId);
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.arPhotoSystem = new ARPhotoSystem();
});
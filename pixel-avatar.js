// ドット絵アバターシステム
class PixelAvatarSystem {
    constructor() {
        this.avatarData = null;
        this.canvas = null;
        this.ctx = null;
        this.pixelSize = 8;
        this.avatarSize = 32; // 32x32 pixels
        this.isEditing = false;
        this.currentTool = 'pixel';
        this.currentColor = '#FF6B6B';
        this.colorPalette = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
            '#A3E4D7', '#FAD7A0', '#D5A6BD', '#A9DFBF', '#F9E79F'
        ];
        
        this.init();
    }

    init() {
        this.loadAvatarData();
        this.createAvatarInterface();
        this.setupEventListeners();
    }

    loadAvatarData() {
        const saved = localStorage.getItem('pixel_avatar_data');
        if (saved) {
            this.avatarData = JSON.parse(saved);
        } else {
            // デフォルトアバター（シンプルな顔）
            this.avatarData = this.createDefaultAvatar();
        }
    }

    createDefaultAvatar() {
        const defaultData = new Array(this.avatarSize * this.avatarSize).fill('transparent');
        
        // シンプルな顔を描画
        const center = Math.floor(this.avatarSize / 2);
        
        // 顔の輪郭
        this.drawCircle(defaultData, center, center, 12, '#FDBCB4');
        
        // 目
        this.setPixel(defaultData, center - 4, center - 3, '#2C3E50');
        this.setPixel(defaultData, center + 4, center - 3, '#2C3E50');
        
        // 口
        this.setPixel(defaultData, center - 1, center + 4, '#E74C3C');
        this.setPixel(defaultData, center, center + 4, '#E74C3C');
        this.setPixel(defaultData, center + 1, center + 4, '#E74C3C');
        
        return defaultData;
    }

    drawCircle(data, centerX, centerY, radius, color) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    this.setPixel(data, centerX + x, centerY + y, color);
                }
            }
        }
    }

    setPixel(data, x, y, color) {
        if (x >= 0 && x < this.avatarSize && y >= 0 && y < this.avatarSize) {
            data[y * this.avatarSize + x] = color;
        }
    }

    saveAvatarData() {
        localStorage.setItem('pixel_avatar_data', JSON.stringify(this.avatarData));
    }

    createAvatarInterface() {
        const avatarContainer = document.createElement('div');
        avatarContainer.id = 'pixel-avatar-container';
        avatarContainer.innerHTML = `
            <div class="avatar-editor" style="display: none;">
                <div class="editor-header">
                    <h3>🎨 ドット絵アバター作成</h3>
                    <button class="close-editor-btn" onclick="pixelAvatarSystem.closeEditor()">✕</button>
                </div>
                
                <div class="editor-content">
                    <div class="canvas-container">
                        <canvas id="avatar-canvas" width="256" height="256"></canvas>
                        <div class="canvas-grid" id="canvas-grid"></div>
                    </div>
                    
                    <div class="editor-tools">
                        <div class="tool-section">
                            <h4>🛠️ ツール</h4>
                            <div class="tool-buttons">
                                <button class="tool-btn active" data-tool="pixel" title="ピクセル描画">
                                    🖌️
                                </button>
                                <button class="tool-btn" data-tool="eraser" title="消しゴム">
                                    🧹
                                </button>
                                <button class="tool-btn" data-tool="fill" title="塗りつぶし">
                                    🪣
                                </button>
                                <button class="tool-btn" data-tool="eyedropper" title="スポイト">
                                    💉
                                </button>
                            </div>
                        </div>
                        
                        <div class="color-section">
                            <h4>🎨 カラーパレット</h4>
                            <div class="color-palette" id="color-palette">
                                ${this.colorPalette.map(color => 
                                    `<div class="color-swatch" style="background-color: ${color}" data-color="${color}"></div>`
                                ).join('')}
                            </div>
                            <div class="current-color">
                                <span>現在の色:</span>
                                <div class="color-display" style="background-color: ${this.currentColor}"></div>
                            </div>
                        </div>
                        
                        <div class="preset-section">
                            <h4>📦 プリセット</h4>
                            <div class="preset-buttons">
                                <button class="preset-btn" onclick="pixelAvatarSystem.loadPreset('default')">
                                    👤 デフォルト
                                </button>
                                <button class="preset-btn" onclick="pixelAvatarSystem.loadPreset('cat')">
                                    🐱 ネコ
                                </button>
                                <button class="preset-btn" onclick="pixelAvatarSystem.loadPreset('robot')">
                                    🤖 ロボット
                                </button>
                                <button class="preset-btn" onclick="pixelAvatarSystem.clearCanvas()">
                                    🗑️ クリア
                                </button>
                            </div>
                        </div>
                        
                        <div class="action-section">
                            <button class="save-avatar-btn" onclick="pixelAvatarSystem.saveAvatar()">
                                💾 保存
                            </button>
                            <button class="export-btn" onclick="pixelAvatarSystem.exportAvatar()">
                                📤 エクスポート
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="avatar-display" id="avatar-display">
                <canvas id="mini-avatar-canvas" width="64" height="64"></canvas>
            </div>
        `;
        
        document.body.appendChild(avatarContainer);
        
        this.canvas = document.getElementById('avatar-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.miniCanvas = document.getElementById('mini-avatar-canvas');
        this.miniCtx = this.miniCanvas.getContext('2d');
        
        // キャンバスの設定
        this.ctx.imageSmoothingEnabled = false;
        this.miniCtx.imageSmoothingEnabled = false;
        
        this.drawAvatar();
        this.drawMiniAvatar();
    }

    setupEventListeners() {
        // ツール選択
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
            });
        });
        
        // カラーパレット
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                this.currentColor = e.target.dataset.color;
                document.querySelector('.color-display').style.backgroundColor = this.currentColor;
            });
        });
        
        // キャンバスクリック
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.handleCanvasClick(e);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing && this.currentTool === 'pixel') {
                this.handleCanvasClick(e);
            }
        });
        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.pixelSize);
        const y = Math.floor((e.clientY - rect.top) / this.pixelSize);
        
        if (x >= 0 && x < this.avatarSize && y >= 0 && y < this.avatarSize) {
            switch (this.currentTool) {
                case 'pixel':
                    this.setPixel(this.avatarData, x, y, this.currentColor);
                    break;
                case 'eraser':
                    this.setPixel(this.avatarData, x, y, 'transparent');
                    break;
                case 'fill':
                    this.floodFill(x, y, this.currentColor);
                    break;
                case 'eyedropper':
                    const color = this.getPixelColor(x, y);
                    if (color && color !== 'transparent') {
                        this.currentColor = color;
                        document.querySelector('.color-display').style.backgroundColor = this.currentColor;
                    }
                    break;
            }
            
            this.drawAvatar();
            this.drawMiniAvatar();
        }
    }

    getPixelColor(x, y) {
        return this.avatarData[y * this.avatarSize + x];
    }

    floodFill(startX, startY, newColor) {
        const originalColor = this.getPixelColor(startX, startY);
        if (originalColor === newColor) return;
        
        const stack = [[startX, startY]];
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            
            if (x < 0 || x >= this.avatarSize || y < 0 || y >= this.avatarSize) continue;
            if (this.getPixelColor(x, y) !== originalColor) continue;
            
            this.setPixel(this.avatarData, x, y, newColor);
            
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    drawAvatar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.avatarSize; y++) {
            for (let x = 0; x < this.avatarSize; x++) {
                const color = this.avatarData[y * this.avatarSize + x];
                if (color && color !== 'transparent') {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
                }
            }
        }
    }

    drawMiniAvatar() {
        this.miniCtx.clearRect(0, 0, this.miniCanvas.width, this.miniCanvas.height);
        
        const miniPixelSize = this.miniCanvas.width / this.avatarSize;
        
        for (let y = 0; y < this.avatarSize; y++) {
            for (let x = 0; x < this.avatarSize; x++) {
                const color = this.avatarData[y * this.avatarSize + x];
                if (color && color !== 'transparent') {
                    this.miniCtx.fillStyle = color;
                    this.miniCtx.fillRect(x * miniPixelSize, y * miniPixelSize, miniPixelSize, miniPixelSize);
                }
            }
        }
    }

    openEditor() {
        document.querySelector('.avatar-editor').style.display = 'block';
        this.isEditing = true;
    }

    closeEditor() {
        document.querySelector('.avatar-editor').style.display = 'none';
        this.isEditing = false;
    }

    loadPreset(presetName) {
        switch (presetName) {
            case 'default':
                this.avatarData = this.createDefaultAvatar();
                break;
            case 'cat':
                this.avatarData = this.createCatAvatar();
                break;
            case 'robot':
                this.avatarData = this.createRobotAvatar();
                break;
        }
        
        this.drawAvatar();
        this.drawMiniAvatar();
    }

    createCatAvatar() {
        const catData = new Array(this.avatarSize * this.avatarSize).fill('transparent');
        const center = Math.floor(this.avatarSize / 2);
        
        // ネコの顔
        this.drawCircle(catData, center, center, 10, '#F39C12');
        
        // 耳
        this.drawTriangle(catData, center - 6, center - 8, 4, '#F39C12');
        this.drawTriangle(catData, center + 6, center - 8, 4, '#F39C12');
        
        // 目
        this.setPixel(catData, center - 3, center - 2, '#2C3E50');
        this.setPixel(catData, center + 3, center - 2, '#2C3E50');
        
        // 鼻
        this.setPixel(catData, center, center + 1, '#E74C3C');
        
        // 口
        this.setPixel(catData, center - 2, center + 3, '#2C3E50');
        this.setPixel(catData, center + 2, center + 3, '#2C3E50');
        
        return catData;
    }

    createRobotAvatar() {
        const robotData = new Array(this.avatarSize * this.avatarSize).fill('transparent');
        const center = Math.floor(this.avatarSize / 2);
        
        // ロボットの頭
        this.drawSquare(robotData, center - 8, center - 8, 16, '#95A5A6');
        
        // 目
        this.drawSquare(robotData, center - 5, center - 3, 2, '#3498DB');
        this.drawSquare(robotData, center + 3, center - 3, 2, '#3498DB');
        
        // 口
        this.drawSquare(robotData, center - 3, center + 2, 6, '#2C3E50');
        
        // アンテナ
        this.setPixel(robotData, center, center - 10, '#E74C3C');
        
        return robotData;
    }

    drawTriangle(data, centerX, centerY, size, color) {
        for (let y = 0; y < size; y++) {
            for (let x = -y; x <= y; x++) {
                this.setPixel(data, centerX + x, centerY + y, color);
            }
        }
    }

    drawSquare(data, startX, startY, size, color) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                this.setPixel(data, startX + x, startY + y, color);
            }
        }
    }

    clearCanvas() {
        this.avatarData = new Array(this.avatarSize * this.avatarSize).fill('transparent');
        this.drawAvatar();
        this.drawMiniAvatar();
    }

    saveAvatar() {
        this.saveAvatarData();
        this.showSuccessMessage('アバターを保存しました！');
        this.closeEditor();
    }

    exportAvatar() {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 128;
        exportCanvas.height = 128;
        const exportCtx = exportCanvas.getContext('2d');
        exportCtx.imageSmoothingEnabled = false;
        
        const pixelSize = 4;
        for (let y = 0; y < this.avatarSize; y++) {
            for (let x = 0; x < this.avatarSize; x++) {
                const color = this.avatarData[y * this.avatarSize + x];
                if (color && color !== 'transparent') {
                    exportCtx.fillStyle = color;
                    exportCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        const link = document.createElement('a');
        link.download = 'hakusan-avatar.png';
        link.href = exportCanvas.toDataURL();
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showSuccessMessage('アバターをエクスポートしました！');
    }

    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'avatar-success-message';
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
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 2000);
    }

    getAvatarDataURL() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        const pixelSize = 2;
        for (let y = 0; y < this.avatarSize; y++) {
            for (let x = 0; x < this.avatarSize; x++) {
                const color = this.avatarData[y * this.avatarSize + x];
                if (color && color !== 'transparent') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        return canvas.toDataURL();
    }
}

// CSS styles for pixel avatar system
const pixelAvatarCSS = `
#pixel-avatar-container {
    position: relative;
}

.avatar-editor {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9998;
    overflow-y: auto;
}

.editor-header {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.close-editor-btn {
    background: #E74C3C;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    cursor: pointer;
}

.editor-content {
    display: flex;
    padding: 2rem;
    gap: 2rem;
    min-height: calc(100vh - 80px);
}

.canvas-container {
    position: relative;
    flex-shrink: 0;
}

#avatar-canvas {
    border: 2px solid #3498DB;
    background: rgba(255, 255, 255, 0.9);
    cursor: crosshair;
}

.canvas-grid {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 256px;
    height: 256px;
    pointer-events: none;
    background-image: 
        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 8px 8px;
}

.editor-tools {
    flex: 1;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.tool-section h4,
.color-section h4,
.preset-section h4 {
    margin: 0 0 1rem 0;
    color: #3498DB;
    border-bottom: 1px solid rgba(52, 152, 219, 0.3);
    padding-bottom: 0.5rem;
}

.tool-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tool-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 0.8rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 50px;
}

.tool-btn:hover,
.tool-btn.active {
    background: rgba(52, 152, 219, 0.3);
    border-color: #3498DB;
}

.color-palette {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.color-swatch {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.color-swatch:hover {
    transform: scale(1.1);
    border-color: white;
}

.current-color {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.color-display {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid white;
}

.preset-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.preset-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.preset-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
}

.action-section {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.save-avatar-btn,
.export-btn {
    background: #2ECC71;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.export-btn {
    background: #3498DB;
}

.save-avatar-btn:hover,
.export-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.avatar-display {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

#mini-avatar-canvas {
    border: 3px solid #3498DB;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

#mini-avatar-canvas:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 20px rgba(52, 152, 219, 0.5);
}

@media (max-width: 768px) {
    .editor-content {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }
    
    #avatar-canvas {
        width: 100%;
        max-width: 300px;
        height: auto;
    }
    
    .canvas-grid {
        width: 100%;
        max-width: 300px;
        height: auto;
        aspect-ratio: 1;
    }
    
    .color-palette {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .tool-buttons {
        justify-content: center;
    }
}
`;

// CSS を動的に追加
if (!document.querySelector('#pixel-avatar-styles')) {
    const style = document.createElement('style');
    style.id = 'pixel-avatar-styles';
    style.textContent = pixelAvatarCSS;
    document.head.appendChild(style);
}

// グローバル関数
function openAvatarEditor() {
    if (!window.pixelAvatarSystem) {
        window.pixelAvatarSystem = new PixelAvatarSystem();
    }
    window.pixelAvatarSystem.openEditor();
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.pixelAvatarSystem = new PixelAvatarSystem();
    
    // ミニアバターにクリックイベントを追加
    const miniCanvas = document.getElementById('mini-avatar-canvas');
    if (miniCanvas) {
        miniCanvas.addEventListener('click', openAvatarEditor);
    }
});
// Town data
const towns = {
    tsurugi: '鶴来',
    mikawa: '美川',
    mattou: '松任',
    kawachi: '河内',
    shiramine: '白峰',
    yoshinodani: '吉野谷',
    torigoe: '鳥越',
    oguchi: '尾口'
};

// PWA Install Variables
let deferredPrompt;
let isInstallPromptAvailable = false;

// PWA Install Event Listeners
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWAインストールプロンプト検出');
    e.preventDefault();
    deferredPrompt = e;
    isInstallPromptAvailable = true;
    showInstallButton();
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWAアプリがインストールされました');
    hideInstallButton();
    deferredPrompt = null;
    isInstallPromptAvailable = false;
});

// PWA Install Functions (optimized with cache)
function showInstallButton() {
    if (domCache.pwaInstallSection) {
        domCache.pwaInstallSection.classList.add('show');
    }
}

function hideInstallButton() {
    if (domCache.pwaInstallSection) {
        domCache.pwaInstallSection.classList.remove('show');
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        console.log('❌ インストールプロンプトが利用できません');
        return;
    }

    try {
        if (domCache.pwaInstallBtn) {
            domCache.pwaInstallBtn.disabled = true;
            domCache.pwaInstallBtn.textContent = 'インストール中...';
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`🔔 ユーザーの選択: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('✅ ユーザーがPWAインストールを承認');
        } else {
            console.log('❌ ユーザーがPWAインストールを拒否');
            if (domCache.pwaInstallBtn) {
                domCache.pwaInstallBtn.disabled = false;
                domCache.pwaInstallBtn.textContent = 'アプリとしてインストール';
            }
        }
        
        deferredPrompt = null;
        isInstallPromptAvailable = false;
    } catch (error) {
        console.error('❌ PWAインストールエラー:', error);
        if (domCache.pwaInstallBtn) {
            domCache.pwaInstallBtn.disabled = false;
            domCache.pwaInstallBtn.textContent = '📱 アプリとしてインストール';
        }
    }
}

// Badge data
const badges = {
    tsurugi: '鶴来バッジ',
    mikawa: '美川バッジ',
    mattou: '松任バッジ',
    kawachi: '河内バッジ',
    shiramine: '白峰バッジ',
    yoshinodani: '吉野谷バッジ',
    torigoe: '鳥越バッジ',
    oguchi: '尾口バッジ'
};

// Cache frequently used DOM elements (optimized for efficiency)
const domCache = {
    // Main UI elements
    stampCount: null,
    progressFill: null,
    completeSection: null,
    gameMap: null,
    zoomLevel: null,
    
    // PWA elements
    pwaInstallSection: null,
    pwaInstallBtn: null,
    
    // Incentive system containers
    shareContainer: null,
    statsContainer: null,
    
    // Map for town cards (populated on init)
    townCards: new Map(),
    stampStatuses: new Map(),
    gymPins: new Map(),
    
    // Notification styles
    confettiStyle: null,
    
    init() {
        // Core UI elements
        this.stampCount = document.getElementById('stampCount');
        this.progressFill = document.getElementById('progressFill');
        this.completeSection = document.getElementById('completeSection');
        this.gameMap = document.getElementById('gameMap');
        this.zoomLevel = document.getElementById('zoomLevel');
        
        // PWA elements
        this.pwaInstallSection = document.getElementById('pwaInstallSection');
        this.pwaInstallBtn = document.getElementById('pwaInstallBtn');
        
        // Incentive system containers
        this.shareContainer = document.querySelector('.share-container');
        this.statsContainer = document.querySelector('.stats-container');
        
        // Cache town-specific elements
        for (const townCode in towns) {
            const townCard = document.querySelector(`[data-town="${townCode}"]`);
            if (townCard) {
                this.townCards.set(townCode, townCard);
            }
            
            const stampStatus = document.getElementById(`stamp-${townCode}`);
            if (stampStatus) {
                this.stampStatuses.set(townCode, stampStatus);
            }
            
            const gymPin = document.getElementById(`gym-${townCode}`);
            if (gymPin) {
                this.gymPins.set(townCode, gymPin);
            }
        }
        
        // Check for confetti style
        this.confettiStyle = document.querySelector('#confetti-style');
    },
    
    // Helper to get town card
    getTownCard(townCode) {
        return this.townCards.get(townCode);
    },
    
    // Helper to get stamp status
    getStampStatus(townCode) {
        return this.stampStatuses.get(townCode);
    },
    
    // Helper to get gym pin
    getGymPin(townCode) {
        return this.gymPins.get(townCode);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM cache
    domCache.init();
    
    updateStampDisplay();
    
    // Check for stamp parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stampParam = urlParams.get('badge');
    
    if (stampParam && towns[stampParam]) {
        // Add stamp to localStorage
        addStamp(stampParam);
        
        // Show notification (only if not already obtained)
        const stamps = getStamps();
        if (stamps.includes(stampParam)) {
            showStampNotification(towns[stampParam], badges[stampParam]);
        }
        
        // Remove badge parameter from URL
        const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newURL}, '', newURL);
    }
    
    // Initialize incentive content when available - single timeout instead of cascade
    setTimeout(() => {
        if (window.incentiveSystem) {
            updateIncentiveContent();
        }
        forceBadgeIconUpdate();
    }, 500);
});

// Get stamps from localStorage
function getStamps() {
    const stamps = localStorage.getItem('hakusan_badges');
    return stamps ? JSON.parse(stamps) : [];
}

// バッジアイコンを確実に更新する専用関数 (optimized with cache)
function forceBadgeIconUpdate() {
    const stamps = getStamps();
    const stampSet = new Set(stamps);
    
    // 全ての町をチェック - use cached elements
    for (const townCode in towns) {
        const townCard = domCache.getTownCard(townCode);
        if (!townCard) continue;
        
        const badgeIcons = townCard.querySelectorAll('.badge-icon');
        const isObtained = stampSet.has(townCode);
        const imageUrl = regionBadgeImages[townCode] || 'images/badges/default-badge.svg';
        
        badgeIcons.forEach(badgeIcon => {
            badgeIcon.innerHTML = isObtained
                ? `<img src="${imageUrl}" alt="${townCode} badge" style="width: 100%; height: 100%; object-fit: contain;">`
                : '<span style="font-size: 2rem; color: #bdc3c7;">？</span>';
        });
    }
}

// Add stamp to localStorage (optimized)
function addStamp(townCode) {
    const stamps = getStamps();
    if (stamps.includes(townCode)) return false;
    
    stamps.push(townCode);
    localStorage.setItem('hakusan_badges', JSON.stringify(stamps));
    
    // Get town and badge information
    const townData = towns[townCode];
    const badgeName = badges[townCode] || townData || townCode;
    
    // Fire incentive system event
    if (window.incentiveSystem) {
        window.incentiveSystem.onBadgeAcquired(townCode, badgeName);
    }
    
    // Dispatch custom event for other systems
    window.dispatchEvent(new CustomEvent('badgeAcquired', {
        detail: { gymId: townCode, badgeName: badgeName }
    }));
    
    updateStampDisplay();
    showStampNotification(badgeName, `${badgeName}バッジ`);
    
    // Single delayed update instead of cascade
    setTimeout(forceBadgeIconUpdate, 200);
    
    return true;
}

// Badge image mapping - defined once to avoid recreation
const regionBadgeImages = {
    'tsurugi': 'images/badges/tsurugi.png',
    'mikawa': 'images/badges/mikawa.png',
    'mattou': 'images/badges/mattou.png',
    'kawachi': 'images/badges/kawachi.png',
    'shiramine': 'images/badges/shiramine.png',
    'yoshinodani': 'images/badges/yoshinodani.png',
    'torigoe': 'images/badges/torigoe.png',
    'oguchi': 'images/badges/oguchi.png'
};

// Update stamp display (optimized version)
function updateStampDisplay() {
    const stamps = getStamps();
    const stampCount = stamps.length;
    const totalStamps = Object.keys(towns).length;
    
    // Update counter using cached element
    if (domCache.stampCount) {
        domCache.stampCount.textContent = `${stampCount}/${totalStamps} バッジ獲得`;
    }
    
    // Update progress bar using cached element
    if (domCache.progressFill) {
        const progressPercent = (stampCount / totalStamps) * 100;
        domCache.progressFill.style.width = `${progressPercent}%`;
    }
    
    // Create stamp set for O(1) lookup instead of O(n) includes()
    const stampSet = new Set(stamps);
    
    // Update town cards - optimized with cache
    for (const townCode in towns) {
        const townCard = domCache.getTownCard(townCode);
        if (!townCard) continue;
        
        const stampStatus = domCache.getStampStatus(townCode);
        const badgeIcon = townCard.querySelector('.badge-icon');
        const isCompleted = stampSet.has(townCode);
        
        // Update card status
        townCard.classList.toggle('completed', isCompleted);
        
        if (stampStatus) {
            stampStatus.textContent = isCompleted ? '✅ 獲得済み' : '未取得';
            stampStatus.classList.toggle('obtained', isCompleted);
        }
        
        // Update badge icon
        if (badgeIcon) {
            const badgeImage = regionBadgeImages[townCode];
            if (isCompleted && badgeImage) {
                badgeIcon.innerHTML = `<img src="${badgeImage}" alt="${towns[townCode]}バッジ" class="badge-img obtained">`;
            } else {
                badgeIcon.innerHTML = `<img src="images/badges/unknown.png" alt="未取得バッジ" class="badge-img unknown">`;
            }
        }
    }
    
    // Update gym pins on map - optimized
    updateGymPins(stampSet);
    
    // Show complete section if all stamps collected
    if (domCache.completeSection) {
        if (stampCount === totalStamps) {
            domCache.completeSection.style.display = 'block';
            showCompletionCelebration();
        } else {
            domCache.completeSection.style.display = 'none';
        }
    }
}

// Badge rarities - defined once
const badgeRarities = {
    'oguchi': 'rare',
    'kawachi': 'uncommon',
    'mattou': 'common',
    'mikawa': 'uncommon',
    'shiramine': 'legendary',
    'torigoe': 'rare',
    'tsurugi': 'uncommon',
    'yoshinodani': 'rare'
};

const rarityIcons = {
    'legendary': '🐉',
    'rare': '💎',
    'uncommon': '🌟',
    'common': '⭐'
};

const gymIcons = {
    'oguchi': '🧚‍♀️',
    'kawachi': '🌊',
    'mattou': '⭐',
    'mikawa': '🌍',
    'shiramine': '❄️',
    'torigoe': '🌿',
    'tsurugi': '⚔️',
    'yoshinodani': '💧'
};

// Separated gym pins update for better performance (with cache)
function updateGymPins(stampSet) {
    for (const townCode in towns) {
        const gymPin = domCache.getGymPin(townCode);
        if (!gymPin) continue;
        
        const isCompleted = stampSet.has(townCode);
        const rarity = badgeRarities[townCode];
        
        if (isCompleted) {
            gymPin.classList.add('completed', 'badge-rarity', rarity);
            
            // Add rarity indicator if not exists
            if (!gymPin.querySelector('.rarity-indicator')) {
                const rarityIndicator = document.createElement('div');
                rarityIndicator.className = `rarity-indicator ${rarity}`;
                rarityIndicator.textContent = rarityIcons[rarity];
                gymPin.appendChild(rarityIndicator);
            }
            
            // Update badge appearance
            const badgeElement = gymPin.querySelector('.gym-badge');
            if (badgeElement) {
                badgeElement.textContent = gymIcons[townCode];
                badgeElement.classList.add('premium-badge');
            }
        } else {
            gymPin.classList.remove('completed', 'badge-rarity', 'legendary', 'rare', 'uncommon', 'common');
            
            // Remove rarity indicator
            const rarityIndicator = gymPin.querySelector('.rarity-indicator');
            if (rarityIndicator) rarityIndicator.remove();
            
            // Reset badge to unknown/locked state
            const badgeElement = gymPin.querySelector('.gym-badge');
            if (badgeElement) {
                badgeElement.textContent = '？';
                badgeElement.classList.remove('premium-badge');
            }
        }
    }
}

// Show stamp notification
function showStampNotification(townName, badgeName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'stamp-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>� バッジ獲得！</h3>
            <p>${townName}ジムで<br><strong>${badgeName}</strong>を獲得しました！</p>
            <button onclick="closeNotification()">OK</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .notification-content h3 {
            color: #2ecc71;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .notification-content p {
            margin-bottom: 1.5rem;
            color: #333;
        }
        
        .notification-content button {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .notification-content button:hover {
            background: #27ae60;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification();
        }
    }, 5000);
}

// Close notification (with cache optimization)
function closeNotification() {
    const notification = document.querySelector('.stamp-notification');
    if (notification) {
        notification.remove();
    }
}

// Show completion celebration
function showCompletionCelebration() {
    // Create confetti effect
    createConfetti();
    
    // Play celebration sound (if available)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+');
        audio.play();
    } catch (e) {
        // Ignore audio errors
    }
}

// Create confetti effect (optimized)
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    const confettiCount = 50;
    const staggerDelay = 100; // ms between each confetti appearance
    const animationDuration = 3000; // ms
    const fragment = document.createDocumentFragment();
    const confettiElements = [];
    
    // Create all confetti elements at once using DocumentFragment
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            z-index: 1001;
            border-radius: 50%;
            animation: confettiFall ${animationDuration}ms ease-in-out forwards;
            animation-delay: ${i * staggerDelay}ms;
        `;
        confettiElements.push(confetti);
        fragment.appendChild(confetti);
    }
    
    // Single DOM append operation
    document.body.appendChild(fragment);
    
    // Single cleanup timeout instead of many
    setTimeout(() => {
        confettiElements.forEach(el => el.remove());
    }, animationDuration + (confettiCount * staggerDelay));
    
    // Add confetti animation style once (check cache first)
    if (!domCache.confettiStyle) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        domCache.confettiStyle = style;
    }
}

// Visit town function
function visitTown(townCode) {
    const townUrl = `town/${townCode}.html`;
    window.location.href = townUrl;
}

// Show special content
function showSpecialContent() {
    const specialContent = `
        <div class="special-content-modal">
            <div class="special-content">
                <h2>🏆 おめでとうございます！ 🏆</h2>
                <p>白山市旧8市町村すべてのスタンプを集めました！</p>                <div class="completion-badge">
                    <div class="badge-content">
                        <h3>🌟 はくさんマスター 🌟</h3>
                        <p>白山市完全制覇証明書</p>
                        <small>完了日：${new Date().toLocaleDateString('ja-JP')}</small>
                    </div>
                </div>
                <p>あなたは白山市の魅力を余すことなく体験しました。<br>
                この素晴らしい経験を友人や家族とシェアしてください！</p>
                <div class="share-buttons">
                    <button onclick="shareCompletion()">🎉 シェアする</button>
                    <button onclick="resetStamps()">🔄 最初から始める</button>
                </div>
                <button onclick="closeSpecialContent()">閉じる</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = specialContent;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1002;
        animation: fadeIn 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .special-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            margin: 1rem;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            animation: slideInUp 0.5s ease;
        }
        
        .special-content h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .completion-badge {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .badge-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .share-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 1.5rem 0;
            flex-wrap: wrap;
        }
        
        .share-buttons button {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        
        .share-buttons button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .special-content > button {
            background: white;
            color: #667eea;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .special-content > button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        @keyframes slideInUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Close special content
function closeSpecialContent() {
    const modal = document.querySelector('.special-content-modal');
    if (modal) {
        modal.closest('div').remove();
    }
}

// Share completion
function shareCompletion() {
    const shareText = 'ハクサンリーグ・旧市町村ジムバッジで全8つのバッジを集めました！�';
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'ハクサンリーグチャンピオン完全制覇！',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `${shareText}\n${shareUrl}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('シェア用テキストをクリップボードにコピーしました！');
            });
        } else {
            alert(`シェア用テキスト：\n${text}`);
        }
    }
}

// Reset stamps (for testing or restart)
function resetStamps() {
    if (confirm('本当にバッジをリセットしますか？この操作は取り消せません。')) {
        localStorage.removeItem('hakusan_badges');
        updateStampDisplay();
        closeSpecialContent();
        alert('バッジをリセットしました。新しい冒険を始めましょう！');
    }
}

// Debug function (remove in production)
function debugAddAllStamps() {
    Object.keys(towns).forEach(townCode => {
        addStamp(townCode);
    });
}

// Add click handlers for map towns
document.addEventListener('click', function(e) {
    if (e.target.closest('.map-town')) {
        const townCode = e.target.closest('.map-town').getAttribute('data-town');
        if (townCode) {
            visitTown(townCode);
        }
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNotification();
        closeSpecialContent();
    }
});

// Service worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Update incentive content containers (optimized with cache)
function updateIncentiveContent() {
    if (!window.incentiveSystem) return;
    
    // Update share section - use cached element
    if (domCache.shareContainer) {
        domCache.shareContainer.innerHTML = window.incentiveSystem.createShareSection();
    }
    
    // Update stats dashboard - use cached element
    if (domCache.statsContainer) {
        domCache.statsContainer.innerHTML = window.incentiveSystem.createStatsSection();
    }
    
    // Update secret content visibility
    window.incentiveSystem.updateSecretContentDisplay();
}

// Export function for use by incentive system
window.updateIncentiveContent = updateIncentiveContent;

// Map zoom and pan functionality
let currentZoom = 1;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let mapX = 0;
let mapY = 0;

// Initialize map controls (optimized with cache)
document.addEventListener('DOMContentLoaded', function() {
    if (domCache.gameMap) {
        // Mouse wheel zoom
        domCache.gameMap.addEventListener('wheel', function(e) {
            e.preventDefault();
            const rect = domCache.gameMap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (e.deltaY < 0) {
                zoomAtPoint(x, y, 1.2);
            } else {
                zoomAtPoint(x, y, 0.8);
            }
        });
        
        // Mouse drag to pan
        domCache.gameMap.addEventListener('mousedown', function(e) {
            if (currentZoom > 1) {
                isDragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                domCache.gameMap.classList.add('dragging');
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                mapX += deltaX;
                mapY += deltaY;
                
                // Constrain pan within reasonable bounds
                const maxPan = 200 * currentZoom;
                mapX = Math.max(-maxPan, Math.min(maxPan, mapX));
                mapY = Math.max(-maxPan, Math.min(maxPan, mapY));
                
                updateMapTransform();
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            domCache.gameMap.classList.remove('dragging');
        });
        
        // Touch support for mobile
        domCache.gameMap.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1 && currentZoom > 1) {
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
                domCache.gameMap.classList.add('dragging');
            }
        });
        
        domCache.gameMap.addEventListener('touchmove', function(e) {
            if (isDragging && e.touches.length === 1) {
                e.preventDefault();
                const deltaX = e.touches[0].clientX - lastX;
                const deltaY = e.touches[0].clientY - lastY;
                mapX += deltaX;
                mapY += deltaY;
                
                const maxPan = 200 * currentZoom;
                mapX = Math.max(-maxPan, Math.min(maxPan, mapX));
                mapY = Math.max(-maxPan, Math.min(maxPan, mapY));
                
                updateMapTransform();
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        });
        
        domCache.gameMap.addEventListener('touchend', function() {
            isDragging = false;
            domCache.gameMap.classList.remove('dragging');
        });
    }
});

function zoomIn() {
    if (currentZoom < 3) {
        currentZoom = Math.min(3, currentZoom * 1.25);
        updateMapTransform();
        updateZoomDisplay();
    }
}

function zoomOut() {
    if (currentZoom > 0.5) {
        currentZoom = Math.max(0.5, currentZoom / 1.25);
        updateMapTransform();
        updateZoomDisplay();
        
        // Reset pan when zooming out to fit
        if (currentZoom <= 1) {
            mapX = 0;
            mapY = 0;
        }
    }
}

function resetZoom() {
    currentZoom = 1;
    mapX = 0;
    mapY = 0;
    updateMapTransform();
    updateZoomDisplay();
}

function zoomAtPoint(x, y, factor) {
    if (!domCache.gameMap) return;
    
    const rect = domCache.gameMap.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate offset from center
    const offsetX = x - centerX;
    const offsetY = y - centerY;
    
    const newZoom = Math.max(0.5, Math.min(3, currentZoom * factor));
    const zoomChange = newZoom / currentZoom;
    
    // Adjust pan to zoom towards the cursor position
    mapX -= offsetX * (zoomChange - 1);
    mapY -= offsetY * (zoomChange - 1);
    
    currentZoom = newZoom;
    
    // Constrain pan
    const maxPan = 200 * currentZoom;
    mapX = Math.max(-maxPan, Math.min(maxPan, mapX));
    mapY = Math.max(-maxPan, Math.min(maxPan, mapY));
    
    updateMapTransform();
    updateZoomDisplay();
}

function updateMapTransform() {
    if (domCache.gameMap) {
        domCache.gameMap.style.transform = `scale(${currentZoom}) translate(${mapX/currentZoom}px, ${mapY/currentZoom}px)`;
    }
}

function updateZoomDisplay() {
    if (domCache.zoomLevel) {
        domCache.zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
    }
}

// デバッグ用：バッジをリセットする関数（コンソールから実行可能）
window.resetAllBadges = function() {
    localStorage.removeItem('hakusan_badges');
    updateStampDisplay();
    console.log('All badges have been reset');
};

// デバッグ用：確認ダイアログ付きリセット関数（ボタンから実行）
function resetAllBadgesWithConfirm() {
    const confirmReset = confirm('本当に全てのバッジをリセットしますか？\n\nこの操作は取り消すことができません。');
    
    if (confirmReset) {
        localStorage.removeItem('hakusan_badges');
        updateStampDisplay();
        alert('全てのバッジがリセットされました。');
        
        // ページをリロードして完全にリセット
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// デバッグ用：特定のバッジをテスト追加
function testBadgeUpdate(townCode) {
    console.log(`Testing badge update for: ${townCode}`);
    addStamp(townCode);
    console.log('Current badges:', getStamps());
}

// デバッグ用：現在の状態をチェック
function checkBadgeState() {
    const stamps = getStamps();
    console.log('Current badges:', stamps);
    
    Object.keys(towns).forEach(townCode => {
        const townCard = document.querySelector(`[data-town="${townCode}"]`);
        const badgeIcon = townCard ? townCard.querySelector('.badge-icon') : null;
        
        console.log(`${townCode}: card=${!!townCard}, icon=${!!badgeIcon}, content="${badgeIcon?.textContent}", obtained=${stamps.includes(townCode)}`);
    });
}

// PWA Install Button Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // PWAインストールボタンのイベントリスナー
    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
        installBtn.addEventListener('click', installPWA);
    }
    
    // PWAがすでにインストールされているかチェック
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log('✅ PWAはすでにインストールされています');
        hideInstallButton();
    }
});

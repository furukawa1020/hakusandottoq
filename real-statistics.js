// 実統計システム（アクセス制限付き）
class RealStatisticsSystem {
    constructor() {
        // 統計ページ以外では詳細統計を無効化
        this.isStatsPage = window.location.pathname.includes('stats.html') || 
                          window.location.search.includes('stats=true');
        
        this.startTime = Date.now();
        this.sessionData = {
            sessionStart: this.startTime,
            badgeCollections: 0,
            buttonClicks: 0,
            pageViews: 0,
            timeSpent: 0,
            featuresUsed: new Set(),
            locations: new Set(),
            achievements: new Set()
        };
        
        this.totalStats = this.loadTotalStats();
        this.init();
    }

    init() {
        this.setupEventTracking();
        this.startTimeTracking();
        this.trackPageView();
        this.setupPeriodicSave();
    }

    loadTotalStats() {
        const saved = localStorage.getItem('hakusan_total_stats');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            totalSessions: 0,
            totalBadges: 0,
            totalClicks: 0,
            totalTimeSpent: 0,
            firstVisit: Date.now(),
            lastVisit: Date.now(),
            featuresUsed: {},
            locationVisits: {},
            achievementsUnlocked: {},
            photosTaken: 0,
            averageSessionTime: 0,
            returnVisitor: false
        };
    }

    saveTotalStats() {
        localStorage.setItem('hakusan_total_stats', JSON.stringify(this.totalStats));
    }

    setupEventTracking() {
        // ボタンクリックを追跡
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('clickable')) {
                this.trackClick(e.target);
            }
        });

        // バッジ取得を追跡
        window.addEventListener('badgeCollected', (e) => {
            this.trackBadgeCollection(e.detail.badgeId);
        });

        // 機能使用を追跡
        window.addEventListener('featureUsed', (e) => {
            this.trackFeatureUsage(e.detail.feature);
        });

        // 写真撮影を追跡
        window.addEventListener('photoTaken', () => {
            this.trackPhotoTaken();
        });
    }

    trackClick(element) {
        this.sessionData.buttonClicks++;
        this.totalStats.totalClicks++;
        
        // 要素の種類を記録
        const elementType = element.className || element.id || 'unknown';
        if (!this.totalStats.featuresUsed[elementType]) {
            this.totalStats.featuresUsed[elementType] = 0;
        }
        this.totalStats.featuresUsed[elementType]++;
    }

    trackBadgeCollection(badgeId) {
        this.sessionData.badgeCollections++;
        this.sessionData.locations.add(badgeId);
        this.totalStats.totalBadges++;
        
        if (!this.totalStats.locationVisits[badgeId]) {
            this.totalStats.locationVisits[badgeId] = 0;
        }
        this.totalStats.locationVisits[badgeId]++;
        
        // バッジ取得イベントをディスパッチ
        this.dispatchCustomEvent('badgeCollected', { badgeId });
        
        // 実績チェック
        this.checkAchievements();
    }

    trackFeatureUsage(feature) {
        this.sessionData.featuresUsed.add(feature);
        
        if (!this.totalStats.featuresUsed[feature]) {
            this.totalStats.featuresUsed[feature] = 0;
        }
        this.totalStats.featuresUsed[feature]++;
    }

    trackPhotoTaken() {
        this.totalStats.photosTaken++;
        this.trackFeatureUsage('ar_photo');
    }

    trackPageView() {
        this.sessionData.pageViews++;
        this.totalStats.lastVisit = Date.now();
    }

    startTimeTracking() {
        this.timeInterval = setInterval(() => {
            this.sessionData.timeSpent = Date.now() - this.sessionData.sessionStart;
        }, 1000);
    }

    setupPeriodicSave() {
        // 30秒ごとに統計を保存
        setInterval(() => {
            this.saveStats();
        }, 30000);

        // ページ離脱時に保存
        window.addEventListener('beforeunload', () => {
            this.saveStats();
        });
    }

    saveStats() {
        this.updateTotalStats();
        this.saveTotalStats();
    }

    updateTotalStats() {
        // セッション統計を総合統計に反映
        this.totalStats.totalSessions++;
        this.totalStats.totalTimeSpent += this.sessionData.timeSpent;
        this.totalStats.averageSessionTime = this.totalStats.totalTimeSpent / this.totalStats.totalSessions;
        this.totalStats.returnVisitor = this.totalStats.totalSessions > 1;
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'first_badge',
                name: '初めてのバッジ',
                condition: () => this.totalStats.totalBadges >= 1,
                description: '最初のバッジを取得した'
            },
            {
                id: 'collector',
                name: 'コレクター',
                condition: () => this.totalStats.totalBadges >= 5,
                description: '5つのバッジを取得した'
            },
            {
                id: 'master_collector',
                name: 'マスターコレクター',
                condition: () => this.totalStats.totalBadges >= 8,
                description: '全てのバッジを取得した'
            },
            {
                id: 'explorer',
                name: '探検家',
                condition: () => Object.keys(this.totalStats.locationVisits).length >= 3,
                description: '3つの異なる地域を訪問した'
            },
            {
                id: 'photographer',
                name: 'フォトグラファー',
                condition: () => this.totalStats.photosTaken >= 1,
                description: 'AR写真を撮影した'
            },
            {
                id: 'regular_visitor',
                name: '常連さん',
                condition: () => this.totalStats.totalSessions >= 5,
                description: '5回以上アクセスした'
            },
            {
                id: 'time_master',
                name: 'タイムマスター',
                condition: () => this.totalStats.totalTimeSpent >= 30 * 60 * 1000, // 30分
                description: '合計30分以上利用した'
            }
        ];

        achievements.forEach(achievement => {
            if (!this.totalStats.achievementsUnlocked[achievement.id] && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.totalStats.achievementsUnlocked[achievement.id] = {
            ...achievement,
            unlockedAt: Date.now()
        };
        
        this.sessionData.achievements.add(achievement.id);
        
        // 実績解除通知
        this.showAchievementNotification(achievement);
        
        // カスタムイベントをディスパッチ
        this.dispatchCustomEvent('achievementUnlocked', achievement);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">トロフィー</div>
                <div class="achievement-text">
                    <h4>実績解除！</h4>
                    <p><strong>${achievement.name}</strong></p>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #333;
            padding: 1rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 4.5s;
            border: 2px solid #FFD700;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }

    getSessionStats() {
        return {
            ...this.sessionData,
            timeSpent: Date.now() - this.sessionData.sessionStart,
            featuresUsed: Array.from(this.sessionData.featuresUsed),
            locations: Array.from(this.sessionData.locations),
            achievements: Array.from(this.sessionData.achievements)
        };
    }

    getTotalStats() {
        return {
            ...this.totalStats,
            currentSessionTime: Date.now() - this.sessionData.sessionStart
        };
    }

    generateStatsDisplay() {
        const stats = this.getTotalStats();
        const sessionStats = this.getSessionStats();
        
        return `
            <div class="real-stats-display">
                <div class="stats-header">
                    <h3>リアル統計データ</h3>
                    <p class="stats-note">※実際の利用データに基づく統計です</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">ターゲット</div>
                        <div class="stat-content">
                            <h4>総セッション数</h4>
                            <p class="stat-value">${stats.totalSessions}回</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">バッジ</div>
                        <div class="stat-content">
                            <h4>取得バッジ数</h4>
                            <p class="stat-value">${stats.totalBadges}個</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-content">
                            <h4>総利用時間</h4>
                            <p class="stat-value">${this.formatTime(stats.totalTimeSpent)}</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">📸</div>
                        <div class="stat-content">
                            <h4>撮影写真数</h4>
                            <p class="stat-value">${stats.photosTaken}枚</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">トロフィー</div>
                        <div class="stat-content">
                            <h4>解除実績数</h4>
                            <p class="stat-value">${Object.keys(stats.achievementsUnlocked).length}個</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-content">
                            <h4>平均セッション時間</h4>
                            <p class="stat-value">${this.formatTime(stats.averageSessionTime)}</p>
                        </div>
                    </div>
                </div>
                
                <div class="current-session">
                    <h4>🕒 現在のセッション</h4>
                    <div class="session-stats">
                        <span>継続時間: ${this.formatTime(sessionStats.timeSpent)}</span>
                        <span>バッジ取得: ${sessionStats.badgeCollections}個</span>
                        <span>クリック数: ${sessionStats.buttonClicks}回</span>
                        <span>利用機能: ${sessionStats.featuresUsed.length}種類</span>
                    </div>
                </div>
                
                <div class="location-breakdown">
                    <h4>地域別訪問統計</h4>
                    <div class="location-stats">
                        ${Object.entries(stats.locationVisits).map(([location, count]) => `
                            <div class="location-stat">
                                <span class="location-name">${this.getLocationName(location)}</span>
                                <span class="location-count">${count}回</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="achievements-list">
                    <h4>解除済み実績</h4>
                    <div class="achievements">
                        ${Object.values(stats.achievementsUnlocked).map(achievement => `
                            <div class="achievement-item">
                                <span class="achievement-name">${achievement.name}</span>
                                <span class="achievement-date">${new Date(achievement.unlockedAt).toLocaleDateString('ja-JP')}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getLocationName(locationId) {
        const names = {
            tsurugi: '鶴来',
            mikawa: '美川',
            mattou: '松任',
            kawachi: '河内',
            shiramine: '白峰',
            yoshinodani: '吉野谷',
            torigoe: '鳥越',
            oguchi: '尾口'
        };
        return names[locationId] || locationId;
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}時間${minutes % 60}分`;
        } else if (minutes > 0) {
            return `${minutes}分${seconds % 60}秒`;
        } else {
            return `${seconds}秒`;
        }
    }

    getAllStats() {
        return {
            totalVisits: this.totalStats.totalSessions || 0,
            totalBadges: this.totalStats.badgeCollections || 0,
            activeDays: Object.keys(this.totalStats.dailyStats || {}).length,
            averageSessionTime: this.totalStats.totalTimeSpent || 0,
            regionVisits: this.totalStats.locationVisits || {},
            rarityDistribution: this.totalStats.rarityStats || {},
            photosTaken: this.totalStats.photosTaken || 0,
            featuresUsed: Array.from(this.totalStats.featuresUsed || [])
        };
    }

    exportStats() {
        const stats = {
            total: this.getTotalStats(),
            session: this.getSessionStats(),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hakusan-stats-${new Date().toLocaleDateString('ja-JP')}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    resetStats() {
        if (confirm('統計データをリセットしますか？この操作は取り消せません。')) {
            localStorage.removeItem('hakusan_total_stats');
            this.totalStats = this.loadTotalStats();
            alert('統計データをリセットしました。');
        }
    }
}

// CSS styles for real statistics
const realStatsCSS = `
.real-stats-display {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    margin: 2rem 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stats-header {
    text-align: center;
    margin-bottom: 2rem;
}

.stats-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
}

.stats-note {
    opacity: 0.8;
    font-size: 0.9rem;
    margin: 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.stat-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    opacity: 0.9;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
    color: #FFD700;
}

.current-session {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.current-session h4 {
    margin: 0 0 1rem 0;
    color: #FFD700;
}

.session-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.session-stats span {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.location-breakdown,
.achievements-list {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 1rem;
}

.location-breakdown h4,
.achievements-list h4 {
    margin: 0 0 1rem 0;
    color: #FFD700;
}

.location-stats,
.achievements {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.location-stat,
.achievement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.location-count,
.achievement-date {
    font-weight: bold;
    color: #FFD700;
}

.achievement-notification {
    font-family: 'Noto Sans JP', sans-serif;
}

.achievement-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.achievement-icon {
    font-size: 2rem;
}

.achievement-text h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.achievement-text p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .stat-card {
        padding: 1rem;
    }
    
    .stat-icon {
        font-size: 2rem;
    }
    
    .stat-value {
        font-size: 1.4rem;
    }
    
    .session-stats {
        flex-direction: column;
    }
    
    .location-stat,
    .achievement-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
}
`;

// CSS を動的に追加
if (!document.querySelector('#real-stats-styles')) {
    const style = document.createElement('style');
    style.id = 'real-stats-styles';
    style.textContent = realStatsCSS;
    document.head.appendChild(style);
}

// グローバル関数
function trackBadgeCollection(badgeId) {
    if (window.realStatsSystem) {
        window.realStatsSystem.trackBadgeCollection(badgeId);
    }
}

function trackFeatureUsage(feature) {
    if (window.realStatsSystem) {
        window.realStatsSystem.trackFeatureUsage(feature);
    }
}

function showRealStats() {
    // 統計ページでのみ利用可能
    const isStatsPage = window.location.pathname.includes('stats.html') || 
                        window.location.search.includes('stats=true');
    
    if (!isStatsPage) {
        console.log('詳細統計データは stats.html でのみ利用可能です');
        return false;
    }
    
    if (!window.realStatsSystem) {
        window.realStatsSystem = new RealStatisticsSystem();
    }
    
    const statsHTML = window.realStatsSystem.generateStatsDisplay();
    
    // 統計表示用のモーダルを作成
    const modal = document.createElement('div');
    modal.className = 'stats-modal';
    modal.innerHTML = `
        <div class="stats-modal-content">
            ${statsHTML}
            <div class="stats-actions">
                <button onclick="window.realStatsSystem.exportStats()" class="export-stats-btn">
                    データエクスポート
                </button>
                <button onclick="window.realStatsSystem.resetStats()" class="reset-stats-btn">
                    🗑️ データリセット
                </button>
                <button onclick="closeStatsModal()" class="close-stats-btn">
                    ✕ 閉じる
                </button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        overflow-y: auto;
        padding: 1rem;
    `;
    
    document.body.appendChild(modal);
}

function closeStatsModal() {
    const modal = document.querySelector('.stats-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.realStatsSystem = new RealStatisticsSystem();
});

// モーダル用の追加CSS
const statsModalCSS = `
.stats-modal-content {
    max-width: 800px;
    margin: 2rem auto;
    position: relative;
}

.stats-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.stats-actions button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    padding: 0.8rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.export-stats-btn {
    border-color: #2ECC71;
    color: #2ECC71;
}

.reset-stats-btn {
    border-color: #E74C3C;
    color: #E74C3C;
}

.close-stats-btn {
    border-color: #95A5A6;
    color: #95A5A6;
}

.stats-actions button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .stats-actions {
        flex-direction: column;
    }
    
    .stats-actions button {
        width: 100%;
    }
}
`;

// 追加CSSを挿入
if (!document.querySelector('#stats-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'stats-modal-styles';
    style.textContent = statsModalCSS;
    document.head.appendChild(style);
}
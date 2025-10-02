// サーバーレス分析システム（研究用）
class HakusanAnalyticsSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.analytics = {
            sessions: [],
            events: [],
            userBehavior: {},
            regionData: {},
            badgeProgress: {},
            gameMetrics: {},
            userProfiles: []
        };
        
        this.eventTypes = {
            SESSION_START: 'session_start',
            SESSION_END: 'session_end',
            REGION_VISIT: 'region_visit',
            BADGE_COLLECTION: 'badge_collection',
            PHOTO_CAPTURE: 'photo_capture',
            AVATAR_CUSTOMIZATION: 'avatar_customization',
            MAP_INTERACTION: 'map_interaction',
            CAMERA_USAGE: 'camera_usage',
            FEATURE_USAGE: 'feature_usage',
            ERROR_OCCURRENCE: 'error_occurrence',
            PERFORMANCE_METRIC: 'performance_metric'
        };
        
        this.settings = {
            enableAnalytics: true,
            dataRetentionDays: 30,
            maxEventsPerSession: 1000,
            enableUserProfiles: true,
            enablePerformanceTracking: true,
            enableErrorTracking: true
        };
        
        this.init();
    }
    
    init() {
        this.loadStoredData();
        this.startSession();
        this.setupEventListeners();
        this.setupPerformanceMonitoring();
        this.cleanOldData();
        
        console.log('📊 分析システム初期化完了 - セッション:', this.sessionId);
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    startSession() {
        const sessionData = {
            id: this.sessionId,
            startTime: this.startTime,
            endTime: null,
            duration: 0,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: navigator.platform,
            isOnline: navigator.onLine,
            eventCount: 0,
            regions: [],
            badges: [],
            photos: 0,
            avatarChanges: 0,
            errors: []
        };
        
        this.analytics.sessions.push(sessionData);
        this.recordEvent(this.eventTypes.SESSION_START, { sessionData });
        
        // セッション情報を定期的に更新
        this.sessionUpdateInterval = setInterval(() => {
            this.updateCurrentSession();
        }, 60000); // 1分ごと
    }
    
    updateCurrentSession() {
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.duration = Date.now() - currentSession.startTime;
            currentSession.viewport = `${window.innerWidth}x${window.innerHeight}`;
            currentSession.isOnline = navigator.onLine;
            this.saveData();
        }
    }
    
    endSession() {
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.endTime = Date.now();
            currentSession.duration = currentSession.endTime - currentSession.startTime;
            
            this.recordEvent(this.eventTypes.SESSION_END, {
                sessionDuration: currentSession.duration,
                eventCount: currentSession.eventCount
            });
            
            if (this.sessionUpdateInterval) {
                clearInterval(this.sessionUpdateInterval);
            }
        }
        
        this.saveData();
    }
    
    getCurrentSession() {
        return this.analytics.sessions.find(session => session.id === this.sessionId);
    }
    
    recordEvent(eventType, data = {}, metadata = {}) {
        if (!this.settings.enableAnalytics) return;
        
        const event = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            type: eventType,
            timestamp: Date.now(),
            data: { ...data },
            metadata: {
                url: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                ...metadata
            }
        };
        
        this.analytics.events.push(event);
        
        // セッション情報を更新
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.eventCount++;
            
            if (currentSession.eventCount >= this.settings.maxEventsPerSession) {
                console.warn('⚠️ セッションの最大イベント数に達しました');
            }
        }
        
        // リアルタイム処理
        this.processEventRealtime(event);
        
        // 定期保存
        if (this.analytics.events.length % 10 === 0) {
            this.saveData();
        }
        
        console.log('📊 イベント記録:', eventType, data);
    }
    
    processEventRealtime(event) {
        // イベントタイプ別の処理
        switch (event.type) {
            case this.eventTypes.REGION_VISIT:
                this.updateRegionMetrics(event.data);
                break;
            case this.eventTypes.BADGE_COLLECTION:
                this.updateBadgeMetrics(event.data);
                break;
            case this.eventTypes.PHOTO_CAPTURE:
                this.updatePhotoMetrics(event.data);
                break;
            case this.eventTypes.AVATAR_CUSTOMIZATION:
                this.updateAvatarMetrics(event.data);
                break;
            case this.eventTypes.ERROR_OCCURRENCE:
                this.updateErrorMetrics(event.data);
                break;
        }
        
        // ユーザー行動パターン分析
        this.analyzeUserBehavior(event);
    }
    
    updateRegionMetrics(data) {
        const regionId = data.regionId;
        if (!this.analytics.regionData[regionId]) {
            this.analytics.regionData[regionId] = {
                visits: 0,
                totalTime: 0,
                badges: 0,
                photos: 0,
                firstVisit: Date.now(),
                lastVisit: Date.now()
            };
        }
        
        this.analytics.regionData[regionId].visits++;
        this.analytics.regionData[regionId].lastVisit = Date.now();
        
        // セッション情報に追加
        const currentSession = this.getCurrentSession();
        if (currentSession && !currentSession.regions.includes(regionId)) {
            currentSession.regions.push(regionId);
        }
    }
    
    updateBadgeMetrics(data) {
        const { regionId, rarity } = data;
        
        if (!this.analytics.badgeProgress[regionId]) {
            this.analytics.badgeProgress[regionId] = {
                common: 0,
                uncommon: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            };
        }
        
        this.analytics.badgeProgress[regionId][rarity]++;
        
        if (this.analytics.regionData[regionId]) {
            this.analytics.regionData[regionId].badges++;
        }
        
        // セッション情報に追加
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.badges.push({ regionId, rarity, timestamp: Date.now() });
        }
    }
    
    updatePhotoMetrics(data) {
        const regionId = data.regionId;
        
        if (this.analytics.regionData[regionId]) {
            this.analytics.regionData[regionId].photos++;
        }
        
        // セッション情報に追加
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.photos++;
        }
    }
    
    updateAvatarMetrics(data) {
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.avatarChanges++;
        }
    }
    
    updateErrorMetrics(data) {
        const currentSession = this.getCurrentSession();
        if (currentSession) {
            currentSession.errors.push({
                error: data.error,
                timestamp: Date.now(),
                context: data.context
            });
        }
    }
    
    analyzeUserBehavior(event) {
        const hour = new Date(event.timestamp).getHours();
        const dayOfWeek = new Date(event.timestamp).getDay();
        
        if (!this.analytics.userBehavior.timePatterns) {
            this.analytics.userBehavior.timePatterns = {
                hourly: new Array(24).fill(0),
                daily: new Array(7).fill(0)
            };
        }
        
        this.analytics.userBehavior.timePatterns.hourly[hour]++;
        this.analytics.userBehavior.timePatterns.daily[dayOfWeek]++;
        
        // イベント頻度
        if (!this.analytics.userBehavior.eventFrequency) {
            this.analytics.userBehavior.eventFrequency = {};
        }
        
        this.analytics.userBehavior.eventFrequency[event.type] = 
            (this.analytics.userBehavior.eventFrequency[event.type] || 0) + 1;
    }
    
    setupEventListeners() {
        // ページ離脱時
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
        
        // ページ可視性変更
        document.addEventListener('visibilitychange', () => {
            this.recordEvent(this.eventTypes.FEATURE_USAGE, {
                feature: 'page_visibility',
                visible: !document.hidden
            });
        });
        
        // オンライン/オフライン状態
        window.addEventListener('online', () => {
            this.recordEvent(this.eventTypes.FEATURE_USAGE, {
                feature: 'network_status',
                status: 'online'
            });
        });
        
        window.addEventListener('offline', () => {
            this.recordEvent(this.eventTypes.FEATURE_USAGE, {
                feature: 'network_status',
                status: 'offline'
            });
        });
        
        // ウィンドウサイズ変更
        window.addEventListener('resize', () => {
            this.recordEvent(this.eventTypes.FEATURE_USAGE, {
                feature: 'viewport_change',
                size: `${window.innerWidth}x${window.innerHeight}`
            });
        });
        
        // エラーハンドリング
        if (this.settings.enableErrorTracking) {
            window.addEventListener('error', (e) => {
                this.recordError(e.error, {
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno
                });
            });
            
            window.addEventListener('unhandledrejection', (e) => {
                this.recordError(e.reason, {
                    type: 'unhandled_promise_rejection'
                });
            });
        }
    }
    
    setupPerformanceMonitoring() {
        if (!this.settings.enablePerformanceTracking) return;
        
        // ページロード時間
        window.addEventListener('load', () => {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.recordEvent(this.eventTypes.PERFORMANCE_METRIC, {
                    metric: 'page_load_time',
                    value: loadTime,
                    unit: 'milliseconds'
                });
            }
        });
        
        // メモリ使用量（サポートされている場合）
        if (performance.memory) {
            setInterval(() => {
                this.recordEvent(this.eventTypes.PERFORMANCE_METRIC, {
                    metric: 'memory_usage',
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit,
                    unit: 'bytes'
                });
            }, 300000); // 5分ごと
        }
    }
    
    // 外部API メソッド
    recordRegionVisit(regionId, coordinates = null) {
        this.recordEvent(this.eventTypes.REGION_VISIT, {
            regionId,
            coordinates,
            visitTime: Date.now()
        });
    }
    
    recordBadgeCollection(regionId, rarity) {
        this.recordEvent(this.eventTypes.BADGE_COLLECTION, {
            regionId,
            rarity,
            collectionTime: Date.now()
        });
    }
    
    recordPhotoCapture(regionId = null) {
        this.recordEvent(this.eventTypes.PHOTO_CAPTURE, {
            regionId,
            captureTime: Date.now(),
            hasRegion: regionId !== null
        });
    }
    
    recordCameraUsage() {
        this.recordEvent(this.eventTypes.CAMERA_USAGE, {
            timestamp: Date.now()
        });
    }
    
    recordAvatarCustomization(changes) {
        this.recordEvent(this.eventTypes.AVATAR_CUSTOMIZATION, {
            changes,
            timestamp: Date.now()
        });
    }
    
    recordMapInteraction(action, data = {}) {
        this.recordEvent(this.eventTypes.MAP_INTERACTION, {
            action,
            ...data,
            timestamp: Date.now()
        });
    }
    
    recordFeatureUsage(feature, data = {}) {
        this.recordEvent(this.eventTypes.FEATURE_USAGE, {
            feature,
            ...data,
            timestamp: Date.now()
        });
    }
    
    recordError(error, context = {}) {
        if (!this.settings.enableErrorTracking) return;
        
        this.recordEvent(this.eventTypes.ERROR_OCCURRENCE, {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            context,
            timestamp: Date.now()
        });
    }
    
    // データ分析メソッド
    getSessionStats() {
        const sessions = this.analytics.sessions;
        const totalSessions = sessions.length;
        
        if (totalSessions === 0) return {};
        
        const durations = sessions.filter(s => s.duration > 0).map(s => s.duration);
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        
        return {
            totalSessions,
            averageDuration: avgDuration,
            totalEvents: this.analytics.events.length,
            activeSession: this.getCurrentSession()
        };
    }
    
    getRegionStats() {
        const stats = {};
        
        Object.entries(this.analytics.regionData).forEach(([regionId, data]) => {
            stats[regionId] = {
                ...data,
                avgTimePerVisit: data.totalTime / data.visits,
                popularityScore: data.visits * 0.4 + data.badges * 0.3 + data.photos * 0.3
            };
        });
        
        return stats;
    }
    
    getBadgeStats() {
        const stats = {
            totalBadges: 0,
            byRarity: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
            byRegion: {}
        };
        
        Object.entries(this.analytics.badgeProgress).forEach(([regionId, badges]) => {
            stats.byRegion[regionId] = badges;
            Object.entries(badges).forEach(([rarity, count]) => {
                stats.byRarity[rarity] += count;
                stats.totalBadges += count;
            });
        });
        
        return stats;
    }
    
    getUserBehaviorInsights() {
        const behavior = this.analytics.userBehavior;
        
        if (!behavior.timePatterns) return {};
        
        // 最もアクティブな時間帯
        const peakHour = behavior.timePatterns.hourly.indexOf(Math.max(...behavior.timePatterns.hourly));
        const peakDay = behavior.timePatterns.daily.indexOf(Math.max(...behavior.timePatterns.daily));
        
        // 最も使用されている機能
        const topFeature = Object.entries(behavior.eventFrequency || {})
            .sort(([,a], [,b]) => b - a)[0];
        
        return {
            peakHour,
            peakDay,
            topFeature: topFeature ? topFeature[0] : null,
            timePatterns: behavior.timePatterns,
            eventFrequency: behavior.eventFrequency
        };
    }
    
    getPerformanceStats() {
        const perfEvents = this.analytics.events.filter(e => e.type === this.eventTypes.PERFORMANCE_METRIC);
        
        const stats = {
            pageLoadTimes: [],
            memoryUsage: []
        };
        
        perfEvents.forEach(event => {
            if (event.data.metric === 'page_load_time') {
                stats.pageLoadTimes.push(event.data.value);
            } else if (event.data.metric === 'memory_usage') {
                stats.memoryUsage.push({
                    timestamp: event.timestamp,
                    used: event.data.used,
                    total: event.data.total
                });
            }
        });
        
        return stats;
    }
    
    generateReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            sessionStats: this.getSessionStats(),
            regionStats: this.getRegionStats(),
            badgeStats: this.getBadgeStats(),
            userBehavior: this.getUserBehaviorInsights(),
            performance: this.getPerformanceStats(),
            summary: {
                dataPoints: this.analytics.events.length,
                sessionsTracked: this.analytics.sessions.length,
                regionsVisited: Object.keys(this.analytics.regionData).length,
                errorsRecorded: this.analytics.events.filter(e => e.type === this.eventTypes.ERROR_OCCURRENCE).length
            }
        };
        
        return report;
    }
    
    exportData(format = 'json') {
        const data = {
            analytics: this.analytics,
            report: this.generateReport(),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        let content, filename, mimeType;
        
        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = `hakusan-analytics-${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                content = this.convertToCSV(data.analytics.events);
                filename = `hakusan-events-${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
                break;
            default:
                throw new Error('Unsupported format');
        }
        
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('📊 データエクスポート完了:', filename);
        return data;
    }
    
    convertToCSV(events) {
        if (events.length === 0) return '';
        
        const headers = ['timestamp', 'sessionId', 'type', 'data', 'metadata'];
        const rows = events.map(event => [
            new Date(event.timestamp).toISOString(),
            event.sessionId,
            event.type,
            JSON.stringify(event.data),
            JSON.stringify(event.metadata)
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }
    
    // データ管理
    saveData() {
        try {
            const dataToSave = {
                ...this.analytics,
                lastSaved: Date.now(),
                version: '1.0'
            };
            
            localStorage.setItem('hakusan_analytics', JSON.stringify(dataToSave));
        } catch (e) {
            console.error('分析データ保存エラー:', e);
        }
    }
    
    loadStoredData() {
        try {
            const stored = localStorage.getItem('hakusan_analytics');
            if (stored) {
                const data = JSON.parse(stored);
                this.analytics = { ...this.analytics, ...data };
                console.log('📊 分析データ読み込み完了');
            }
        } catch (e) {
            console.error('分析データ読み込みエラー:', e);
        }
    }
    
    cleanOldData() {
        const cutoffTime = Date.now() - (this.settings.dataRetentionDays * 24 * 60 * 60 * 1000);
        
        // 古いイベントを削除
        this.analytics.events = this.analytics.events.filter(event => event.timestamp > cutoffTime);
        
        // 古いセッションを削除
        this.analytics.sessions = this.analytics.sessions.filter(session => session.startTime > cutoffTime);
        
        console.log('🧹 古いデータを清理しました');
    }
    
    clearAllData() {
        if (confirm('すべての分析データを削除しますか？この操作は取り消せません。')) {
            this.analytics = {
                sessions: [],
                events: [],
                userBehavior: {},
                regionData: {},
                badgeProgress: {},
                gameMetrics: {},
                userProfiles: []
            };
            
            localStorage.removeItem('hakusan_analytics');
            console.log('🗑️ 分析データを削除しました');
            return true;
        }
        return false;
    }
    
    // 設定管理
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('⚙️ 分析設定を更新しました');
    }
    
    getSettings() {
        return { ...this.settings };
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsSystem = new HakusanAnalyticsSystem();
});

// デバッグ用関数
window.debugAnalytics = () => {
    console.log('📊 分析システム情報:');
    console.log('セッション統計:', window.analyticsSystem.getSessionStats());
    console.log('地域統計:', window.analyticsSystem.getRegionStats());
    console.log('バッジ統計:', window.analyticsSystem.getBadgeStats());
    console.log('ユーザー行動:', window.analyticsSystem.getUserBehaviorInsights());
    console.log('レポート生成:', window.analyticsSystem.generateReport());
};

console.log('📊 分析システム読み込み完了');
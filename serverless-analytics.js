// サーバーレス統計・研究データ収集システム
class ServerlessAnalyticsSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getOrCreateUserId();
        this.startTime = Date.now();
        
        this.sessionData = {
            sessionId: this.sessionId,
            userId: this.userId,
            startTime: this.startTime,
            endTime: null,
            device: this.getDeviceInfo(),
            location: this.getLocationInfo(),
            badgeCollections: [],
            interactions: [],
            features: {},
            pathHistory: [],
            errors: []
        };
        
        this.init();
    }

    init() {
        this.setupEventTracking();
        this.startLocationTracking();
        this.setupPerformanceMonitoring();
        this.scheduleDataSync();
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('hakusan_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('hakusan_user_id', userId);
        }
        return userId;
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            deviceType: this.detectDeviceType(),
            browser: this.detectBrowser(),
            isMobile: /Mobi|Android/i.test(navigator.userAgent),
            isTablet: /Tablet|iPad/i.test(navigator.userAgent),
            isTouch: 'ontouchstart' in window,
            connection: this.getConnectionInfo()
        };
    }

    detectDeviceType() {
        const ua = navigator.userAgent;
        if (/Mobi|Android/i.test(ua)) return 'mobile';
        if (/Tablet|iPad/i.test(ua)) return 'tablet';
        return 'desktop';
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    getLocationInfo() {
        // 位置情報は許可があれば取得（プライバシー配慮）
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.sessionData.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    this.updateLocationBasedAnalytics();
                },
                (error) => {
                    this.sessionData.location = {
                        error: error.message,
                        permitted: false
                    };
                },
                { timeout: 5000, maximumAge: 300000 }
            );
        }
        return { permitted: false };
    }

    updateLocationBasedAnalytics() {
        // 位置情報が取得できた場合の分析
        const location = this.sessionData.location;
        if (location.latitude && location.longitude) {
            // 白山市内かどうかの判定（概算）
            const hakusanBounds = {
                north: 36.5,
                south: 36.2,
                east: 136.8,
                west: 136.4
            };
            
            const isInHakusan = 
                location.latitude >= hakusanBounds.south &&
                location.latitude <= hakusanBounds.north &&
                location.longitude >= hakusanBounds.west &&
                location.longitude <= hakusanBounds.east;
            
            this.sessionData.location.isInHakusan = isInHakusan;
            this.sessionData.location.estimatedRegion = this.estimateRegion(location.latitude, location.longitude);
        }
    }

    estimateRegion(lat, lng) {
        // 各地域の概算座標で最寄り地域を推定
        const regions = {
            tsurugi: { lat: 36.4425, lng: 136.6247 },
            mikawa: { lat: 36.4167, lng: 136.4833 },
            mattou: { lat: 36.4833, lng: 136.5833 },
            kawachi: { lat: 36.4000, lng: 136.7000 },
            shiramine: { lat: 36.2500, lng: 136.7000 },
            yoshinodani: { lat: 36.3000, lng: 136.6500 },
            torigoe: { lat: 36.3500, lng: 136.6800 },
            oguchi: { lat: 36.2200, lng: 136.6800 }
        };

        let closest = null;
        let minDistance = Infinity;

        Object.entries(regions).forEach(([regionId, coords]) => {
            const distance = this.calculateDistance(lat, lng, coords.lat, coords.lng);
            if (distance < minDistance) {
                minDistance = distance;
                closest = regionId;
            }
        });

        return { region: closest, distance: minDistance };
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

    setupEventTracking() {
        // クリックイベント
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', {
                element: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                text: e.target.textContent?.substr(0, 50),
                timestamp: Date.now(),
                coordinates: { x: e.clientX, y: e.clientY }
            });
        });

        // スクロールイベント
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackInteraction('scroll', {
                    scrollY: window.scrollY,
                    scrollPercentage: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
                    timestamp: Date.now()
                });
            }, 100);
        });

        // フォーカスイベント
        window.addEventListener('focus', () => {
            this.trackInteraction('focus', { timestamp: Date.now() });
        });

        window.addEventListener('blur', () => {
            this.trackInteraction('blur', { timestamp: Date.now() });
        });

        // ページ表示状態
        document.addEventListener('visibilitychange', () => {
            this.trackInteraction('visibility', {
                visible: !document.hidden,
                timestamp: Date.now()
            });
        });

        // バッジ取得イベント
        window.addEventListener('badgeCollected', (e) => {
            this.trackBadgeCollection(e.detail);
        });

        // エラーイベント
        window.addEventListener('error', (e) => {
            this.trackError({
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                timestamp: Date.now()
            });
        });
    }

    trackInteraction(type, data) {
        this.sessionData.interactions.push({
            type,
            data,
            timestamp: Date.now(),
            timeFromStart: Date.now() - this.startTime
        });

        // 機能使用統計
        if (!this.sessionData.features[type]) {
            this.sessionData.features[type] = 0;
        }
        this.sessionData.features[type]++;
    }

    trackBadgeCollection(badgeData) {
        const collectionEvent = {
            regionId: badgeData.badgeId,
            timestamp: Date.now(),
            timeFromStart: Date.now() - this.startTime,
            sessionSequence: this.sessionData.badgeCollections.length + 1,
            location: this.sessionData.location,
            device: this.sessionData.device.deviceType
        };

        this.sessionData.badgeCollections.push(collectionEvent);

        // 収集パターン分析
        this.analyzeCollectionPattern();

        console.log('📊 Badge collection tracked:', collectionEvent);
    }

    analyzeCollectionPattern() {
        const collections = this.sessionData.badgeCollections;
        if (collections.length >= 2) {
            const intervals = [];
            for (let i = 1; i < collections.length; i++) {
                intervals.push(collections[i].timestamp - collections[i-1].timestamp);
            }
            
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            
            this.sessionData.collectionPattern = {
                totalBadges: collections.length,
                averageInterval: avgInterval,
                collectionSpeed: collections.length / ((Date.now() - this.startTime) / 60000), // badges per minute
                timeToFirst: collections[0].timeFromStart,
                pattern: this.detectCollectionPattern(collections)
            };
        }
    }

    detectCollectionPattern(collections) {
        if (collections.length < 3) return 'insufficient_data';
        
        const regions = collections.map(c => c.regionId);
        const uniqueRegions = new Set(regions);
        
        if (uniqueRegions.size === regions.length) {
            return 'sequential_exploration';
        } else if (uniqueRegions.size === 1) {
            return 'focused_collection';
        } else {
            return 'mixed_pattern';
        }
    }

    trackError(errorData) {
        this.sessionData.errors.push(errorData);
    }

    setupPerformanceMonitoring() {
        // パフォーマンス測定
        if ('performance' in window) {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                this.sessionData.performance = {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: this.getFirstPaint(),
                    memoryUsage: this.getMemoryUsage()
                };
            }, 1000);
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    startLocationTracking() {
        // 位置の変化を追跡（バッテリー配慮で低頻度）
        if (navigator.geolocation) {
            this.locationWatcher = navigator.geolocation.watchPosition(
                (position) => {
                    this.trackInteraction('location_update', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                null,
                { enableHighAccuracy: false, maximumAge: 600000, timeout: 10000 }
            );
        }
    }

    scheduleDataSync() {
        // 定期的にデータを保存
        this.syncInterval = setInterval(() => {
            this.saveSessionData();
        }, 30000); // 30秒ごと

        // ページ離脱時
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });

        // ページが非表示になった時
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveSessionData();
            }
        });
    }

    saveSessionData() {
        this.sessionData.lastUpdate = Date.now();
        this.sessionData.duration = Date.now() - this.startTime;
        
        // ローカルストレージに保存
        localStorage.setItem(`hakusan_session_${this.sessionId}`, JSON.stringify(this.sessionData));
        
        // 総合統計に反映
        this.updateAggregatedData();
    }

    updateAggregatedData() {
        const aggregated = JSON.parse(localStorage.getItem('hakusan_aggregated_analytics') || '{}');
        
        if (!aggregated.sessions) aggregated.sessions = [];
        if (!aggregated.summary) {
            aggregated.summary = {
                totalSessions: 0,
                totalBadges: 0,
                totalUsers: new Set(),
                deviceTypes: {},
                browsers: {},
                locations: [],
                averageSessionDuration: 0,
                collectionPatterns: {},
                lastUpdate: Date.now()
            };
        }
        
        // セッション追加または更新
        const existingIndex = aggregated.sessions.findIndex(s => s.sessionId === this.sessionId);
        const sessionSummary = {
            sessionId: this.sessionId,
            userId: this.userId,
            startTime: this.startTime,
            duration: Date.now() - this.startTime,
            badgeCount: this.sessionData.badgeCollections.length,
            interactionCount: this.sessionData.interactions.length,
            deviceType: this.sessionData.device.deviceType,
            browser: this.sessionData.device.browser,
            location: this.sessionData.location,
            errors: this.sessionData.errors.length
        };
        
        if (existingIndex >= 0) {
            aggregated.sessions[existingIndex] = sessionSummary;
        } else {
            aggregated.sessions.push(sessionSummary);
        }
        
        // サマリー更新
        aggregated.summary.totalSessions = aggregated.sessions.length;
        aggregated.summary.totalBadges = aggregated.sessions.reduce((sum, s) => sum + s.badgeCount, 0);
        aggregated.summary.totalUsers.add(this.userId);
        aggregated.summary.lastUpdate = Date.now();
        
        // デバイスタイプ統計
        if (!aggregated.summary.deviceTypes[this.sessionData.device.deviceType]) {
            aggregated.summary.deviceTypes[this.sessionData.device.deviceType] = 0;
        }
        aggregated.summary.deviceTypes[this.sessionData.device.deviceType]++;
        
        // ブラウザ統計
        if (!aggregated.summary.browsers[this.sessionData.device.browser]) {
            aggregated.summary.browsers[this.sessionData.device.browser] = 0;
        }
        aggregated.summary.browsers[this.sessionData.device.browser]++;
        
        // Set を配列に変換して保存
        aggregated.summary.totalUsers = Array.from(aggregated.summary.totalUsers);
        
        localStorage.setItem('hakusan_aggregated_analytics', JSON.stringify(aggregated));
    }

    endSession() {
        this.sessionData.endTime = Date.now();
        this.sessionData.totalDuration = this.sessionData.endTime - this.startTime;
        
        this.saveSessionData();
        
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        if (this.locationWatcher) {
            navigator.geolocation.clearWatch(this.locationWatcher);
        }
    }

    getResearchData() {
        const aggregated = JSON.parse(localStorage.getItem('hakusan_aggregated_analytics') || '{}');
        const sessions = this.getAllSessions();
        
        return {
            summary: aggregated.summary,
            sessions: sessions,
            currentSession: this.sessionData,
            researchMetrics: this.calculateResearchMetrics(sessions),
            exportDate: new Date().toISOString(),
            dataVersion: '1.0'
        };
    }

    getAllSessions() {
        const sessions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('hakusan_session_')) {
                try {
                    const sessionData = JSON.parse(localStorage.getItem(key));
                    sessions.push(sessionData);
                } catch (e) {
                    console.warn('Invalid session data:', key);
                }
            }
        }
        return sessions;
    }

    calculateResearchMetrics(sessions) {
        if (!sessions.length) return {};
        
        const metrics = {
            userEngagement: {
                averageSessionDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length,
                badgeCollectionRate: sessions.filter(s => s.badgeCollections?.length > 0).length / sessions.length,
                averageBadgesPerSession: sessions.reduce((sum, s) => sum + (s.badgeCollections?.length || 0), 0) / sessions.length,
                returnUserRate: this.calculateReturnUserRate(sessions)
            },
            geographicDistribution: this.analyzeGeographicDistribution(sessions),
            deviceUsage: this.analyzeDeviceUsage(sessions),
            temporalPatterns: this.analyzeTemporalPatterns(sessions),
            collectionBehavior: this.analyzeCollectionBehavior(sessions),
            errorPatterns: this.analyzeErrorPatterns(sessions)
        };
        
        return metrics;
    }

    calculateReturnUserRate(sessions) {
        const userSessions = {};
        sessions.forEach(session => {
            if (!userSessions[session.userId]) {
                userSessions[session.userId] = [];
            }
            userSessions[session.userId].push(session);
        });
        
        const returnUsers = Object.values(userSessions).filter(userSess => userSess.length > 1).length;
        const totalUsers = Object.keys(userSessions).length;
        
        return totalUsers > 0 ? returnUsers / totalUsers : 0;
    }

    analyzeGeographicDistribution(sessions) {
        const regions = {};
        sessions.forEach(session => {
            if (session.location?.estimatedRegion?.region) {
                const region = session.location.estimatedRegion.region;
                if (!regions[region]) regions[region] = 0;
                regions[region]++;
            }
        });
        return regions;
    }

    analyzeDeviceUsage(sessions) {
        const devices = {};
        sessions.forEach(session => {
            const deviceType = session.device?.deviceType || 'unknown';
            if (!devices[deviceType]) devices[deviceType] = 0;
            devices[deviceType]++;
        });
        return devices;
    }

    analyzeTemporalPatterns(sessions) {
        const hourlyDistribution = new Array(24).fill(0);
        const dailyDistribution = {};
        
        sessions.forEach(session => {
            const startDate = new Date(session.startTime);
            const hour = startDate.getHours();
            const day = startDate.toDateString();
            
            hourlyDistribution[hour]++;
            if (!dailyDistribution[day]) dailyDistribution[day] = 0;
            dailyDistribution[day]++;
        });
        
        return {
            hourlyDistribution,
            dailyDistribution,
            peakHour: hourlyDistribution.indexOf(Math.max(...hourlyDistribution)),
            peakDay: Object.entries(dailyDistribution).reduce((a, b) => dailyDistribution[a[0]] > dailyDistribution[b[0]] ? a : b)[0]
        };
    }

    analyzeCollectionBehavior(sessions) {
        const patterns = {};
        const completionRates = {};
        
        sessions.forEach(session => {
            if (session.collectionPattern?.pattern) {
                const pattern = session.collectionPattern.pattern;
                if (!patterns[pattern]) patterns[pattern] = 0;
                patterns[pattern]++;
            }
            
            const badgeCount = session.badgeCollections?.length || 0;
            const completionLevel = Math.floor(badgeCount / 2) * 2; // 0, 2, 4, 6, 8
            if (!completionRates[completionLevel]) completionRates[completionLevel] = 0;
            completionRates[completionLevel]++;
        });
        
        return { patterns, completionRates };
    }

    analyzeErrorPatterns(sessions) {
        const errorTypes = {};
        let totalErrors = 0;
        
        sessions.forEach(session => {
            if (session.errors) {
                session.errors.forEach(error => {
                    const errorType = error.message || 'unknown';
                    if (!errorTypes[errorType]) errorTypes[errorType] = 0;
                    errorTypes[errorType]++;
                    totalErrors++;
                });
            }
        });
        
        return {
            totalErrors,
            errorTypes,
            errorRate: sessions.length > 0 ? totalErrors / sessions.length : 0
        };
    }

    exportResearchData() {
        const data = this.getResearchData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hakusan-research-data-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return data;
    }

    clearAllData() {
        if (confirm('すべての研究データを削除しますか？この操作は取り消せません。')) {
            // セッションデータを削除
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith('hakusan_session_')) {
                    localStorage.removeItem(key);
                }
            }
            
            // 集約データを削除
            localStorage.removeItem('hakusan_aggregated_analytics');
            
            alert('研究データを削除しました。');
        }
    }

    generateResearchReport() {
        const data = this.getResearchData();
        const metrics = data.researchMetrics;
        
        return `
=== 白山市観光アプリ 研究データレポート ===
生成日時: ${new Date().toLocaleString('ja-JP')}

📊 基本統計:
- 総セッション数: ${data.sessions.length}
- 総ユーザー数: ${data.summary?.totalUsers?.length || 0}
- 総バッジ取得数: ${data.summary?.totalBadges || 0}

👥 ユーザーエンゲージメント:
- 平均セッション時間: ${Math.round((metrics.userEngagement?.averageSessionDuration || 0) / 60000)} 分
- バッジ取得率: ${Math.round((metrics.userEngagement?.badgeCollectionRate || 0) * 100)}%
- セッションあたり平均バッジ数: ${(metrics.userEngagement?.averageBadgesPerSession || 0).toFixed(1)}
- リピーター率: ${Math.round((metrics.userEngagement?.returnUserRate || 0) * 100)}%

📱 デバイス使用状況:
${Object.entries(metrics.deviceUsage || {}).map(([device, count]) => 
    `- ${device}: ${count}回 (${Math.round(count / data.sessions.length * 100)}%)`
).join('\n')}

🗺️ 地域別利用状況:
${Object.entries(metrics.geographicDistribution || {}).map(([region, count]) => 
    `- ${region}: ${count}回`
).join('\n')}

🕒 時間パターン:
- ピーク時間: ${metrics.temporalPatterns?.peakHour || 'N/A'}時
- 最も活発な日: ${metrics.temporalPatterns?.peakDay || 'N/A'}

🏅 収集行動パターン:
${Object.entries(metrics.collectionBehavior?.patterns || {}).map(([pattern, count]) => 
    `- ${pattern}: ${count}回`
).join('\n')}

⚠️ エラー統計:
- 総エラー数: ${metrics.errorPatterns?.totalErrors || 0}
- エラー率: ${Math.round((metrics.errorPatterns?.errorRate || 0) * 100)}% (セッションあたり)

=== レポート終了 ===
        `;
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', () => {
    window.serverlessAnalytics = new ServerlessAnalyticsSystem();
});

// エクスポート用関数
window.exportResearchData = () => {
    if (window.serverlessAnalytics) {
        return window.serverlessAnalytics.exportResearchData();
    }
};

window.generateResearchReport = () => {
    if (window.serverlessAnalytics) {
        const report = window.serverlessAnalytics.generateResearchReport();
        console.log(report);
        return report;
    }
};

console.log('📈 サーバーレス分析システム読み込み完了！');
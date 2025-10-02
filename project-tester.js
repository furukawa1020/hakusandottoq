// テスト・デモ用スクリプト
class ProjectTester {
    constructor() {
        this.testResults = [];
        this.init();
    }

    init() {
        console.log('🧪 ハクサンリーグプロジェクトテスト開始');
        this.runAllTests();
    }

    async runAllTests() {
        // 基本機能テスト
        await this.testBasicFunctionality();
        
        // 新機能テスト
        await this.testNewFeatures();
        
        // 統合テスト
        await this.testIntegration();
        
        // レポート出力
        this.generateTestReport();
    }

    async testBasicFunctionality() {
        console.log('📋 基本機能テスト実行中...');
        
        // LocalStorageテスト
        this.testLocalStorage();
        
        // バッジシステムテスト
        this.testBadgeSystem();
        
        // UIコンポーネントテスト
        this.testUIComponents();
        
        // PWA機能テスト
        this.testPWAFeatures();
    }

    testLocalStorage() {
        try {
            // テストデータの保存と読み込み
            const testData = { test: 'value', timestamp: Date.now() };
            localStorage.setItem('hakusan_test', JSON.stringify(testData));
            
            const retrieved = JSON.parse(localStorage.getItem('hakusan_test'));
            
            if (retrieved.test === 'value') {
                this.addTestResult('LocalStorage', 'PASS', 'データの保存・読み込み成功');
            } else {
                this.addTestResult('LocalStorage', 'FAIL', 'データの読み込み失敗');
            }
            
            // テストデータを削除
            localStorage.removeItem('hakusan_test');
            
        } catch (error) {
            this.addTestResult('LocalStorage', 'FAIL', `エラー: ${error.message}`);
        }
    }

    testBadgeSystem() {
        try {
            // バッジデータの確認
            const towns = ['tsurugi', 'mikawa', 'mattou', 'kawachi', 'shiramine', 'yoshinodani', 'torigoe', 'oguchi'];
            
            let badgeSystemOK = true;
            let missingElements = [];
            
            towns.forEach(townCode => {
                const townCard = document.querySelector(`[data-town="${townCode}"]`);
                if (!townCard) {
                    badgeSystemOK = false;
                    missingElements.push(`Town card: ${townCode}`);
                }
                
                const badgeIcon = townCard?.querySelector('.badge-icon');
                if (!badgeIcon) {
                    badgeSystemOK = false;
                    missingElements.push(`Badge icon: ${townCode}`);
                }
            });
            
            if (badgeSystemOK) {
                this.addTestResult('Badge System', 'PASS', '全ての町カードとバッジアイコンが存在');
            } else {
                this.addTestResult('Badge System', 'FAIL', `不足要素: ${missingElements.join(', ')}`);
            }
            
        } catch (error) {
            this.addTestResult('Badge System', 'FAIL', `エラー: ${error.message}`);
        }
    }

    testUIComponents() {
        const components = [
            { selector: 'header', name: 'ヘッダー' },
            { selector: '.feature-nav', name: '機能ナビゲーション' },
            { selector: '.stamp-counter', name: 'バッジカウンター' },
            { selector: '.towns-grid', name: '町カードグリッド' },
            { selector: '.map-section', name: 'マップセクション' }
        ];
        
        let allComponentsFound = true;
        let missingComponents = [];
        
        components.forEach(component => {
            const element = document.querySelector(component.selector);
            if (!element) {
                allComponentsFound = false;
                missingComponents.push(component.name);
            }
        });
        
        if (allComponentsFound) {
            this.addTestResult('UI Components', 'PASS', '全てのUIコンポーネントが存在');
        } else {
            this.addTestResult('UI Components', 'FAIL', `不足: ${missingComponents.join(', ')}`);
        }
    }

    testPWAFeatures() {
        let pwaScore = 0;
        let pwaMessages = [];
        
        // Service Worker
        if ('serviceWorker' in navigator) {
            pwaScore++;
            pwaMessages.push('Service Worker対応');
        }
        
        // Manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            pwaScore++;
            pwaMessages.push('Manifestファイル存在');
        }
        
        // App Install
        if ('beforeinstallprompt' in window || window.matchMedia('(display-mode: standalone)').matches) {
            pwaScore++;
            pwaMessages.push('アプリインストール対応');
        }
        
        if (pwaScore >= 2) {
            this.addTestResult('PWA Features', 'PASS', pwaMessages.join(', '));
        } else {
            this.addTestResult('PWA Features', 'PARTIAL', `部分対応: ${pwaMessages.join(', ')}`);
        }
    }

    async testNewFeatures() {
        console.log('🆕 新機能テスト実行中...');
        
        // AR写真システム
        this.testARPhotoSystem();
        
        // ピクセルアバターシステム
        this.testPixelAvatarSystem();
        
        // 位置情報画像システム
        this.testLocationImageSystem();
        
        // リアル統計システム
        this.testRealStatisticsSystem();
    }

    testARPhotoSystem() {
        try {
            const arPhotoSystem = window.arPhotoSystem;
            if (arPhotoSystem) {
                this.addTestResult('AR Photo System', 'PASS', 'システム初期化完了');
                
                // カメラアクセステスト（実際には実行しない）
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    this.addTestResult('Camera Access', 'PASS', 'カメラAPI利用可能');
                } else {
                    this.addTestResult('Camera Access', 'FAIL', 'カメラAPI未対応');
                }
            } else {
                this.addTestResult('AR Photo System', 'FAIL', 'システム初期化失敗');
            }
        } catch (error) {
            this.addTestResult('AR Photo System', 'FAIL', `エラー: ${error.message}`);
        }
    }

    testPixelAvatarSystem() {
        try {
            const pixelAvatarSystem = window.pixelAvatarSystem;
            if (pixelAvatarSystem) {
                this.addTestResult('Pixel Avatar System', 'PASS', 'システム初期化完了');
                
                // アバターデータテスト
                const avatarData = pixelAvatarSystem.avatarData;
                if (avatarData && avatarData.length > 0) {
                    this.addTestResult('Avatar Data', 'PASS', 'アバターデータ正常');
                } else {
                    this.addTestResult('Avatar Data', 'FAIL', 'アバターデータ不正');
                }
            } else {
                this.addTestResult('Pixel Avatar System', 'FAIL', 'システム初期化失敗');
            }
        } catch (error) {
            this.addTestResult('Pixel Avatar System', 'FAIL', `エラー: ${error.message}`);
        }
    }

    testLocationImageSystem() {
        try {
            const locationImageManager = window.locationImageManager;
            if (locationImageManager) {
                this.addTestResult('Location Image System', 'PASS', 'システム初期化完了');
                
                // 位置データテスト
                const locationData = locationImageManager.locationData;
                const expectedLocations = ['tsurugi', 'mikawa', 'mattou', 'kawachi', 'shiramine', 'yoshinodani', 'torigoe', 'oguchi'];
                
                const hasAllLocations = expectedLocations.every(loc => locationData[loc]);
                if (hasAllLocations) {
                    this.addTestResult('Location Data', 'PASS', '全地域データ存在');
                } else {
                    this.addTestResult('Location Data', 'FAIL', '地域データ不足');
                }
            } else {
                this.addTestResult('Location Image System', 'FAIL', 'システム初期化失敗');
            }
        } catch (error) {
            this.addTestResult('Location Image System', 'FAIL', `エラー: ${error.message}`);
        }
    }

    testRealStatisticsSystem() {
        try {
            const realStatsSystem = window.realStatsSystem;
            if (realStatsSystem) {
                this.addTestResult('Real Statistics System', 'PASS', 'システム初期化完了');
                
                // 統計データテスト
                const stats = realStatsSystem.getTotalStats();
                if (stats && typeof stats === 'object') {
                    this.addTestResult('Statistics Data', 'PASS', '統計データ正常');
                } else {
                    this.addTestResult('Statistics Data', 'FAIL', '統計データ不正');
                }
            } else {
                this.addTestResult('Real Statistics System', 'FAIL', 'システム初期化失敗');
            }
        } catch (error) {
            this.addTestResult('Real Statistics System', 'FAIL', `エラー: ${error.message}`);
        }
    }

    async testIntegration() {
        console.log('🔗 統合テスト実行中...');
        
        // スクリプト読み込みテスト
        this.testScriptLoading();
        
        // イベント連携テスト
        this.testEventIntegration();
        
        // データ連携テスト
        this.testDataIntegration();
    }

    testScriptLoading() {
        const requiredScripts = [
            'script.js',
            'incentive-system.js',
            'marketing-effects.js',
            'location-images.js',
            'ar-photo.js',
            'pixel-avatar.js',
            'real-statistics.js',
            'badge-generator.js'
        ];
        
        const loadedScripts = Array.from(document.scripts).map(script => {
            const src = script.src;
            return src.substring(src.lastIndexOf('/') + 1);
        });
        
        const missingScripts = requiredScripts.filter(script => 
            !loadedScripts.includes(script)
        );
        
        if (missingScripts.length === 0) {
            this.addTestResult('Script Loading', 'PASS', '全スクリプト読み込み完了');
        } else {
            this.addTestResult('Script Loading', 'FAIL', `未読み込み: ${missingScripts.join(', ')}`);
        }
    }

    testEventIntegration() {
        let eventSystemOK = true;
        let eventMessages = [];
        
        // カスタムイベントテスト
        try {
            const testEvent = new CustomEvent('testEvent', { detail: 'test' });
            window.dispatchEvent(testEvent);
            eventMessages.push('カスタムイベント対応');
        } catch (error) {
            eventSystemOK = false;
            eventMessages.push('カスタムイベント失敗');
        }
        
        // DOM イベントテスト
        const testButton = document.createElement('button');
        testButton.addEventListener('click', () => {
            eventMessages.push('DOMイベント対応');
        });
        
        if (eventSystemOK) {
            this.addTestResult('Event Integration', 'PASS', eventMessages.join(', '));
        } else {
            this.addTestResult('Event Integration', 'FAIL', eventMessages.join(', '));
        }
    }

    testDataIntegration() {
        try {
            // 各システム間のデータ連携確認
            const systems = [
                window.realStatsSystem,
                window.pixelAvatarSystem,
                window.locationImageManager,
                window.arPhotoSystem
            ];
            
            const activeSystems = systems.filter(system => system !== undefined);
            
            if (activeSystems.length >= 3) {
                this.addTestResult('Data Integration', 'PASS', `${activeSystems.length}/4 システム連携`);
            } else {
                this.addTestResult('Data Integration', 'PARTIAL', `${activeSystems.length}/4 システム連携`);
            }
            
        } catch (error) {
            this.addTestResult('Data Integration', 'FAIL', `エラー: ${error.message}`);
        }
    }

    addTestResult(category, status, message) {
        this.testResults.push({
            category,
            status,
            message,
            timestamp: new Date().toISOString()
        });
        
        const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${emoji} ${category}: ${message}`);
    }

    generateTestReport() {
        console.log('\n📊 テストレポート生成中...');
        
        const passCount = this.testResults.filter(r => r.status === 'PASS').length;
        const failCount = this.testResults.filter(r => r.status === 'FAIL').length;
        const partialCount = this.testResults.filter(r => r.status === 'PARTIAL').length;
        const totalCount = this.testResults.length;
        
        const report = `
=== ハクサンリーグプロジェクト テストレポート ===
実行日時: ${new Date().toLocaleString('ja-JP')}

📈 テスト結果サマリー:
✅ PASS: ${passCount}/${totalCount} (${Math.round(passCount/totalCount*100)}%)
❌ FAIL: ${failCount}/${totalCount} (${Math.round(failCount/totalCount*100)}%)
⚠️ PARTIAL: ${partialCount}/${totalCount} (${Math.round(partialCount/totalCount*100)}%)

📋 詳細結果:
${this.testResults.map(result => 
    `${result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'} ${result.category}: ${result.message}`
).join('\n')}

🎯 プロジェクト状態:
${passCount >= totalCount * 0.8 ? 
    '🟢 プロダクション準備完了 - 高品質' : 
    passCount >= totalCount * 0.6 ? 
    '🟡 ベータ版準備完了 - 改善推奨' : 
    '🔴 開発継続必要 - 重要な問題あり'
}

🚀 推奨次ステップ:
${failCount > 0 ? '1. 失敗したテストの修正\n' : ''}
${partialCount > 0 ? '2. 部分対応機能の完全実装\n' : ''}
3. ユーザーテストの実施
4. パフォーマンス最適化
5. デプロイメント準備

=== レポート終了 ===
        `;
        
        console.log(report);
        
        // レポートをローカルストレージに保存
        localStorage.setItem('hakusan_test_report', JSON.stringify({
            report,
            results: this.testResults,
            timestamp: Date.now(),
            summary: { passCount, failCount, partialCount, totalCount }
        }));
        
        // ブラウザにレポート表示
        this.displayReportInBrowser(report);
    }

    displayReportInBrowser(report) {
        const reportDiv = document.createElement('div');
        reportDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 600px;
            background: white;
            border: 2px solid #333;
            border-radius: 10px;
            padding: 20px;
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        reportDiv.innerHTML = `
            <button onclick="this.parentElement.remove()" style="float: right; background: #ff4444; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer;">✕</button>
            <pre style="margin: 0; white-space: pre-wrap; font-size: 11px; line-height: 1.4;">${report}</pre>
        `;
        
        document.body.appendChild(reportDiv);
    }

    // 手動テスト実行用メソッド
    static runManualTest() {
        return new ProjectTester();
    }
}

// デモ用バッジ取得シミュレーション
function simulateBadgeCollection() {
    const towns = ['tsurugi', 'mikawa', 'mattou', 'kawachi', 'shiramine', 'yoshinodani', 'torigoe', 'oguchi'];
    
    console.log('🎮 バッジ取得デモ開始...');
    
    towns.forEach((town, index) => {
        setTimeout(() => {
            console.log(`🏅 ${town}バッジを取得中...`);
            
            // バッジ取得をシミュレート
            if (typeof addStamp === 'function') {
                addStamp(town);
            }
            
            // 統計システムに通知
            if (window.realStatsSystem) {
                window.realStatsSystem.trackBadgeCollection(town);
            }
            
            console.log(`✅ ${town}バッジ取得完了！`);
            
        }, index * 1000);
    });
    
    setTimeout(() => {
        console.log('🏆 全バッジ取得デモ完了！');
    }, towns.length * 1000);
}

// グローバル関数として公開
window.ProjectTester = ProjectTester;
window.simulateBadgeCollection = simulateBadgeCollection;

// 自動テスト実行（ページ読み込み後）
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔧 自動テスト開始（3秒後）...');
        setTimeout(() => {
            new ProjectTester();
        }, 3000);
    }, 1000);
});

console.log(`
🧪 テストシステム読み込み完了！

手動実行コマンド:
- ProjectTester.runManualTest() : 手動テスト実行
- simulateBadgeCollection() : バッジ取得デモ
- generateAndSaveBadges() : バッジPNG生成
- showRealStats() : 統計表示
- openAvatarEditor() : アバター編集
`);
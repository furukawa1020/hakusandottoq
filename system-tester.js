// はくさんNFCバッジクエスト - システム統合テスター
class HakusanSystemTester {
    constructor() {
        this.testResults = {};
        this.systemStatus = {};
    }

    async runCompleteSystemTest() {
        console.log('🔍 はくさんNFCバッジクエスト - 完全システムテスト開始');
        
        // 1. DOM要素の存在確認
        this.testDOMElements();
        
        // 2. JavaScriptモジュールの読み込み確認
        this.testModuleLoading();
        
        // 3. 各システムの初期化確認
        await this.testSystemInitialization();
        
        // 4. 機能の動作確認
        this.testFunctionality();
        
        // 5. UI要素の動作確認
        this.testUIInteractions();
        
        // 6. データ保存・読み込み確認
        this.testDataPersistence();
        
        // 7. 総合結果レポート
        this.generateReport();
        
        return this.testResults;
    }

    testDOMElements() {
        console.log('📋 DOM要素テスト開始...');
        
        const requiredElements = [
            'badgeCount',
            'currentRegion', 
            'nearestSpot',
            'rpgCanvas',
            'miniMapCanvas',
            'regionList'
        ];
        
        this.testResults.domElements = {};
        
        requiredElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            this.testResults.domElements[elementId] = {
                exists: !!element,
                visible: element ? !element.hidden : false
            };
        });
        
        // ボタン要素の確認
        const buttons = document.querySelectorAll('.action-buttons button');
        this.testResults.actionButtons = {
            count: buttons.length,
            expected: 5,
            working: Array.from(buttons).every(btn => btn.onclick !== null)
        };
        
        console.log('✅ DOM要素テスト完了');
    }

    testModuleLoading() {
        console.log('📦 モジュール読み込みテスト開始...');
        
        this.testResults.modules = {
            badgeSystem: {
                class: !!window.HakusanBadgeSystem,
                instance: !!window.badgeSystem,
                methods: window.badgeSystem ? {
                    showCollectionProgress: typeof window.badgeSystem.showCollectionProgress === 'function',
                    shareCollectionProgress: typeof window.badgeSystem.shareCollectionProgress === 'function'
                } : false
            },
            arCamera: {
                class: !!window.HakusanARCamera,
                instance: !!window.arCamera,
                methods: window.arCamera ? {
                    startCamera: typeof window.arCamera.startCamera === 'function'
                } : false
            },
            avatarSystem: {
                class: !!window.HakusanAvatarSystem,
                instance: !!window.avatarSystem,
                methods: window.avatarSystem ? {
                    openCustomizer: typeof window.avatarSystem.openCustomizer === 'function'
                } : false
            },
            regionPhotos: {
                instance: !!window.hakusanPhotos,
                methods: window.hakusanPhotos ? {
                    showPhotoGallery: typeof window.hakusanPhotos.showPhotoGallery === 'function'
                } : false
            },
            rpgEngine: {
                class: !!window.HakusanRPGEngine,
                instance: !!window.rpgEngine
            }
        };
        
        console.log('✅ モジュール読み込みテスト完了');
    }

    async testSystemInitialization() {
        console.log('🚀 システム初期化テスト開始...');
        
        // バッジシステム初期化テスト
        try {
            if (!window.badgeSystem && window.HakusanBadgeSystem) {
                window.badgeSystem = new HakusanBadgeSystem();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            this.systemStatus.badgeSystem = !!window.badgeSystem;
        } catch (error) {
            this.systemStatus.badgeSystem = false;
            console.warn('バッジシステム初期化エラー:', error);
        }
        
        // ARカメラ初期化テスト
        try {
            if (!window.arCamera && window.HakusanARCamera) {
                window.arCamera = new HakusanARCamera();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            this.systemStatus.arCamera = !!window.arCamera;
        } catch (error) {
            this.systemStatus.arCamera = false;
            console.warn('ARカメラ初期化エラー:', error);
        }
        
        // アバターシステム初期化テスト
        try {
            if (!window.avatarSystem && window.HakusanAvatarSystem) {
                window.avatarSystem = new HakusanAvatarSystem();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            this.systemStatus.avatarSystem = !!window.avatarSystem;
        } catch (error) {
            this.systemStatus.avatarSystem = false;
            console.warn('アバターシステム初期化エラー:', error);
        }
        
        // 地域写真システム初期化テスト
        try {
            if (!window.hakusanPhotos && window.HakusanPhotos) {
                window.hakusanPhotos = new HakusanPhotos();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            this.systemStatus.regionPhotos = !!window.hakusanPhotos;
        } catch (error) {
            this.systemStatus.regionPhotos = false;
            console.warn('地域写真システム初期化エラー:', error);
        }
        
        console.log('✅ システム初期化テスト完了');
    }

    testFunctionality() {
        console.log('⚙️ 機能テスト開始...');
        
        this.testResults.functions = {
            showBadgeCollection: this.testFunction('showBadgeCollection'),
            openARCamera: this.testFunction('openARCamera'),
            openAvatarCustomizer: this.testFunction('openAvatarCustomizer'),
            shareBadgeProgress: this.testFunction('shareBadgeProgress'),
            showRegionPhotos: this.testFunction('showRegionPhotos')
        };
        
        console.log('✅ 機能テスト完了');
    }

    testFunction(functionName) {
        try {
            const func = window[functionName];
            if (typeof func === 'function') {
                // 実際に実行はせず、関数の存在と型のみチェック
                return { exists: true, type: 'function', callable: true };
            } else {
                return { exists: false, type: typeof func, callable: false };
            }
        } catch (error) {
            return { exists: false, error: error.message, callable: false };
        }
    }

    testUIInteractions() {
        console.log('🖱️ UI相互作用テスト開始...');
        
        const buttons = document.querySelectorAll('.action-buttons button');
        this.testResults.uiInteractions = {
            buttonCount: buttons.length,
            buttons: Array.from(buttons).map(button => ({
                text: button.textContent.trim(),
                hasOnClick: !!button.onclick,
                hasIcon: !!button.querySelector('span[class^="icon-"]'),
                styles: {
                    visible: !button.hidden,
                    enabled: !button.disabled
                }
            }))
        };
        
        console.log('✅ UI相互作用テスト完了');
    }

    testDataPersistence() {
        console.log('💾 データ永続化テスト開始...');
        
        // テストデータの保存・読み込み
        const testKey = 'hakusan_system_test';
        const testData = { timestamp: Date.now(), test: true };
        
        try {
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            
            this.testResults.dataPersistence = {
                localStorage: retrieved && retrieved.test === true,
                existing: {
                    badges: !!localStorage.getItem('hakusanBadges'),
                    avatar: !!localStorage.getItem('selectedAvatar'),
                    photos: !!localStorage.getItem('hakusan_photos')
                }
            };
        } catch (error) {
            this.testResults.dataPersistence = {
                localStorage: false,
                error: error.message
            };
        }
        
        console.log('✅ データ永続化テスト完了');
    }

    generateReport() {
        console.log('📊 システムレポート生成中...');
        
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(result => 
            typeof result === 'object' && Object.values(result).some(v => v === true)
        ).length;
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: totalTests,
                passed: passedTests,
                success_rate: Math.round((passedTests / totalTests) * 100)
            },
            systems: this.systemStatus,
            details: this.testResults
        };
        
        console.log('🎯 システムテスト結果:', report);
        
        // 視覚的レポートの表示
        this.displayVisualReport(report);
        
        return report;
    }

    displayVisualReport(report) {
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
            z-index: 10000;
            overflow-y: auto;
        `;
        
        const successRate = report.summary.success_rate;
        const statusColor = successRate >= 80 ? '#32CD32' : successRate >= 60 ? '#FFD700' : '#FF6B6B';
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #87CEEB 0%, #9ACD32 100%);
                border-radius: 20px;
                padding: 30px;
                max-width: 800px;
                width: 90%;
                max-height: 90%;
                overflow-y: auto;
                color: white;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <h2 style="margin: 0 0 20px 0; text-align: center;">🔍 はくさんNFCバッジクエスト システム診断</h2>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 3em; color: ${statusColor};">${successRate}%</div>
                    <div style="font-size: 1.2em;">システム正常性</div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    ${Object.entries(report.systems).map(([system, status]) => `
                        <div style="
                            background: rgba(255,255,255,0.2);
                            padding: 15px;
                            border-radius: 10px;
                            text-align: center;
                        ">
                            <div style="font-size: 2em;">${status ? '✅' : '❌'}</div>
                            <div style="margin-top: 10px; font-weight: bold;">${system}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3>📋 機能確認結果</h3>
                    <ul style="margin: 10px 0;">
                        ${report.details.functions ? Object.entries(report.details.functions).map(([func, result]) => `
                            <li style="margin: 5px 0;">
                                ${result.callable ? '✅' : '❌'} ${func}
                            </li>
                        `).join('') : '<li>機能テスト未実行</li>'}
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="document.body.removeChild(this.closest('.modal'))" style="
                        background: rgba(0,0,0,0.3);
                        border: 2px solid white;
                        color: white;
                        padding: 12px 30px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 1.1em;
                    ">閉じる</button>
                </div>
            </div>
        `;
        
        modal.className = 'modal';
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
        
        document.body.appendChild(modal);
    }
}

// グローバル関数として公開
window.runSystemTest = async function() {
    const tester = new HakusanSystemTester();
    return await tester.runCompleteSystemTest();
};

console.log('🔧 システムテスター読み込み完了 - window.runSystemTest() で実行可能');
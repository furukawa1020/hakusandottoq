# 白山地域探索システム - README

## 🚀 Netlifyデプロイ用最適化完了

このプロジェクトはNetlifyでの高速デプロイと最適パフォーマンスのために設計されています。

## 📋 最適化内容

### 🔧 Netlify設定
- **netlify.toml**: 完全な設定ファイル
- **_redirects**: SPA用リダイレクト設定
- **Edge Functions**: 軽量アナリティクス実装

### ⚡ パフォーマンス最適化
- **プリロード**: 重要リソースの先読み
- **DNS Prefetch**: 外部リソースの事前解決
- **Module Preload**: JavaScript モジュールの最適化
- **Service Worker**: Netlify CDN対応キャッシュ戦略

### 🛡️ セキュリティ強化
- **CSP**: Content Security Policy設定
- **セキュリティヘッダー**: XSS/Clickjacking対策
- **CORS**: 適切なオリジン制御

### 📱 PWA最適化
- **Manifest**: 完全なPWAマニフェスト
- **Icons**: SVG形式での最適化
- **キャッシュ戦略**: オフライン対応

## 🎯 デプロイ手順

### 1. Netlifyアカウント準備
```bash
npm install -g @netlify/cli
netlify login
```

### 2. サイト作成
```bash
netlify init
```

### 3. デプロイ
```bash
# プレビューデプロイ
netlify deploy

# 本番デプロイ
netlify deploy --prod
```

## 📊 パフォーマンス機能

### Edge Functions
- `/api/analytics` - 軽量アナリティクス
- 高速レスポンス（<100ms）
- 地理的分散処理

### キャッシュ戦略
- **静的リソース**: 30日キャッシュ
- **動的コンテンツ**: 7日キャッシュ
- **API**: 30分キャッシュ
- **画像**: 90日キャッシュ

## 🔍 モニタリング

### 自動チェック
- **Lighthouse**: パフォーマンス監視
- **Bundle Size**: リソースサイズ監視
- **HTML Validation**: マークアップ検証

### メトリクス目標
- **Lighthouse Score**: 95+
- **FCP**: <1.5s
- **LCP**: <2.5s
- **CLS**: <0.1

## 🌐 環境変数

Netlify管理画面で設定：
```
SITE_URL=https://hakusan-exploration.netlify.app
ANALYTICS_ENABLED=true
DEBUG_MODE=false
```

## 📁 ファイル構成

```
/
├── netlify.toml          # Netlify設定
├── _redirects            # リダイレクト設定
├── package.json          # NPM設定
├── manifest.json         # PWAマニフェスト
├── sw.js                 # Service Worker
├── netlify/
│   └── edge-functions/   # Edge Functions
└── ...                   # アプリケーションファイル
```

## 🎮 機能

- **RPGマップ**: 白山.png基準の地理的マップ
- **バッジ収集**: 8地域のバッジシステム
- **ARカメラ**: 写真撮影・バッジ合成
- **SNS共有**: Twitter/LINE/Instagram対応
- **オフライン対応**: Service Worker実装

## 🚦 ステータス

✅ Netlify最適化完了  
✅ セキュリティ強化  
✅ パフォーマンス最適化  
✅ PWA対応  
✅ モバイル最適化  

## 📞 サポート

問題やご質問は [Issues](https://github.com/furukawa1020/hakusandottoq/issues) までお願いします。
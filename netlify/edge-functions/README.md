# Netlify Edge Functions

これらの関数はNetlify Edgeで実行され、高速なレスポンスとパフォーマンス最適化を提供します。

## ファイル構成

- `analytics.js` - 軽量アナリティクス処理
- `badge-proxy.js` - バッジデータプロキシ
- `photo-optimizer.js` - 画像最適化

## 使用方法

これらの関数は自動的にNetlifyによってデプロイされ、以下のエンドポイントで利用可能になります：

- `/api/analytics` - アナリティクスデータ処理
- `/api/badge/*` - バッジ関連API
- `/api/photos/*` - 写真最適化API

## 開発

```bash
netlify dev
```

でローカル開発環境を起動できます。
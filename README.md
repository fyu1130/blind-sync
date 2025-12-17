# Blind Sync

合コンを盛り上げるための相性計測対話システム  
HTML / CSS / JavaScript（フレームワークなし）

## 構成

- entry.html : 参加者登録
- questions.html : 質問回答
- result.html : 結果表示

## 起動方法

entry.html をブラウザで開く

## ディレクトリ構成

```ディレクトリ構成
blind-sync/
├── entry.html        # 参加者登録（チャットUI）
├── questions.html   # 質問ページ
├── result.html      # 結果ページ
├── css/
│   └── style.css
├── js/
│   ├── entry.js
│   ├── questions.js
│   ├── result.js
│   ├── logic.js     # 相性計算
│   └── data.js      # 質問・初期点（仮）
├── data/
│   ├── questions.json
│   ├── initial_scores.json
│   └── advice.json
└── README.md
```

## JS の役割

| ファイル     | 役割                          |
| ------------ | ----------------------------- |
| entry.js     | 参加者登録・localStorage 保存 |
| questions.js | 質問進行・回答保存            |
| logic.js     | 相性計算（純ロジック）        |
| result.js    | 結果描画                      |
| data.js      | 質問・初期点データ            |

## データ

| データ | key            |
| ------ | -------------- |
| 参加者 | `participants` |
| 質問   | `questions`    |
| 回答   | `answers`      |
| 結果   | `results`      |

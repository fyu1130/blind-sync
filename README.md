# Blind Sync

合コンを盛り上げるための相性計測対話システム  
HTML / CSS / JavaScript（フレームワークなし）

## 構成

- entry.html : 参加者登録
- questions.html : 質問回答
- result.html : 結果表示

## 起動方法

python3 -m http.server 8000
entry.html をブラウザで開く

## ディレクトリ構成

```ディレクトリ構成
blind-sync/
├── entry.html        # 参加者登録（チャットUI）
├── questions.html   # 質問ページ
├── result.html      # 結果ページ
├── css/
│   ├── common.css
│   ├── entry.css
│   ├── questions.css
│   └── result.css
├── js/
│   ├── entry.js
│   ├── questions.js
│   └── result.js
├── data/
│   ├── questions.json
│   ├── initial_scores/
│   │   ├ time.json
│   │   ├ money.json
│   │   ├ social.json
│   │   └ lifestyle.json
│   └── advice.json
└── README.md
```

## 残りのタスク

- 改善：UI 改善（特に質問ページ、言葉や取捨選択など）
- 改善：結果ページのアコーディオンメニューを正確にすべての組み合わせで表示されるように
- 追加機能：結果ページへ質問リスト、ユーザごとの回答を表示
- 追加機能：相性バーの色を高得点や低い得点で変更＆結果発表アニメーション？？
- 追加機能：お酒の加点も追加？？
- 確認：初期点、質問、アドバイスがみんなの考えたものと一致しているかの確認

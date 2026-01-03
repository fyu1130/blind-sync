# Blind Sync

🍸 **Blind Sync** は、合コンやグループ飲み会を盛り上げるための  
**MBTI × 質問回答 × 相性スコア** を用いた相性計測対話システムです。

フレームワークを使用せず、  
**HTML / CSS / Vanilla JavaScript** のみで実装されています。

---

## コンセプト

- 4 人で参加
- MBTI の初期相性 × 実際の価値観回答
- 数値とビジュアルで「相性」を可視化
- 合コンで自然に会話が生まれる設計

<img width="2175" height="1303" alt="image" src="https://github.com/user-attachments/assets/4398fef3-e85b-4555-b315-01ef3b5a7558" />

## 主な機能

### ① 参加者登録（entry.html）

- 4 人分の
  - ニックネーム
  - MBTI
  - 好きなお酒
- チャット UI 形式で入力
- localStorage に保存

---

### ② 質問回答（questions.html）

- カテゴリー：  
  **money / time / lifestyle / social**
- 各カテゴリーから **ランダムで 1 問ずつ出題**
- 各質問は **4 択**
- 各参加者が **一気に 4 問すべて回答**
- 回答結果は localStorage に保存

---

### ③ 相性計算 & 結果表示（result.html）

- 4 人 → **6 ペア** を自動生成
- 各ペアについて：
  - MBTI 初期相性スコア（JSON 定義）
  - 質問回答一致数（1 一致 +5 点）
- **正規化は行わず、合計点をそのまま％として表示**
- 相性スコア = 初期相性（4 カテゴリ合計） + 質問一致ボーナス
- 相性ランキングをゲージバーで表示
- クリックで MBTI 組み合わせ別アドバイスを表示

---

## ▶ 起動方法

### 1. ローカルサーバを起動

```bash
python3 -m http.server 8000
```

### 2. ブラウザでアクセス

```bash
http://localhost:8000/entry.html
```

※ file:// 直開きでは JSON 読み込みが失敗するため、必ずローカルサーバ経由で起動

---

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

---

## 技術スタック

- HTML
- CSS
- JavaScript
- データ＝ JSON ベース

---

## 残りのタスク

- 改善：UI 改善（特に質問ページ、言葉や取捨選択など）
- 追加機能：お酒の加点も追加？？
- 確認：初期点、質問、アドバイスがみんなの考えたものと一致しているかの確認

## JSON データ仕様

### questions.json

| キー                              | 型    | 内容               |
| --------------------------------- | ----- | ------------------ |
| money / time / lifestyle / social | Array | カテゴリ別質問配列 |

- 質問オブジェクト
  | キー | 型 | 内容 |
  | ------- | -------- | ------ |
  | id | string | 質問 ID |
  | text | string | 質問文 |
  | options | string[] | 4 択の選択肢 |

### initial_scores/\*.json

```json
{
  "category": "money",
  "scores": {
    "INTJ": {
      "INTJ": 16,
      "ESFJ": 19
    }
  }
}
```

| キー     | 型     | 内容                     |
| -------- | ------ | ------------------------ |
| category | string | カテゴリ名               |
| scores   | object | MBTI × MBTI の相性スコア |

### advice.json

```json
{
  "ENFJ_ENFP": "テンションも感情も爆一致🌈🔥 ..."
}
```

※ 同タイプ・異タイプを含めた設計, 向きは A_B のみ（B_A は不要）

## localStorage 仕様

### participants

```json
[{ "id": 1, "name": "yushiro", "mbti": "ISFP", "drink": "beer" }]
```

| キー  | 内容       |
| ----- | ---------- |
| id    | 登録順 ID  |
| name  | 名前       |
| mbti  | MBTI       |
| drink | 好きなお酒 |

### answers

```json
{
  "money": [[0, 1, 2, 3]]
}
```

| 構造     | 内容                                 |
| -------- | ------------------------------------ |
| category | 質問カテゴリ                         |
| 配列     | 各質問の「4 人分の回答インデックス」 |

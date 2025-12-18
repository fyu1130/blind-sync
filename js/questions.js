// ==============================
// questions.js（カテゴリから1問ずつランダム抽選 / 参加者が4問連続回答）
// ==============================

const CATEGORIES = ["money", "time", "lifestyle", "social"];
const TOTAL_QUESTIONS = 4; // 1カテゴリ1問ずつ

// ---------- DOM（questions.html 側に用意してね）----------
// 必須: <div id="questionArea"></div> だけあれば動くように作ってある
const root = document.getElementById("questionArea") || document.body;

// ---------- localStorage ----------
const participantsRaw = localStorage.getItem("participants");
const participants = participantsRaw ? JSON.parse(participantsRaw) : null;

if (!participants || !Array.isArray(participants) || participants.length !== 4) {
  alert("参加者データが見つかりません。entry.html からやり直してください。");
  location.href = "entry.html";
}

// answers の保存形式（result.js互換）
// answers = {
//   money:      [ [p0,p1,p2,p3] ],
//   time:       [ [p0,p1,p2,p3] ],
//   lifestyle:  [ [p0,p1,p2,p3] ],
//   social:     [ [p0,p1,p2,p3] ],
// }
// ※今回は各カテゴリ「1問だけ」なので、配列の中に1つだけ入れる
const answers = {};
CATEGORIES.forEach((cat) => {
  answers[cat] = [Array(4).fill(null)];
});

// 表示用に選ばれた質問を保存（結果ページで見せたい場合に使える）
const selectedQuestions = {}; // { money: {id,text,options}, ... }

// ---------- fetch helper ----------
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} が読み込めません（${res.status}）`);
  return res.json();
}

// ---------- ランダム抽選 ----------
function pickOneRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- UI描画 ----------
function renderScreen(state) {
  const { currentParticipantIndex, currentQuestionIndex, questionsByCategory } = state;

  const p = participants[currentParticipantIndex];
  const cat = CATEGORIES[currentQuestionIndex];
  const q = questionsByCategory[cat];

  root.innerHTML = `
    <div class="container">
      <div class="card">
        <h1 style="margin: 8px 0 12px;">❓ 質問タイム</h1>

        <div style="opacity:.9; margin-bottom: 10px;">
          <strong>参加者：</strong>${currentParticipantIndex + 1}/4（${escapeHTML(p.name)} / ${escapeHTML(p.mbti)}）
          <br/>
          <strong>質問：</strong>${currentQuestionIndex + 1}/4（${cat.toUpperCase()}）
        </div>

        <div style="background:#2f314d; border-radius:14px; padding:14px; margin: 10px 0;">
          <div style="font-weight:700; margin-bottom:8px;">${escapeHTML(q.text)}</div>
          <div id="optionsArea" style="display:grid; gap:10px; margin-top:12px;"></div>
        </div>

        <div style="opacity:.75; font-size: 14px;">
          ※ 4択から1つ選んでください（Yes/Noではありません）
        </div>
      </div>
    </div>
  `;

  const optionsArea = document.getElementById("optionsArea");

  q.options.forEach((optText, optIndex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${optIndex + 1}. ${optText}`;
    btn.style.cssText = `
      width: 100%;
      text-align: left;
      border: none;
      border-radius: 10px;
      padding: 12px 14px;
      cursor: pointer;
      font-weight: 700;
      background: #222b45;
      color: white;
    `;

    btn.addEventListener("mouseenter", () => {
      btn.style.filter = "brightness(1.08)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.filter = "none";
    });

    btn.addEventListener("click", () => onChooseOption(state, cat, optIndex));
    optionsArea.appendChild(btn);
  });
}

// ---------- 回答処理 ----------
function onChooseOption(state, category, optIndex) {
  const pIndex = state.currentParticipantIndex;
  const qIndex = 0; // 各カテゴリ1問だけなので常に0番

  // 回答を保存（optIndexを格納：0〜3）
  answers[category][qIndex][pIndex] = optIndex;

  // 次へ進む
  if (state.currentQuestionIndex < TOTAL_QUESTIONS - 1) {
    state.currentQuestionIndex++;
    renderScreen(state);
    return;
  }

  // この参加者の4問が終了 → 次の参加者へ
  if (state.currentParticipantIndex < participants.length - 1) {
    state.currentParticipantIndex++;
    state.currentQuestionIndex = 0;
    renderScreen(state);
    return;
  }

  // 全員終了 → 保存して結果へ
  localStorage.setItem("answers", JSON.stringify(answers));
  localStorage.setItem("questions", JSON.stringify(selectedQuestions)); // 表示用（任意）
  location.href = "result.html";
}

// ---------- HTMLエスケープ ----------
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- 初期化 ----------
(async function init() {
  try {
    // 質問リスト読み込み（ユーザーの提示JSONに合わせる）
    // 例: data/questions.json
    const all = await loadJSON("data/questions.json");

    // 各カテゴリ3問から1問ずつ抽選
    const questionsByCategory = {};
    CATEGORIES.forEach((cat) => {
      if (!all[cat] || !Array.isArray(all[cat]) || all[cat].length === 0) {
        throw new Error(`questions.json の ${cat} が見つかりません`);
      }
      const picked = pickOneRandom(all[cat]);
      questionsByCategory[cat] = picked;
      selectedQuestions[cat] = picked;
    });

    // 状態
    const state = {
      currentParticipantIndex: 0,
      currentQuestionIndex: 0,
      questionsByCategory,
    };

    renderScreen(state);
  } catch (e) {
    console.error(e);
    alert(`質問データの読み込みに失敗しました。\n${e.message}`);
  }
})();

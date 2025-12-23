// ==============================
// result.js（完全版）
// ==============================

// ---------- localStorage ----------
const participants = JSON.parse(localStorage.getItem("participants"));
const answers = JSON.parse(localStorage.getItem("answers"));
const selectedQuestions = JSON.parse(localStorage.getItem("questions"));

if (!participants || !answers || !selectedQuestions) {
  alert("データが見つかりません。entry → questions からやり直してください。");
  throw new Error("missing localStorage data");
}

// ---------- MBTI正規化 ----------
function normalizeMBTI(mbti) {
  return String(mbti).trim().toUpperCase();
}

// ---------- MBTIペアキー ----------
function makeAdviceKey(a, b) {
  return [a, b].sort().join("_");
}

// ---------- JSON読み込み ----------
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} が読み込めません`);
  return res.json();
}

// ---------- 初期化 ----------
async function init() {
  const scoreMaps = {
    money: await loadJSON("data/initial_scores/money.json"),
    time: await loadJSON("data/initial_scores/time.json"),
    lifestyle: await loadJSON("data/initial_scores/lifestyle.json"),
    social: await loadJSON("data/initial_scores/social.json"),
  };

  const adviceMap = await loadJSON("data/advice.json");

  run(scoreMaps, adviceMap);
}

// ---------- ペア生成 ----------
function generatePairs(users) {
  const pairs = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      pairs.push([users[i], users[j]]);
    }
  }
  return pairs;
}

// ---------- 質問一致数 ----------
function countMatches(category, i, j) {
  if (!answers[category]) return 0;
  return answers[category].filter(q => q[i] === q[j]).length;
}

// ---------- スコア計算 ----------
function calculate(pair, maps, adviceMap) {
  const [a, b] = pair;
  const mbtiA = normalizeMBTI(a.mbti);
  const mbtiB = normalizeMBTI(b.mbti);

  let total = 0;

  ["money", "time", "lifestyle", "social"].forEach(cat => {
    total += maps[cat].scores[mbtiA][mbtiB];
    total += countMatches(cat, a.index, b.index) * 5;
  });

  return {
    pair: `${a.name} × ${b.name}`,
    mbti: `${mbtiA} × ${mbtiB}`,
    score: total,
    advice: adviceMap[makeAdviceKey(mbtiA, mbtiB)] || "アドバイス準備中",
  };
}

// ---------- 質問＋回答サマリー描画 ----------
function renderQASummary(users) {
  const root = document.getElementById("qaSummary");
  const categories = ["money", "time", "lifestyle", "social"];

  root.innerHTML = categories.map(cat => {
    const q = selectedQuestions[cat];   // ← ランダムで選ばれた質問
    const ans = answers[cat][0];        // ← 4人分の回答

    const rows = users.map((u, i) => `
      <tr>
        <td>${u.name}</td>
        <td>${q.options[ans[i]]}</td>
      </tr>
    `).join("");

    return `
      <div class="qaBlock">
        <div class="qaCategory">${cat.toUpperCase()}</div>
        <div class="qaQuestion">Q. ${q.text}</div>
        <table class="qaTable">
          ${rows}
        </table>
      </div>
    `;
  }).join("");
}

// ---------- バー色 ----------
function getBarClass(score) {
  if (score >= 90) return "high";
  if (score >= 45) return "mid";
  return "low";
}

// ---------- 実行 ----------
function run(scoreMaps, adviceMap) {
  const users = participants.map((p, i) => ({
    ...p,
    index: i,
    mbti: normalizeMBTI(p.mbti),
  }));

  renderQASummary(users);

  const results = generatePairs(users)
    .map(p => calculate(p, scoreMaps, adviceMap))
    .sort((a, b) => b.score - a.score);

  renderResults(results);
}

// ---------- ランキング描画 ----------
function renderResults(results) {
  const root = document.getElementById("result");
  root.innerHTML = "";

  results.forEach((r, i) => {
    const barWidth = Math.min(r.score, 150);

    root.innerHTML += `
      <div class="resultRow">
        <div class="resultHeader">
          <div class="rank">${i + 1}位｜${r.pair}</div>
          <div class="gaugeWrapper">
            <div class="gauge ${getBarClass(r.score)}" style="width:${barWidth}%"></div>
          </div>
          <div class="score">${r.score}%</div>
        </div>
        <div class="resultDetail">
          <strong>MBTI：</strong>${r.mbti}<br />
          ${r.advice}
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".resultRow").forEach(row => {
    row.addEventListener("click", () => row.classList.toggle("open"));
  });
}

// ---------- 開始 ----------
init();

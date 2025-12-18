// ==============================
// result.js（最終・完全安定版）
// ==============================

// ---------- localStorage ----------
const participants = JSON.parse(localStorage.getItem("participants"));
const answers = JSON.parse(localStorage.getItem("answers"));

if (!participants || !answers) {
  alert("データが見つかりません。entry からやり直してください。");
  throw new Error("missing localStorage data");
}

// ---------- MBTI正規化 ----------
function normalizeMBTI(mbti) {
  return String(mbti).trim().toUpperCase();
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

  let match = 0;
  for (let q = 0; q < answers[category].length; q++) {
    if (answers[category][q][i] === answers[category][q][j]) {
      match++;
    }
  }
  return match;
}

// ---------- スコア計算 ----------
function calculate(pair, maps, adviceMap) {
  const [a, b] = pair;

  const mbtiA = normalizeMBTI(a.mbti);
  const mbtiB = normalizeMBTI(b.mbti);

  let total = 0;

  ["money", "time", "lifestyle", "social"].forEach(cat => {
    const scoreTable = maps[cat].scores;

    // ---- ガード（ここが超重要）----
    if (!scoreTable[mbtiA] || !scoreTable[mbtiA][mbtiB]) {
      console.warn("Missing score:", cat, mbtiA, mbtiB);
      return;
    }

    total += scoreTable[mbtiA][mbtiB];
    total += countMatches(cat, a.index, b.index) * 5;
  });

  return {
    pair: `${a.name} × ${b.name}`,
    mbti: `${mbtiA} × ${mbtiB}`,
    score: total,
    advice: adviceMap[`${mbtiA}_${mbtiB}`] || "アドバイス準備中"
  };
}

// ---------- 実行 ----------
function run(scoreMaps, adviceMap) {
  const users = participants.map((p, i) => ({
    ...p,
    index: i,
    mbti: normalizeMBTI(p.mbti),
  }));

  const pairs = generatePairs(users);

  const results = pairs
    .map(p => calculate(p, scoreMaps, adviceMap))
    .sort((a, b) => b.score - a.score);

  render(results);
}

// ---------- 描画 ----------
function render(results) {
  const root = document.getElementById("result");

  results.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "resultRow";

    const barWidth = Math.min(r.score, 150);

    row.innerHTML = `
      <div class="resultHeader">
        <div class="rank">${i + 1}位｜${r.pair}</div>
        <div class="gaugeWrapper">
          <div class="gauge" style="width:${barWidth}%"></div>
        </div>
        <div class="score">${r.score}%</div>
      </div>

      <div class="resultDetail">
        <strong>MBTI：</strong>${r.mbti}<br />
        ${r.advice}
      </div>
    `;

    row.addEventListener("click", () => {
      row.classList.toggle("open");
    });

    root.appendChild(row);
  });
}


// ---------- 開始 ----------
init();

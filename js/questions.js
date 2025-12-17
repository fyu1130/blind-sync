// =====================
// load participants
// =====================
const saved = localStorage.getItem("participants");

if (!saved) {
  alert("参加者データがありません。entryからやり直してください。");
  location.href = "entry.html";
}

let participants;
try {
  participants = JSON.parse(saved);
} catch {
  alert("参加者データが壊れています。entryからやり直してください。");
  location.href = "entry.html";
}

if (!Array.isArray(participants) || participants.length !== 4) {
  alert("参加者データが不正です。4人登録してください。");
  location.href = "entry.html";
}

// =====================
// 仮質問（Phase 2でDBに置換）
// =====================
const questions = [
  "お金は貯める派？",
  "時間はきっちり派？",
  "家で過ごすのが好き？",
  "初対面でも話せる？"
];

// =====================
// state
// =====================
let p = 0; // person index
let q = 0; // question index

// 回答の器（Phase 2以降で使う）
const answers = {}; 
participants.forEach(p => {
  answers[p.name] = [];
});

// =====================
// DOM
// =====================
const personEl = document.getElementById("currentPerson");
const questionEl = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");

const options = ["はい", "いいえ"];

// =====================
// render
// =====================
function render() {
  const person = participants[p];

  personEl.textContent = `🎤 ${person.name}さんの番です`;
  questionEl.textContent = questions[q];
  progressEl.textContent = `${p + 1}人目 / ${participants.length}人`;

  optionsEl.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "optionBtn";
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt);
    optionsEl.appendChild(btn);
  });
}

// =====================
// answer handler
// =====================
function handleAnswer(answer) {
  const person = participants[p];
  answers[person.name].push(answer);

  if (q < questions.length - 1) {
    q++;
  } else if (p < participants.length - 1) {
    p++;
    q = 0;
  } else {
    // Phase 2で構造を確定させる
    localStorage.setItem("answers", JSON.stringify(answers));
    location.href = "result.html";
    return;
  }

  render();
}

// =====================
// start
// =====================
render();

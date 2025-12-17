// js/entry.js
const chat = document.getElementById("chatWindow");
const nameInput = document.getElementById("nameInput");
const mbtiInput = document.getElementById("mbtiInput");
const drinkInput = document.getElementById("drinkInput");
const sendBtn = document.getElementById("sendBtn");

const TOTAL = 4;

const MBTIS = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

const DRINKS = [
  { label: "ビール", value: "beer" },
  { label: "カクテル", value: "cocktail" },
  { label: "韓国酒・マッコリ", value: "korean" },
  { label: "ノンアル", value: "nonalcohol" },
  { label: "日本酒", value: "sake" },
  { label: "焼酎", value: "shochu" },
  { label: "サワー", value: "sour" },
  { label: "梅酒", value: "umeshu" },
  { label: "ウイスキー", value: "whisky" },
  { label: "ワイン", value: "wine" },
];

// =====================
// UI helpers
// =====================
function addMsg(msg, who = "bot") {
  const div = document.createElement("div");
  div.className = who === "bot" ? "bot" : "user";
  div.textContent = msg;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setSelectOptions(selectEl, placeholder, items) {
  selectEl.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholder;
  selectEl.appendChild(ph);

  items.forEach((it) => {
    const opt = document.createElement("option");
    if (typeof it === "string") {
      opt.value = it;
      opt.textContent = it;
    } else {
      opt.value = it.value;
      opt.textContent = it.label;
    }
    selectEl.appendChild(opt);
  });
}

// =====================
// state
// =====================
let participants = [];

function loadSaved() {
  const saved = localStorage.getItem("participants");
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveParticipants() {
  localStorage.setItem("participants", JSON.stringify(participants));
}

function clearInputs() {
  nameInput.value = "";
  mbtiInput.value = "";
  drinkInput.value = "";
  nameInput.focus();
}

// =====================
// init
// =====================
(function init() {
  // 回答・質問データのみ初期化（participantsは消さない）
  localStorage.removeItem("answers");
  localStorage.removeItem("questions");

  participants = loadSaved();

  setSelectOptions(mbtiInput, "MBTI", MBTIS);
  setSelectOptions(drinkInput, "お酒", DRINKS);

  addMsg("🍸 Blind Sync へようこそ！");

  if (participants.length === 0) {
    addMsg("Bot: 参加者1人目の名前・MBTI・好きなお酒を教えてね！");
  } else if (participants.length < TOTAL) {
    addMsg(`Bot: 続きから再開します。参加者${participants.length + 1}人目を教えてね！`);
  } else {
    addMsg("Bot: すでに全員登録済みです。質問ページへ進みます！");
    setTimeout(() => {
      location.href = "questions.html";
    }, 800);
  }
})();

// =====================
// main action
// =====================
function handleNext() {
  const name = nameInput.value.trim();
  const mbti = mbtiInput.value;
  const drink = drinkInput.value;

  if (!name || !mbti || !drink) {
    alert("名前・MBTI・お酒をすべて入力してください🍷");
    return;
  }

  const newUser = {
    id: participants.length + 1,
    name,
    mbti,
    drink,
  };

  participants.push(newUser);
  saveParticipants();

  // チャット反映
  addMsg(`👤 ${name}（${mbti} × ${drink}）`, "user");
  addMsg(`✅ ${name} を登録しました！`);

  if (participants.length < TOTAL) {
    addMsg(`Bot: 次の参加者 ${participants.length + 1} 人目を教えてね！`);
    clearInputs();
  } else {
    addMsg("🎯 全員の入力が完了しました！質問ページへ移動します…");
    setTimeout(() => {
      location.href = "questions.html";
    }, 1000);
  }
}

sendBtn.addEventListener("click", handleNext);

// Enterキー対応
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleNext();
});

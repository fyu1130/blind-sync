const chat = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

let count = 0;
const TOTAL = 4;

function addBot(msg) {
  const div = document.createElement("div");
  div.className = "bot";
  div.textContent = msg;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addUser(msg) {
  const div = document.createElement("div");
  div.className = "user";
  div.textContent = msg;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

addBot("🍸 Blind Syncへようこそ！");
addBot("参加者1人目の情報を入力してね");

sendBtn.addEventListener("click", () => {
  addUser("入力しました！");
  count++;

  if (count < TOTAL) {
    addBot(`次の参加者 ${count + 1} 人目を入力してね`);
  } else {
    addBot("🎯 全員入力完了！質問ページへ進みます…");
    setTimeout(() => {
      location.href = "questions.html";
    }, 1200);
  }
});

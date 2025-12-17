const persons = ["A", "B", "C", "D"];
const questions = [
  "お金は貯める派？",
  "時間はきっちり派？",
  "家で過ごすのが好き？",
  "初対面でも話せる？"
];

let p = 0;
let q = 0;

const personEl = document.getElementById("currentPerson");
const questionEl = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");

const options = ["はい", "いいえ"];

function render() {
  personEl.textContent = `🎤 ${persons[p]}さんの番です`;
  questionEl.textContent = questions[q];
  progressEl.textContent = `${p + 1}人目 / ${persons.length}人`;

  optionsEl.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "optionBtn";
    btn.textContent = opt;
    btn.onclick = next;
    optionsEl.appendChild(btn);
  });
}

function next() {
  if (q < questions.length - 1) {
    q++;
  } else if (p < persons.length - 1) {
    p++;
    q = 0;
  } else {
    location.href = "result.html";
    return;
  }
  render();
}

render();

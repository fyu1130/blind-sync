const ranking = document.getElementById("ranking");

const dummyResults = [
  { pair: "A × B", score: 82 },
  { pair: "A × C", score: 74 },
  { pair: "B × C", score: 68 },
  { pair: "A × D", score: 60 },
  { pair: "B × D", score: 55 },
  { pair: "C × D", score: 48 },
];

dummyResults.forEach(r => {
  const row = document.createElement("div");
  row.className = "resultRow";

  row.innerHTML = `
    <div class="pair">${r.pair}</div>
    <div class="gaugeWrapper">
      <div class="gauge" style="width:${r.score}%"></div>
    </div>
    <div class="score">${r.score}%</div>
  `;

  ranking.appendChild(row);
});

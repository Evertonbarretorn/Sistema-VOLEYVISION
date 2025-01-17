document.addEventListener("DOMContentLoaded", async function () {
  async function carregarRanking() {
    try {
      const response = await fetch("http://localhost:3000/ranking");
      const dadosRanking = await response.json();

      const rankingList = document.querySelector(".ranking-list");

      rankingList.innerHTML = "";

      dadosRanking.forEach((time, index) => {
        const item = document.createElement("li");
        item.classList.add("item-ranking");

        if (index === 0) item.classList.add("primeiro-lugar");
        if (index === 1) item.classList.add("segundo-lugar");
        if (index === 2) item.classList.add("terceiro-lugar");

        item.innerHTML = `
          <img src="/IMG/medalha-de-${
            index === 0 ? "ouro" : index === 1 ? "prata" : "bronze"
          }.png" alt="Medalha de ${
          index === 0 ? "ouro" : index === 1 ? "prata" : "bronze"
        }" class="medalha-icon">
          <strong>${time.nome_time}</strong> - ${
          time.total_sets_ganhos
        } Sets Ganhos
        `;

        rankingList.appendChild(item);
      });
    } catch (error) {
      console.error("Erro ao carregar o ranking:", error);
    }
  }

  window.onload = carregarRanking;

  carregarRanking();
});

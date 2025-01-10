document.addEventListener("DOMContentLoaded", async function () {
  async function carregarRanking() {
    try {
      const response = await fetch("/ranking");
      if (!response.ok) {
        throw new Error("Erro ao buscar o ranking");
      }

      const ranking = await response.json();

      const rankingList = document.querySelector(".ranking-list");

      rankingList.innerHTML = "";

      ranking.forEach((time, index) => {
        const li = document.createElement("li");
        li.classList.add("item-ranking");
        switch (index) {
          case 0:
            li.classList.add("primeiro-lugar");
            break;
          case 1:
            li.classList.add("segundo-lugar");
            break;
          case 2:
            li.classList.add("terceiro-lugar");
            break;
        }

        li.innerHTML = `
            <img
              src="/IMG/medalha-de-${
                index === 0 ? "ouro" : index === 1 ? "prata" : "bronze"
              }.png"
              alt="Medalha de ${
                index === 0 ? "ouro" : index === 1 ? "prata" : "bronze"
              }"
              class="medalha-icon"
            />
            <strong>${time.nome_time}</strong> - ${time.total_sets_ganhos} sets
          `;

        rankingList.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar o ranking");
    }
  }

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

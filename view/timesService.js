function preencherTabela(dados) {
  const tabelaBody = document.getElementById("tbody-estatisticas");

  tabelaBody.innerHTML = "";

  dados.forEach((linha) => {
    const eficiencia_saque =
      linha.eficiencia_saque !== null && linha.eficiencia_saque !== undefined
        ? parseFloat(linha.eficiencia_saque)
        : 0;
    const eficiencia_ataque =
      linha.eficiencia_ataque !== null && linha.eficiencia_ataque !== undefined
        ? parseFloat(linha.eficiencia_ataque)
        : 0;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${linha.nome_time}</td>
      <td>${linha.total_sets}</td>
      <td>${linha.total_ponto_saque}</td>
      <td>${linha.total_ponto_ataque}</td>
      <td>${linha.total_ponto_bloqueio}</td>
      <td>${linha.total_erros_saque}</td>
      <td>${linha.total_erros_ataque}</td>
      <td>${eficiencia_saque.toFixed(
        2
      )}%</td> <!-- Garantindo que é um número -->
      <td>${eficiencia_ataque.toFixed(
        2
      )}%</td> <!-- Garantindo que é um número -->
    `;

    tabelaBody.appendChild(tr);
  });
}

function buscarEstatisticas() {
  fetch("http://localhost:3000/estatisticas")
    .then((response) => response.json())
    .then((dados) => preencherTabela(dados))
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      const tabela = document.getElementById("tbody-estatisticas");
      tabela.innerHTML =
        "<tr><td colspan='9'>Erro ao carregar dados. Tente novamente mais tarde.</td></tr>";
    });
}

document.addEventListener("DOMContentLoaded", buscarEstatisticas);

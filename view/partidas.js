document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("tbody");
  const formCadastro = document.getElementById("formCadastrarEditar");
  const botaoSalvar = document.getElementById("botaoSalvar");
  let idPartidaEditando = null;

  if (!formCadastro || !tabela) {
    console.error("Erro ao carregar os elementos do DOM.");
    return;
  }

  listarPartidas();

  formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const local_partida = document.getElementById("local_partida").value;
    const data_partida = document.getElementById("data_partida").value;
    const hora_partida = document.getElementById("hora_partida").value;
    const id_time_a = document.getElementById("id_time_a").value;
    const id_time_b = document.getElementById("id_time_b").value;
    const id_vencedor = document.getElementById("id_vencedor").value;
    const sets_vencidos_a = document.getElementById("sets_vencidos_a").value;
    const sets_vencidos_b = document.getElementById("sets_vencidos_b").value;
    const status_partida = document.getElementById("status_partida").value;
    const ponto_saque_a = document.getElementById("ponto_saque_a").value;
    const ponto_saque_b = document.getElementById("ponto_saque_b").value;
    const ponto_ataque_a = document.getElementById("ponto_ataque_a").value;
    const ponto_ataque_b = document.getElementById("ponto_ataque_b").value;
    const ponto_bloqueio_a = document.getElementById("ponto_bloqueio_a").value;
    const ponto_bloqueio_b = document.getElementById("ponto_bloqueio_b").value;
    const erro_saque_a = document.getElementById("erro_saque_a").value;
    const erro_saque_b = document.getElementById("erro_saque_b").value;
    const erro_ataque_a = document.getElementById("erro_ataque_a").value;
    const erro_ataque_b = document.getElementById("erro_ataque_b").value;

    const partidaValida = await validarHorario(data_partida, hora_partida);
    if (!partidaValida) {
      alert(
        "Já existe uma partida nesse horário ou em um intervalo menor que 40 minutos."
      );
      return;
    }

    try {
      const partida = {
        local_partida,
        data_partida,
        hora_partida,
        id_time_a,
        id_time_b,
        id_vencedor,
        sets_vencidos_a,
        sets_vencidos_b,
        status_partida,
        ponto_saque_a,
        ponto_ataque_a,
        ponto_bloqueio_a,
        erro_saque_a,
        erro_ataque_a,
        ponto_saque_b,
        ponto_ataque_b,
        ponto_bloqueio_b,
        erro_saque_b,
        erro_ataque_b,
      };

      const url = idPartidaEditando
        ? `http://localhost:3000/partidas/${idPartidaEditando}`
        : "http://localhost:3000/partidas";

      const response = await fetch(url, {
        method: idPartidaEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partida),
      });

      if (!response.ok) throw new Error("Erro ao salvar a partida.");

      alert(
        `Partida ${
          idPartidaEditando ? "atualizada" : "cadastrada"
        } com sucesso!`
      );
      formCadastro.reset();
      idPartidaEditando = null;
      botaoSalvar.textContent = "Cadastrar";
      listarPartidas();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar a partida.");
    }
  });

  async function listarPartidas() {
    try {
      const responsePartidas = await fetch("http://localhost:3000/partidas");
      if (!responsePartidas.ok) {
        throw new Error(
          `Erro HTTP ao obter partidas: ${responsePartidas.status}`
        );
      }
      const partidas = await responsePartidas.json();

      const responseTimes = await fetch("http://localhost:3000/times");
      if (!responseTimes.ok) {
        throw new Error(`Erro HTTP ao obter times: ${responseTimes.status}`);
      }
      const times = await responseTimes.json();

      const mapaTimes = {};
      times.forEach((time) => {
        mapaTimes[time.id_time] = time.nome_time;
      });

      tabela.innerHTML = "";

      partidas.forEach((partida) => {
        const data_partida = new Date(partida.data_partida).toLocaleDateString(
          "pt-BR"
        );
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${partida.id_partida}</td>
          <td>${partida.local_partida}</td>
          <td>${data_partida}</td>
          <td>${partida.hora_partida}</td>
          <td>${mapaTimes[partida.id_time_a]}</td>
          <td>${mapaTimes[partida.id_time_b]}</td>
          <td>${mapaTimes[partida.id_vencedor] || "Não definido"}</td>
          <td>${partida.sets_vencidos_a}</td>
          <td>${partida.sets_vencidos_b}</td>
          <td>${partida.ponto_saque_a}</td>
          <td>${partida.ponto_saque_b}</td>
          <td>${partida.ponto_ataque_a}</td>
          <td>${partida.ponto_ataque_b}</td>
          <td>${partida.ponto_bloqueio_a}</td>
          <td>${partida.ponto_bloqueio_b}</td>
          <td>${partida.erro_saque_a}</td>
          <td>${partida.erro_saque_b}</td>
          <td>${partida.erro_ataque_a}</td>
          <td>${partida.erro_ataque_b}</td>
          <td>${partida.status_partida}</td>
          <td><button onclick="editarPartida(${
            partida.id_partida
          })">Editar</button></td>
          <td><button onclick="excluirPartida(${
            partida.id_partida
          })">Excluir</button></td>
          `;
        tabela.appendChild(linha);
      });
    } catch (error) {
      console.error("Erro ao listar partidas:", error);
    }
  }

  async function validarHorario(data_partida, hora_partida) {
    const response = await fetch("http://localhost:3000/partidas");
    if (!response.ok) return false;

    const partidas = await response.json();
    const novoHorario = new Date(`${data_partida} ${hora_partida}`);

    return !partidas.some((partida) => {
      const horarioExistente = new Date(
        `${partida.data_partida} ${partida.hora_partida}`
      );
      const diff = Math.abs(novoHorario - horarioExistente);
      return diff < 40 * 60 * 1000;
    });
  }

  window.editarPartida = async function (id_partida) {
    try {
      const response = await fetch(
        `http://localhost:3000/partidas/${id_partida}`
      );
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados da partida: ${response.status}`);
      }

      const partida = await response.json();

      document.getElementById("local_partida").value = partida.local_partida;
      document.getElementById("data_partida").value = partida.data_partida;
      document.getElementById("hora_partida").value = partida.hora_partida;
      document.getElementById("id_time_a").value = partida.id_time_a;
      document.getElementById("id_time_b").value = partida.id_time_b;
      document.getElementById("id_vencedor").value = partida.id_vencedor || "";
      document.getElementById("sets_vencidos_a").value =
        partida.sets_vencidos_a;
      document.getElementById("sets_vencidos_b").value =
        partida.sets_vencidos_b;
      document.getElementById("status_partida").value = partida.status_partida;
      document.getElementById("ponto_saque_a").value = partida.ponto_saque_a;
      document.getElementById("ponto_ataque_a").value = partida.ponto_ataque_a;
      document.getElementById("ponto_bloqueio_a").value =
        partida.ponto_bloqueio_a;
      document.getElementById("erro_saque_a").value = partida.erro_saque_a;
      document.getElementById("erro_ataque_a").value = partida.erro_ataque_a;
      document.getElementById("ponto_saque_b").value = partida.ponto_saque_b;
      document.getElementById("ponto_ataque_b").value = partida.ponto_ataque_b;
      document.getElementById("ponto_bloqueio_b").value =
        partida.ponto_bloqueio_b;
      document.getElementById("erro_saque_b").value = partida.erro_saque_b;
      document.getElementById("erro_ataque_b").value = partida.erro_ataque_b;

      idPartidaEditando = id_partida;
      botaoSalvar.textContent = "Salvar alterações";
    } catch (error) {
      console.error("Erro ao editar partida:", error);
    }
  };

  window.excluirPartida = async function (id_partida) {
    const confirmar = confirm("Você realmente deseja excluir essa partida?");
    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:3000/partidas/${id_partida}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("Partida excluída com sucesso!");
        listarPartidas();
      } else {
        alert("Erro ao excluir a partida.");
      }
    } catch (error) {
      console.error("Erro ao excluir partida:", error);
    }
  };
});

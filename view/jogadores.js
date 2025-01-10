document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("tbody");
  const formCadastro = document.getElementById("formCadastrarEditar");
  const botaoSalvar = document.getElementById("botaoSalvar");
  let idJogadorEditando = null;

  if (!formCadastro) {
    console.error(
      "Elemento <form> com id 'formCadastro' não encontrado no DOM!"
    );
    return;
  }

  if (!tabela) {
    console.error("Elemento <tbody> não encontrado no DOM!");
    return;
  }

  listarJogadores();

  formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id_time = document.getElementById("id_time").value;
    const nome_jogador = document.getElementById("nome_jogador").value;
    const posicao_jogador = document.getElementById("posicao_jogador").value;
    const altura_jogador = document.getElementById("altura_jogador").value;
    const idade_jogador = document.getElementById("idade_jogador").value;

    try {
      let response;

      if (idJogadorEditando) {
        response = await fetch(
          `http://localhost:3000/jogadores/${idJogadorEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_time,
              nome_jogador,
              posicao_jogador,
              altura_jogador,
              idade_jogador,
            }),
          }
        );
      } else {
        response = await fetch("http://localhost:3000/jogadores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_time,
            nome_jogador,
            posicao_jogador,
            altura_jogador,
            idade_jogador,
          }),
        });
      }

      const data = await response.json();
      if (response.ok) {
        alert(
          idJogadorEditando
            ? "Jogador atualizado com sucesso!"
            : "Jogador cadastrado com sucesso!"
        );
        console.log(data);

        formCadastro.reset();
        idJogadorEditando = null;
        botaoSalvar.textContent = "Cadastrar";
        listarJogadores();
      } else {
        alert("Erro ao salvar o jogador!");
        console.error(data.message);
      }
    } catch (error) {
      alert("Erro ao tentar se comunicar com o servidor.");
      console.error(error);
    }
  });

  async function listarJogadores() {
    try {
      const responseJogadores = await fetch("http://localhost:3000/jogadores");
      if (!responseJogadores.ok) {
        throw new Error(
          `Erro HTTP ao obter jogadores: ${responseJogadores.status}`
        );
      }
      const jogadores = await responseJogadores.json();

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

      jogadores.forEach((jogador) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${jogador.id_jogador}</td>
          <td>${mapaTimes[jogador.id_time] || "jogador não encontrado"}</td>
          <td>${jogador.nome_jogador}</td>
          <td>${jogador.posicao_jogador}</td>
          <td>${jogador.altura_jogador}</td>
          <td>${jogador.idade_jogador}</td>
          <td class="acao"><button onclick="editarJogador(${
            jogador.id_jogador
          })">Editar</button></td>
          <td class="acao"><button onclick="excluirJogador(${
            jogador.id_jogador
          })">Excluir</button></td>
        `;
        tabela.appendChild(linha);
      });
    } catch (error) {
      console.error("Erro ao listar jogadores:", error);
    }
  }

  window.editarJogador = async function (id_jogador) {
    try {
      const response = await fetch(
        `http://localhost:3000/jogadores/${id_jogador}`
      );
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do jogador: ${response.status}`);
      }

      const jogador = await response.json();

      document.getElementById("id_time").value = jogador.id_time;
      document.getElementById("nome_jogador").value = jogador.nome_jogador;
      document.getElementById("posicao_jogador").value =
        jogador.posicao_jogador;
      document.getElementById("altura_jogador").value = jogador.altura_jogador;
      document.getElementById("idade_jogador").value = jogador.idade_jogador;

      idJogadorEditando = id_jogador;
      botaoSalvar.textContent = "Salvar Alterações";
    } catch (error) {
      console.error("Erro ao editar jogador:", error);
      alert("Erro ao carregar os dados do jogador.");
    }
  };

  window.excluirJogador = async function (id_jogador) {
    try {
      const response = await fetch(
        `http://localhost:3000/jogadores/${id_jogador}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao excluir jogador: ${response.status}`);
      }

      console.log(`Jogador com ID ${id_jogador} excluído com sucesso!`);
      alert(`Jogador com ID ${id_jogador} excluído com sucesso!`);
      listarJogadores();
    } catch (error) {
      console.error("Erro ao excluir jogador:", error);
    }
  };
});

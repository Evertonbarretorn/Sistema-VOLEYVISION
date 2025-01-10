document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("tbody");
  const formCadastro = document.getElementById("formCadastrarEditar");
  const botaoSalvar = document.getElementById("botaoSalvar");
  let idTimeEditando = null;
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

  listarTimes();

  formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome_time = document.getElementById("nome_time").value;
    const cidade_time = document.getElementById("cidade_time").value;
    const estado_time = document.getElementById("estado_time").value;
    const treinador_time = document.getElementById("treinador_time").value;

    try {
      let response;

      if (idTimeEditando) {
        response = await fetch(
          `http://localhost:3000/times/${idTimeEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome_time,
              cidade_time,
              estado_time,
              treinador_time,
            }),
          }
        );
      } else {
        response = await fetch("http://localhost:3000/times", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome_time,
            cidade_time,
            estado_time,
            treinador_time,
          }),
        });
      }

      const data = await response.json();
      if (response.ok) {
        alert(
          idTimeEditando
            ? "Time atualizado com sucesso!"
            : "Time cadastrado com sucesso!"
        );
        console.log(data);

        formCadastro.reset();
        idTimeEditando = null;
        botaoSalvar.textContent = "Cadastrar";
        listarTimes();
      } else {
        alert("Erro ao salvar o time!");
        console.error(data.message);
      }
    } catch (error) {
      alert("Erro ao tentar se comunicar com o servidor.");
      console.error(error);
    }
  });

  async function listarTimes() {
    try {
      const response = await fetch("http://localhost:3000/times");

      console.log("Status da resposta:", response.status);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const times = await response.json();
      tabela.innerHTML = "";

      times.forEach((time) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
                <td>${time.id_time}</td>
                <td>${time.nome_time}</td>
                <td>${time.cidade_time}</td>
                <td>${time.estado_time}</td>
                <td>${time.treinador_time}</td>
                <td class="acao"><button onclick="editarTime(${time.id_time})">Editar</button></td>
                <td><button onclick="excluirTime(${time.id_time})">Excluir</button></td>
              `;
        tabela.appendChild(linha);
      });
    } catch (error) {
      console.error("Erro ao listar times:", error);
    }
  }

  window.editarTime = async function (id_time) {
    try {
      const response = await fetch(`http://localhost:3000/times/${id_time}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do time: ${response.status}`);
      }

      const time = await response.json();

      document.getElementById("nome_time").value = time.nome_time;
      document.getElementById("cidade_time").value = time.cidade_time;
      document.getElementById("estado_time").value = time.estado_time;
      document.getElementById("treinador_time").value = time.treinador_time;

      idTimeEditando = id_time;
      botaoSalvar.textContent = "Salvar Alterações";
    } catch (error) {
      console.error("Erro ao editar time:", error);
      alert("Erro ao carregar os dados do time.");
    }
  };

  window.excluirTime = async function (id_time) {
    try {
      const response = await fetch(`http://localhost:3000/times/${id_time}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir time: ${response.status}`);
      }

      console.log(`Time com ID ${id_time} excluído com sucesso!`);
      alert(`Time com ID ${id_time} excluído com sucesso!`);
      listarTimes();
    } catch (error) {
      console.error("Erro ao excluir time:", error);
    }
  };
});

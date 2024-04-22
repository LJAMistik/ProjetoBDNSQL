const urlBase = 'https://backend-rest-mongodb.vercel.app/api'
//const urlBase = 'http://localhost:4000/api'



async function removeClinicas(id){
    if(confirm('Deseja realmente excluir esta clinicas?')){
        await fetch(`${urlBase}/clinicas/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if (data.deletedCount > 0){carregaClinicas() //atualizamos a UI
            }
        })
        .catch(error => {
            document.getElementById('mensagem').innerHTML = `Erro ao remover a clinica: ${error.message}`
            resultadoModal.show() //exibe o modal com o erro
        })
    }// Defina a função carregaClinicas() aqui
async function carregaClinicas() {
    const tabela = document.getElementById('dadosTabela');
    if (tabela !== null) {
      tabela.innerHTML = ''; // Limpa antes de recarregar
      // Faz a requisição GET para a API REST
      await fetch(`${urlBase}/clinicas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        data.forEach(clinicas => {
          tabela.innerHTML += `
            <tr>
              <td>${clinicas.nome}</td>
              <td>${clinicas.email}</td>
              <td>${new Date(clinicas.data_cadastro).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
              <td>${clinicas.telefone}</td>
              <td>${clinicas.classificacao}</td>
              <td>${clinicas.especialidades}</td>
              <td>${clinicas.latitude}</td>
              <td>${clinicas.longitude}</td>
              <td><button class='btn btn-danger btn-sm' onclick='removeClinicas("${clinicas._id}")'>🗑 Excluir </button></td>
            </tr>
          `;
        });
      });
    } else {
      console.error("Elemento 'dadosTabela' não encontrado.");
    }
  }
  
  // Agora, chame a função carregaClinicas() aqui
  carregaClinicas();
  
}
document.getElementById('formulario-clinica').addEventListener('submit', function (event){
    event.preventDefault() // evita o recarregamento
    let clinicas = {} // Objeto clinicas
    clinicas = {
        "nome": document.getElementById('nome').value,
        "email": document.getElementById(email).value,
        "data_cadastro": document.getElementById('data-cadastro').value,
        "telefone": document.getElementById('telefone').value,
        "classificacao": document.getElementById(classificacao).value,
        "especialidades": document.getElementById('especialidades').value,
        "endereco": {
            "logradouro": document.getElementById('logradouro').value,
            "complemento": document.getElementById('complemento').value,
            "bairro": document.getElementById('bairro').value,
            "cidade": document.getElementById('cidade').value,
            "uf": document.getElementById('unidade-da-federacao').value,
            "cep": document.getElementById('cep').value,
        }
    } /* fim do objeto */
    //alert(JSON.stringify(clinicas)) //apenas para testes
    salvaClinicas(clinicas)
})

async function salvaClinicas(clinicas){
    await fetch(`${urlBase}/clinicas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clinicas)
    })
    .then(response => response.json())
    .then(data => {
        if (data.acknowledged) {
            alert('clinica incluída com sucesso!')
            //limpamos o formulário
            document.getElementById('formulario-clinica').reset()
            //atualizamos a listagem
            carregaClinicas()
        } else if (data.errors){
 const errorMessages = data.errors.map(error => error.msg).join('\n')
 document.getElementById('mensagem').innerHTML = `<span class='text-danger'>${errorMessages}</span>`
 resultadoModal.show() //Mostra o modal
        }
    })

}

// ######################### MODAL ###########################

// Função para exibir o modal
function mostrarModal() {
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}
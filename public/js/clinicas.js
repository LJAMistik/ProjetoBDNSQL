//const urlBase = 'https://backend-rest-mongodb.vercel.app/api'
const urlBase = 'http://localhost:4000/api'



// ################################################# FUNÇÃO PARA APAGAR #################################################

async function removeClinicas(id){
  if(confirm('Deseja realmente excluir esta clinica?')){
      await fetch(`${urlBase}/clinicas/${id}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.json())
      .then(data => {
          if (data.deletedCount > 0){buscaClinicas() //atualizamos a UI
          }
      })
      .catch(error => {
          document.getElementById('mensagem').innerHTML = `Erro ao remover a clinica: ${error.message}`
      })
  }
}



// #################################### FUNÇÃO PARA O FORM DEFINIR O OBJETO #############################################

document.getElementById('formulario-clinica').addEventListener('submit', function (event){
    event.preventDefault() // evita o recarregamento
    const clinicas = {
        "nome": document.getElementById('nome').value,
        "email": document.getElementById('email').value,
        "data_cadastro": new Date(document.getElementById('data_cadastro').value),
        "telefone": document.getElementById('telefone').value,
        "classificacao": document.getElementById('classificacao').value,
        "especialidades": document.getElementById('especialidades').value.split(','),
        "endereco": {
            "logradouro": document.getElementById('logradouro').value,
            "complemento": document.getElementById('complemento').value,
            "bairro": document.getElementById('bairro').value,
            "cidade": document.getElementById('cidade').value,
            "uf": document.getElementById('unidade-da-federacao').value,
            "cep": document.getElementById('cep').value,
            "coordinates": [document.getElementById('latitude').value, document.getElementById('longitude').value]
        }
    } /* fim do objeto */

    console.log(clinicas)

    // chama a função para salvar o objeto
    salvaClinicas(clinicas)
})



// ################################################# FUNÇÃO PARA SALVAR #################################################

async function salvaClinicas(clinicas) {
  console.log(clinicas);
  try {
    const response = await fetch(`${urlBase}/clinicas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clinicas)
    });
    const data = await response.json();
    
    if (data.acknowledged) {
      alert('Clínica incluída com sucesso!');
      // Limpamos o formulário
      document.getElementById('formulario-clinica').reset();
      // Limpa os valores preenchidos automaticamente
      document.getElementById('nome').value = '';
      document.getElementById('email').value = '';
      document.getElementById('data_cadastro').value = '';
      document.getElementById('telefone').value = '';
      document.getElementById('classificacao').value = '';
      document.getElementById('especialidades').value = '';
      document.getElementById('complemento').value = '';
      document.getElementById('logradouro').value = '';
      document.getElementById('numero').value = '';
      document.getElementById('bairro').value = '';
      document.getElementById('cidade').value = '';
      document.getElementById('unidade-da-federacao').selectedIndex = 0;
      document.getElementById('cep').value = '';
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';

      // Atualizamos a listagem
      buscaClinicas();
    } else if (data.errors) {
      // Construir a mensagem de erro para o alert
      const errorMessages = data.errors.map(error => error.msg).join('\n');
      alert(errorMessages);
    }
  } catch (error) {
    console.error('Erro ao enviar o formulário:', error);
    alert('Erro ao enviar o formulário. Tente novamente mais tarde.');
  }
}




// ###################################### FUNÇÃO PARA CARREGAR AS CLÍNICAS NA TABELA ####################################

async function buscaClinicas() {
  await fetch(`${urlBase}/clinicas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    var tbodyRef = document.getElementById('tabela-clinicas').getElementsByTagName('tbody')[0];
    tbodyRef.innerHTML = "";
    for (const clinica of data) {
      // Insert a row at the end of table
      var newRow = tbodyRef.insertRow();

      // Insert a cell at the end of the row
      var colNome = newRow.insertCell();
      colNome.appendChild(document.createTextNode(clinica.nome));
      var colEmail = newRow.insertCell();
      colEmail.appendChild(document.createTextNode(clinica.email));
      var colDataCadastro = newRow.insertCell();
      var dataCadastro = new Date(clinica.data_cadastro);
      // Adiciona 3 horas ao timestamp para ajustar para o fuso horário de Brasília (UTC-3)
      dataCadastro.setHours(dataCadastro.getHours() + 3);
      var dataFormatada = dataCadastro.toLocaleDateString('pt-BR');
      colDataCadastro.appendChild(document.createTextNode(dataFormatada));
      var colTelefone = newRow.insertCell();
      colTelefone.appendChild(document.createTextNode(clinica.telefone));
      var colClassificacao = newRow.insertCell();
      colClassificacao.appendChild(document.createTextNode(clinica.classificacao));
      var colEspecialidades = newRow.insertCell();
      colEspecialidades.appendChild(document.createTextNode(clinica.especialidades.toString()));
      var colEndereco = newRow.insertCell();
      colEndereco.appendChild(document.createTextNode(clinica.endereco.logradouro));
      var colLat = newRow.insertCell();
      var colLong = newRow.insertCell();

      if(!!clinica.endereco.coordinates) {
        colLat.appendChild(document.createTextNode(clinica.endereco.coordinates[0]));
        colLong.appendChild(document.createTextNode(clinica.endereco.coordinates[1]));
      }
      
      // Create the action cell
      var colAction = newRow.insertCell();
      colAction.innerHTML = `
        <button class='btn btn-danger btn-sm botao-tabela' onclick='removeClinicas("${clinica._id}")'>Excluir</button>
        <button class='btn btn-danger btn-sm botao-tabela'' onclick='editaClinicaExistente("${clinica._id}")'>Editar</button>
      `;
    }
  })
}

window.onload = function() {
  buscaClinicas();
};




// ############################## FUNÇÃO PARA ATUALIZAR OS DADOS DE UMA CLINICA JÁ EXISTENTE ############################

async function atualizaClinica(id, dadosAtualizados) {
  try {
    // Obter os dados atuais da clinica pelo ID
    const response = await fetch(`${urlBase}/clinicas/id/${id}`);
    const clinicaAtual = await response.json();

    if (!response.ok) {
      alert('Erro ao tentar obter os dados da clinica. Por favor, tente novamente.');
      return;
    }

    // Mesclar os dados atuais com os dados atualizados
    const clinicaNova = { ...clinicaAtual[0], ...dadosAtualizados };

    // Fazer a solicitação PUT com os dados atualizados
    const responseAtualizacao = await fetch(`${urlBase}/clinicas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clinicaNova)
    });

    if (responseAtualizacao.ok) {
      const data = await responseAtualizacao.json();
      if (data.updatedCount > 0) {
        alert('Clinica atualizada com sucesso!');
        buscaClinicas(); // Atualiza a listagem na UI
      } else {
        alert('Erro: Nenhuma clinica foi atualizada. Verifique os dados e tente novamente.');
      }
    } else {
      // Se houver um erro de rede ou um erro no servidor
      alert('Erro ao tentar atualizar a clinica. Por favor, tente novamente.');
    }
  } catch (error) {
    console.error('Erro ao tentar atualizar a clinica:', error);
    alert('Erro ao tentar atualizar a clinica. Por favor, tente novamente.');
  }
}



// ########################### FUNÇÃO PARA EDITAR OS DADOS DE UMA CLINICA JÁ EXISTENTE ##################################

async function editaClinicaExistente(id) {
  try {
    // Buscar os dados da clinica existente pelo ID
    const response = await fetch(`${urlBase}/clinicas/id/${id}`);
    if (!response.ok) {
      alert('Erro ao obter os dados da clinica. Por favor, tente novamente.');
      return;
    }
    
    const clinicaExistente = await response.json();
    const dadosClinica = clinicaExistente[0]; // Supondo que apenas uma clinica seja retornada
    
    // Preencher os campos do formulário com os valores da clinica existente
    document.getElementById('nome').value = dadosClinica.nome;
    document.getElementById('email').value = dadosClinica.email;
    document.getElementById('data_cadastro').value = dadosClinica.data_cadastro;
    document.getElementById('telefone').value = dadosClinica.telefone;
    document.getElementById('classificacao').value = dadosClinica.classificacao;
    document.getElementById('especialidades').value = dadosClinica.especialidades.join(',');
    document.getElementById('logradouro').value = dadosClinica.endereco.logradouro;
    document.getElementById('complemento').value = dadosClinica.endereco.complemento;
    document.getElementById('bairro').value = dadosClinica.endereco.bairro;
    document.getElementById('cidade').value = dadosClinica.endereco.cidade;
    document.getElementById('unidade-da-federacao').value = dadosClinica.endereco.uf;
    document.getElementById('cep').value = dadosClinica.endereco.cep;
    document.getElementById('latitude').value = dadosClinica.endereco.coordinates[0];
    document.getElementById('longitude').value = dadosClinica.endereco.coordinates[1];
    
    // Adicionar um evento de clique ao botão de enviar do formulário para chamar a função de atualização com os dados preenchidos
    document.getElementById('formulario-clinica').addEventListener('submit', function (event) {
      event.preventDefault();
      const dadosAtualizados = {
        "nome": document.getElementById('nome').value,
        "email": document.getElementById('email').value,
        "data_cadastro": document.getElementById('data_cadastro').value,
        "telefone": document.getElementById('telefone').value,
        "classificacao": document.getElementById('classificacao').value,
        "especialidades": document.getElementById('especialidades').value.split(','),
        "endereco": {
          "logradouro": document.getElementById('logradouro').value,
          "complemento": document.getElementById('complemento').value,
          "bairro": document.getElementById('bairro').value,
          "cidade": document.getElementById('cidade').value,
          "uf": document.getElementById('unidade-da-federacao').value,
          "cep": document.getElementById('cep').value,
          "coordinates": [document.getElementById('latitude').value, document.getElementById('longitude').value]
        }
      };
      
      // Chamar a função para atualizar a clinica com os dados preenchidos
      atualizaClinica(id, dadosAtualizados);
    });
    
  } catch (error) {
    console.error('Erro ao tentar editar a clinica:', error);
    alert('Erro ao tentar editar a clinica. Por favor, tente novamente.');
  }
}



// ############################################## FUNÇÃO PESQUISAR CLÍNICAS #############################################

function buscarClinica() {
  const termoBusca = document.getElementById('searchClinic').value;
  window.location.href = `/clinicas/busca?nome=${termoBusca}`;
  
  // Realiza uma chamada à API
  fetch(`/clinicas?nome=${termoBusca}`)
      .then(response => response.json())
      .then(data => {
          // Limpa os resultados anteriores
          document.getElementById('resultadoClinica').innerHTML = '';

          // Exibe os resultados
          data.forEach(clinica => {
              const elementoClinica = document.createElement('div');
              elementoClinica.textContent = clinica.nome; // Supondo que "nome" seja o campo que você quer exibir
              document.getElementById('resultadoClinica').appendChild(elementoClinica);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar clínicas:', error);
      });
}



// #################################### FUNÇÃO PARA EXIBIR OS RESULTADOS DA BUSCA DE CLÍNICAS ###########################

  function exibirResultadosClinicas(resultados) {
    const divResultado = document.getElementById('resultadoClinica');
    divResultado.innerHTML = ''; // Limpa quaisquer resultados anteriores

    if (resultados.length === 0) {
      divResultado.innerHTML = '<p>Nenhuma clínica encontrada.</p>';
      return;
    }

    const listaClinicas = document.createElement('ul');
    resultados.forEach(clinica => {
      const itemClinica = document.createElement('li');
      itemClinica.textContent = `${clinica.nome} - ${clinica.endereco.cidade}, ${clinica.endereco.uf}`;
      listaClinicas.appendChild(itemClinica);
    });
    divResultado.appendChild(listaClinicas);
  }



// ########################### FUNÇÃO PARA O ENVIO DE FORMULÁRIO DE PESQUISA DE CLÍNICAS ################################

  document.getElementById('form-pesquisa').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const termoBusca = document.getElementById('termo').value.trim();

    fetch(`/api/clinicas/nome/${termoBusca}`)
      .then(response => response.json())
      .then(data => {
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = '';

        if (data.length === 0) {
          resultadoDiv.innerHTML = '<p>Nenhuma clínica encontrada com esse nome.</p>';
          return;
        }

        const listaClinicas = document.createElement('ul');
        data.forEach(clinica => {
          const itemClinica = document.createElement('li');
          itemClinica.textContent = `${clinica.nome} - ${clinica.endereco.cidade}, ${clinica.endereco.uf}`;
          listaClinicas.appendChild(itemClinica);
        });
        resultadoDiv.appendChild(listaClinicas);
      })
      .catch(error => {
        console.error('Erro ao buscar clínicas:', error);
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = '<p>Ocorreu um erro ao buscar as clínicas. Tente novamente mais tarde.</p>';  
        });
      });
    






//const urlBase = 'https://backend-rest-mongodb.vercel.app/api'
const urlBase = window.location.href.replace(/\/[^\/]*$/, '')+"/api";


// #################################### DEFINIÇÃO DO OBJETO #############################################

document.getElementById('formulario-clinica').addEventListener('submit', function(event) {
  event.preventDefault(); // evita o recarregamento
  
  const clinicaData = {
    name: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('telefone').value,
    rating: document.getElementById('classificacao').value,
    address: {
      zipCode: document.getElementById('cep').value,
      neighborhood: document.getElementById('bairro').value,
      street: document.getElementById('logradouro').value,
      number: document.getElementById('numero').value,
      city: document.getElementById('cidade').value,
      state: document.getElementById('unidade-federacao').value,
      complement: document.getElementById('complemento').value,
    }
  };

  console.log(clinicaData);
  salvaClinicas(clinicaData)
});


// ############################### FUNÇÃO PARA OBTER O O VALOR DE UM ELEMENTO HTML PELO ID #############################

// function getValueById(id) {
//   const element = document.getElementById(id);
//   if (element) {
//       return element.value;
//   } else {
//       console.error(`Elemento com ID ${id} não encontrado`);
//       return '';
//   }
// }


// ################################################# FUNÇÃO PARA SALVAR #################################################

async function salvaClinicas(clinicaData) {
  console.log(clinicaData);
  try {
    const response = await fetch(`${urlBase}/clinics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Barear ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(clinicaData)
    });
    const data = await response.json();
    
    if (data.acknowledged) {
      alert('Clínica incluída com sucesso!');
      // Limpamos o formulário
      document.getElementById('formulario-clinica').reset();
      // Limpa os valores preenchidos automaticamente
      limpaFormulario();
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


// ###################################### FUNÇÃO PARA LIMPAR O FORMULÁRIO ###############################################

function limpaFormulario() {
  const fieldsToClear = [
    'nome', 'email', 'data_cadastro', 'telefone', 'classificacao', 
    'complemento', 'numero', 'bairro', 'cidade', 'cep']

  fieldsToClear.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.value = '';
    }
  });

  const ufElement = document.getElementById('unidade-federacao');
  if (ufElement) {
    ufElement.selectedIndex = 0;
  }
}



// ###################################### FUNÇÃO PARA CARREGAR AS CLÍNICAS NA TABELA ####################################

async function buscaClinicas() {
  try {
    const response = await fetch(`${urlBase}/clinics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Barear ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    
    const tbodyRef = document.getElementById('tabela-clinicas').getElementsByTagName('tbody')[0];
    tbodyRef.innerHTML = "";

    for (const clinica of data) {
      const newRow = tbodyRef.insertRow();

      newRow.insertCell().appendChild(document.createTextNode(clinica.name));
      newRow.insertCell().appendChild(document.createTextNode(clinica.email));
      
      const dataCadastro = new Date(clinica.createdAt);
      const dataFormatada = dataCadastro.toLocaleDateString('pt-BR');
      newRow.insertCell().appendChild(document.createTextNode(dataFormatada));
      
      newRow.insertCell().appendChild(document.createTextNode(clinica.phone));
      newRow.insertCell().appendChild(document.createTextNode(parseFloat(clinica.rating)));
      newRow.insertCell().appendChild(document.createTextNode(formatAddress(clinica.address)));
      // newRow.insertCell().appendChild(document.createTextNode(clinica.phone));


      
      const colAction = newRow.insertCell();
      colAction.innerHTML = `
        <button class='btn btn-danger btn-sm botao-tabela' onclick='removeClinicas("${clinica._id}")'>Excluir</button>
        <button class='btn btn-danger btn-sm botao-tabela'' onclick='editaClinicaExistente("${clinica._id}")'>Editar</button>
      `;
    }
  } catch (error) {
    console.error('Erro ao buscar clínicas:', error);
    alert('Erro ao buscar clínicas. Tente novamente mais tarde.');
  }
}

function formatAddress(address) {
  return `${address.street},${address.number}, ${address.neighborhood} - ${address.city}/${address.state}`;
}

window.onload = function() {
  buscaClinicas();
};


// ############################## FUNÇÃO PARA ATUALIZAR OS DADOS DE UMA CLINICA JÁ EXISTENTE ############################

async function atualizaClinica(id, dadosAtualizados) {
  try {
    // Obtém os dados atuais da clínica pelo ID
    const response = await fetch(`${urlBase}/clinicas/id/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao tentar obter os dados da clínica. Por favor, tente novamente.');
    }
    const clinicaAtual = await response.json();

    // Mescla os dados atuais com os dados atualizados
    const clinicaNova = { ...clinicaAtual[0], ...dadosAtualizados };

    // Faz a solicitação PUT com os dados atualizados
    const responseAtualizacao = await fetch(`${urlBase}/clinicas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clinicaNova)
    });

    if (!responseAtualizacao.ok) {
      throw new Error('Erro ao tentar atualizar a clínica. Por favor, tente novamente.');
    }

    const data = await responseAtualizacao.json();
    if (data.updatedCount > 0) {
      alert('Clínica atualizada com sucesso!');
      buscaClinicas(); // Atualiza a listagem na UI
    } else {
      alert('Erro: Nenhuma clínica foi atualizada. Verifique os dados e tente novamente.');
    }
  } catch (error) {
    console.error('Erro ao tentar atualizar a clínica:', error);
    alert('Erro ao tentar atualizar a clínica. Por favor, tente novamente.');
  }
}



// ########################### FUNÇÃO PARA EDITAR OS DADOS DE UMA CLINICA JÁ EXISTENTE ##################################

async function editaClinicaExistente(id) {
  try {
    // Buscar os dados da clinica existente pelo ID
    const response = await fetch(`${urlBase}/clinics/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Barear ${localStorage.getItem('token')}`
      },
    });
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
    document.getElementById('complemento').value = dadosClinica.endereco.complemento;
    document.getElementById('bairro').value = dadosClinica.endereco.bairro;
    document.getElementById('cidade').value = dadosClinica.endereco.cidade;
    document.getElementById('unidade-federacao').value = dadosClinica.endereco.uf;
    document.getElementById('cep').value = dadosClinica.endereco.cep;
    
    // Adicionar um evento de clique ao botão de enviar do formulário para chamar a função de atualização com os dados preenchidos
    document.getElementById('formulario-clinica').addEventListener('submit', function (event) {
      event.preventDefault();
      const dadosAtualizados = {
        "nome": document.getElementById('nome').value,
        "email": document.getElementById('email').value,
        "data_cadastro": document.getElementById('data_cadastro').value,
        "telefone": document.getElementById('telefone').value,
        "classificacao": document.getElementById('classificacao').value,
        "endereco": {
          "cep": document.getElementById('cep').value,
          "bairro": document.getElementById('bairro').value,
          "cidade": document.getElementById('cidade').value,
          "uf": document.getElementById('unidade-federacao').value,
          "complemento": document.getElementById('complemento').value,
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


// ################################################# FUNÇÃO PARA APAGAR #################################################

async function removeClinicas(id){
  if(confirm('Deseja realmente excluir esta clinica?')){
      await fetch(`${urlBase}/clinics/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Barear ${localStorage.getItem('token')}`

          }
      })
      buscaClinicas()
      // .then(response => response.json())
      // .then(data => {
      //     if (data.deletedCount > 0){buscaClinicas() //atualizamos a UI
      //     }
      // })
      // .catch(error => {
      //     document.getElementById('mensagem').innerHTML = `Erro ao remover a clinica: ${error.message}`
      // })
  }
}

// ####################################### FUNÇÃO PARA BUSCAR A CLÍNICA PELO NOME #####################################

function buscarClinica() {
  const termoBusca = document.getElementById('buscar-clinica').value;

  fetch(`/api/clinicas/nome/${termoBusca}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na rede ao buscar clínicas');
      }
      return response.json();
    })
    .then(data => {
      exibirResultadosClinicas(data);
    })
    .catch(error => {
      console.error('Erro ao buscar clínicas:', error);
      document.getElementById('resultado-clinica').innerHTML = '<p>Ocorreu um erro ao buscar as clínicas. Tente novamente mais tarde.</p>';
    });
}


// ##################################### FUNÇÃO PARA EXIBIR OS RESULTADOS DA BUSCA #####################################

function exibirResultadosClinicas(resultados) {
  const divResultado = document.getElementById('resultado-clinica');
  divResultado.innerHTML = ''; // Limpa quaisquer resultados anteriores

  if (!Array.isArray(resultados) || resultados.length === 0) {
    divResultado.innerHTML = '<p>Nenhuma clínica encontrada.</p>';
    return;
  }

  const listaClinicas = document.createElement('ul');
  resultados.forEach(clinica => {
    const itemClinica = document.createElement('li');
    itemClinica.textContent = `${clinica.nome} - ${clinica.endereco.cidade}, ${clinica.endereco.uf}`;
    itemClinica.addEventListener('click', () => {
      limparDetalhesClinica();
      exibirDetalhesClinica(clinica);
    });
    listaClinicas.appendChild(itemClinica);
  });
  divResultado.appendChild(listaClinicas);
}


// ################################### FUNÇÃO PARA EXIBIR OS DETALHES DA CLÍNICA #######################################

function exibirDetalhesClinica(clinica) {
  const divDetalhes = document.getElementById('detalhes-clinica');

  // Monta o HTML com os detalhes da clínica
  divDetalhes.innerHTML = `
    <h2>Detalhes da Clínica</h2>
    <p><strong>Nome:</strong> ${clinica.name}</p>
    <p><strong>Email:</strong> ${clinica.contact[0].email}</p>
    <p><strong>Data de Cadastro:</strong> ${new Date(clinica.data_cadastro).toLocaleDateString()}</p>
    <p><strong>Telefone:</strong> ${clinica.contact[0].phone}</p>
    <p><strong>Classificação:</strong> ${clinica.rating.toString()}</p>
    <h5>Endereço</h5>
    <p><strong>Complemento:</strong> ${clinica.address.complement}</p>
    <p><strong>Bairro:</strong> ${clinica.address.neighborhood}</p>
    <p><strong>Cidade:</strong> ${clinica.address.city}</p>
    <p><strong>UF:</strong> ${clinica.address.state}</p>
    <p><strong>CEP:</strong> ${clinica.address.zipCode}</p>
  `;
}




// ####################################### FUNÇÃO PARA LIMPAR OS DETALHES DA CLÍNICA ###################################

function limparDetalhesClinica() {
  const divDetalhes = document.getElementById('detalhes-clinica');
  divDetalhes.innerHTML = '';
}
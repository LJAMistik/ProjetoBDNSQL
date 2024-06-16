//const urlBase = 'https://backend-rest-mongodb.vercel.app/api'
const urlBase = 'http://localhost:4000/api'


// #################################### DEFINIÇÃO DO OBJETO #############################################

document.getElementById('formulario-clinica').addEventListener('submit', function (event) {
  event.preventDefault();

  const clinicas = {
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
      "uf": document.getElementById('unidade-federacao').value,
      "cep": document.getElementById('cep').value,
      "coordinates": [document.getElementById('latitude').value, document.getElementById('longitude').value]
    }
  };

  console.log(clinicas);

  // Chama a função para salvar o objeto
  salvaClinicas(clinicas);
});


// ############################### FUNÇÃO PARA OBTER O O VALOR DE UM ELEMENTO HTML PELO ID #############################

function getValueById(id) {
  const element = document.getElementById(id);
  if (element) {
      return element.value;
  } else {
      console.error(`Elemento com ID ${id} não encontrado`);
      return '';
  }
}


// ################################################# FUNÇÃO PARA SALVAR #################################################

async function salvaClinicas(clinicas) {
    // Verifica se todos os campos obrigatórios, exceto 'complemento', estão preenchidos
    if (!clinicas.nome || !clinicas.email || !clinicas.telefone || !clinicas.data_cadastro || !clinicas.classificacao || !clinicas.especialidades.length || !clinicas.endereco.logradouro || !clinicas.endereco.bairro || !clinicas.endereco.cidade || !clinicas.endereco.uf || !clinicas.endereco.cep || !clinicas.endereco.coordinates[0] || !clinicas.endereco.coordinates[1]) {
      alert('É necessário preencher todos os campos, exceto o campo "Complemento".');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      alert('Token não encontrado. Faça login novamente.');
      return;
    }
  
    try {

      const response = await fetch(`${urlBase}/clinicas`, {
        method: 'POST',
        headers: {
          'access-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clinicas)
      });
  
      const data = await response.json();
  
      if (response.ok) {
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
      } else {
        console.error('Erro ao salvar clínica:', response.status, response.statusText);
        alert('Erro ao salvar clínica. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      alert('Erro ao enviar o formulário. Tente novamente mais tarde.');
    }
  }

// ###################################### FUNÇÃO PARA LIMPAR O FORMULÁRIO ###############################################

function limpaFormulario() {
  ['nome', 'email', 'data_cadastro', 'telefone', 'classificacao', 'especialidades', 'complemento', 'logradouro', 'numero', 'bairro', 'cidade', 'cep', 'latitude', 'longitude'].forEach(id => {
      document.getElementById(id).value = '';
  });
  document.getElementById('unidade-federacao').selectedIndex = 0;
}

// ###################################### FUNÇÃO PARA CARREGAR AS CLÍNICAS NA TABELA ####################################

async function buscaClinicas() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado');
    return;
  }

  try {
    const response = await fetch(`${urlBase}/clinicas`, {
      method: 'GET',
      headers: {
        'access-token': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Não autorizado');
      } else {
        console.error('Erro ao buscar clínicas:', response.status, response.statusText);
      }
      return;
    }

    const data = await response.json();

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

      if (!!clinica.endereco.coordinates) {
        colLat.appendChild(document.createTextNode(clinica.endereco.coordinates[0]));
        colLong.appendChild(document.createTextNode(clinica.endereco.coordinates[1]));
      }

      // Create the action cell
      var colAction = newRow.insertCell();
      colAction.innerHTML = `
        <button class='btn btn-danger btn-sm botao-tabela' onclick='removeClinicas("${clinica._id}")'>Excluir</button>
        <button class='btn btn-danger btn-sm botao-tabela' onclick='editaClinicaExistente("${clinica._id}")'>Editar</button>
      `;
    }
  } catch (error) {
    console.error('Erro ao buscar clínicas:', error);
  }
}

window.onload = () => {
  buscaClinicas();
};


// ###################### FUNÇÃO PARA ATUALIZAR OS DADOS DE UMA CLINICA JÁ EXISTENTE - NO SERVIDOR ######################

async function atualizaClinica(id, dadosAtualizados) {
  const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

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
        'access-token': token,
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


// #################### FUNÇÃO PARA EDITAR OS DADOS DE UMA CLINICA JÁ EXISTENTE - NA INTERFACE ##########################

async function editaClinicaExistente(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado');
    alert('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    // Buscar os dados da clinica existente pelo ID
    const response = await fetch(`${urlBase}/clinicas/id/${id}`, {
      headers: {
      'access-token': token
      }
    });

    if (!response.ok) {
      alert('Erro ao obter os dados da clinica. Por favor, tente novamente.');
      return;
    }
    
    const clinicaExistente = await response.json();
    const dadosClinica = clinicaExistente[0];
    
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
    document.getElementById('unidade-federacao').value = dadosClinica.endereco.uf;
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
          "uf": document.getElementById('unidade-federacao').value,
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


// ################################################# FUNÇÃO PARA APAGAR ################################################

async function removeClinicas(id){
  const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

  if(confirm('Deseja realmente excluir esta clinica?')){
      await fetch(`${urlBase}/clinicas/${id}`, {
          method: 'DELETE',
          headers:{
          'access-token': token, 
          'Content-Type': 'application/json'}
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

// ####################################### FUNÇÃO PARA BUSCAR A CLÍNICA PELO NOME ######################################

function buscarClinica() {
  const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

  const termoBusca = document.getElementById('buscar-clinica').value;
  fetch(`/api/clinicas/nome/${termoBusca}`,{
    headers: {
      'access-token': token
    }
  })
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


// ############################### FUNÇÃO PARA EXIBIR OS DETALHES DA CLÍNICA (BUSCA) ###################################

function exibirDetalhesClinica(clinica) {
  const divDetalhes = document.getElementById('detalhes-clinica');
  divDetalhes.innerHTML = `
    <h2>Detalhes da Clínica</h2>
    <p><strong>Nome:</strong> ${clinica.nome}</p>
    <p><strong>Email:</strong> ${clinica.email}</p>
    <p><strong>Data de Cadastro:</strong> ${new Date(clinica.data_cadastro).toLocaleDateString()}</p>
    <p><strong>Telefone:</strong> ${clinica.telefone}</p>
    <p><strong>Classificação:</strong> ${clinica.classificacao}</p>
    <p><strong>Especialidades:</strong> ${clinica.especialidades.join(', ')}</p>
    <h5>Endereço</h5>
    <p><strong>Logradouro:</strong> ${clinica.endereco.logradouro}</p>
    <p><strong>Complemento:</strong> ${clinica.endereco.complemento}</p>
    <p><strong>Bairro:</strong> ${clinica.endereco.bairro}</p>
    <p><strong>Cidade:</strong> ${clinica.endereco.cidade}</p>
    <p><strong>UF:</strong> ${clinica.endereco.uf}</p>
    <p><strong>CEP:</strong> ${clinica.endereco.cep}</p>
    <p><strong>Coordenadas:</strong> ${clinica.endereco.coordinates.join(', ')}</p>
  `;
}


// ################################### FUNÇÃO PARA LIMPAR OS DETALHES DA CLÍNICA (BUSCA) ###############################

function limparDetalhesClinica() {
  const divDetalhes = document.getElementById('detalhes-clinica');
  divDetalhes.innerHTML = '';
}


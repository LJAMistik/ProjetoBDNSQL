//const urlBase = 'https://backend-rest-mongodb.vercel.app/api'
const urlBase = 'http://localhost:4000/api'



async function removeClinicas(id){
  if(confirm('Deseja realmente excluir esta clinicas?')){
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
  }// Defina a função carregaClinicas() aqui
}
  
document.getElementById('formulario-clinica').addEventListener('submit', function (event){
    event.preventDefault() // evita o recarregamento
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
            "uf": document.getElementById('unidade-da-federacao').value,
            "cep": document.getElementById('cep').value,
            "coordinates": [document.getElementById('latitude').value, document.getElementById('longitude').value]
        }
    } /* fim do objeto */
    //alert(JSON.stringify(clinicas)) //apenas para testes
    console.log(clinicas)
    salvaClinicas(clinicas)
})

async function salvaClinicas(clinicas){
  console.log(clinicas)
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
            buscaClinicas()
        } else if (data.errors){
 const errorMessages = data.errors.map(error => error.msg).join('\n')
 document.getElementById('mensagem').innerHTML = `<span class='text-danger'>${errorMessages}</span>`
        }
    })

}



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
    colDataCadastro.appendChild(document.createTextNode(clinica.data_cadastro));
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
  var colAction = newRow.insertCell();
  colLong.innerHTML = `<button class='btn btn-danger btn-sm' onclick='removeClinicas("${clinica._id}")'>Excluir</button>`;

    console.log(clinica)
  }
})
}


window.onload = function() {
  buscaClinicas()
};



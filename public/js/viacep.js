
async function searchAddress(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json();

    } catch (error) {
        alert("Erro ao buscar cep")
    }
    return undefined;
}

async function handleZipCode() {
    const cep = document.getElementById('cep').value.replace('-', '');

    if (cep.length != 8) return;
    
    
    const addressValues = await searchAddress(cep);
    console.log(addressValues)

    if (!!addressValues) {
        fillAddressFields(addressValues);
        return;
    }
    return;
}

function fillAddressFields(addressValues) {
    const street = document.getElementById('logradouro');
    const neighborhood = document.getElementById('bairro');
    const city = document.getElementById('cidade');
    const state = document.getElementById('unidade-federacao');

    street.value = addressValues.logradouro;
    neighborhood.value = addressValues.bairro;
    city.value = addressValues.localidade;
    state.value = addressValues.uf;
}
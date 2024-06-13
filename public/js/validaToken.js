document.addEventListener("DOMContentLoaded", function(){
    const isHome = window.location.href.split("/",4)[3] === "index.html";
    const token = localStorage.getItem('token');

    if(isHome) {
        return;
    }

    if (!token){ //não existe o token, enviamos para o login
        window.location.href = 'index.html';
        return;
    }

    const tokenData = parseJwt(token)
    if (!(tokenData && tokenData.exp && tokenData.exp * 1000 > Date.now())){
        window.location.href= 'index.html';
        return;
    }
})

function parseJwt(token){
    try{
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace('-','+').replace('_','/')
        return JSON.parse(atob(base64))
    } catch (e){
        return null
    }

}

//Captura o botão logout pelo ID
const btnLogout = document.getElementById('logout')
if(btnLogout)
    //Adicionamos o listener no click
    btnLogout.addEventListener('click', function(){
        //Removemos o localStorage
        localStorage.removeItem('token')
        //Redirecionamos para o login
        window.location.href = 'index.html'
    })
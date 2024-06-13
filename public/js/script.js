// ######################################### FUNÇÃO PARA MOSTRAR A SENHA ############################################# 

document.addEventListener("DOMContentLoaded", function() {
    const togglePasswords = document.querySelectorAll('.alternar-senha');

    togglePasswords.forEach(function(togglePassword) {
        togglePassword.addEventListener('click', function(e) {
            const passwordInput = togglePassword.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.src = type === 'password' ? 'imagens/olho-fechado.png' : 'imagens/olho-aberto.png';
        });
    });
});



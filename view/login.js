const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

const validUsername = "organizador";
const validPassword = "123";

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validUsername && password === validPassword) {
     
        window.location.href = 'organizador.html';
    } else {
        
        errorMessage.style.display = 'block';
    }
});
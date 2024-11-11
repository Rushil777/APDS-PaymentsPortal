document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed'); // Add this line to verify the script is loaded

    document.getElementById('loginLink').addEventListener('click', function() {
        alert('Login link clicked!');
        window.location.href = 'login.html';
    });

    document.getElementById('registerLink').addEventListener('click', function() {
        alert('Register link clicked!');
        window.location.href = 'register.html';
    });
});

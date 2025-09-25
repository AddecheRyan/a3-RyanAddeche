function showMessage(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('statusMessage').innerHTML = '';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('statusMessage').innerHTML = '';
}

async function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Registration successful! Please login.', 'success');
            showLogin();
            document.getElementById('loginUsername').value = username;
        } else {
            showMessage(data.error, 'danger');
        }
    } catch (error) {
        showMessage('Registration failed. Please try again.', 'danger');
    }
}

async function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(`Welcome back, ${data.username}! Redirecting...`, 'success');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
        } else {
            showMessage(data.error, 'danger');
        }
    } catch (error) {
        showMessage('Login failed. Please try again.', 'danger');
    }
}

async function checkAuthStatus() {
  try {
    const response = await fetch('/auth/status');
    const data = await response.json();
    
    if (data.authenticated) {
      window.location.href = '/index.html';
    }
  } catch (error) {
  }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('submit', login);
    document.getElementById('register').addEventListener('submit', register);
    checkAuthStatus();
});
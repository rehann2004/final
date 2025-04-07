// ===== public/js/main.js =====
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  const messageDiv = document.getElementById('message');
  
  // Check if user is already logged in
  checkAuthStatus();
  
  function checkAuthStatus() {
    fetch('/api/auth/check')
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          window.location.href = '/dashboard.html';
        }
      })
      .catch(error => console.error('Error checking auth status:', error));
  }
  
  // Show register form
  showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });
  
  // Show login form
  showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
  
  // Handle login form submission
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.msg === 'Login successful') {
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      } else {
        showMessage(data.msg, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again.', 'error');
    });
  });
  
  // Handle register form submission
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.msg === 'User registered successfully') {
        showMessage('Registration successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      } else {
        showMessage(data.msg, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again.', 'error');
    });
  });
  
  // Display message
  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 5000);
  }
});

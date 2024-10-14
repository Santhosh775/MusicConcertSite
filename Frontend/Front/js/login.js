document.addEventListener('DOMContentLoaded', () => {
  const switchers = [...document.querySelectorAll('.switcher')];

  switchers.forEach(item => {
      item.addEventListener('click', function () {
          switchers.forEach(item => item.parentElement.classList.remove('is-active'));
          this.parentElement.classList.add('is-active');
      });
  });

  // Activate form based on URL parameter
  const params = new URLSearchParams(window.location.search);
  const formType = params.get('type'); // Get the 'type' parameter from the URL

  if (formType === 'register') {
      // Activate register form
      document.querySelector('.form-wrapper:nth-child(2)').classList.add('is-active');
      document.querySelector('.form-wrapper:nth-child(1)').classList.remove('is-active');
  } else {
      // Default to login form
      document.querySelector('.form-wrapper:nth-child(1)').classList.add('is-active');
      document.querySelector('.form-wrapper:nth-child(2)').classList.remove('is-active');
  }

  // Form validation and submission logic (kept as is)
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  // Backend URLs
  const loginUrl = 'http://localhost:5000/api/users/login';
  const signupUrl = 'http://localhost:5000/api/users/signup';

  signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;

      if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
      }

      if (validateEmail(email) && validatePassword(password)) {
          try {
              const response = await fetch(signupUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, email, password, confirmPassword }),
              });

              const data = await response.json();

              if (response.ok) {
                  console.log('Signup successful:', data);
                  alert('Signup successful');
                  const signupWrapper = document.querySelector('.form-wrapper:nth-child(2)');
                  signupWrapper.classList.remove('is-active');
                  const loginWrapper = document.querySelector('.form-wrapper:nth-child(1)');
                  loginWrapper.classList.add('is-active');
              } else {
                  alert(data.message || 'Signup failed');
              }
          } catch (error) {
              console.error('Error during signup:', error);
              alert('An error occurred during signup.');
          }
      } else {
          alert('Please enter valid data.');
      }
  });

  // Handle Login Form Submission
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (validateEmail(email) && validatePassword(password)) {
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the username in localStorage
                localStorage.setItem('username', data.user.username);

                if (email === "santhosh@gmail.com" && password === "12345678") {
                    alert('Login successful');
                    window.location.href = './admin.html';
                } else {
                    alert('Login successful');
                    window.location.href = './home.html';
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    } else {
        alert('Please enter a valid email and password.');
    }
});


  function validateEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(email);
  }

  function validatePassword(password) {
      return password.length >= 6;
  }
});

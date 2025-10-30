// ===== Password Toggle for all password fields =====
document.querySelectorAll('.password-wrapper').forEach(wrapper => {
  const input = wrapper.querySelector('input');
  const toggle = wrapper.querySelector('.toggle-password');

  toggle.addEventListener('click', () => {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);

    // Toggle icon classes
    toggle.classList.toggle('fa-eye');
    toggle.classList.toggle('fa-eye-slash');
  });
});

// ===== Form Switching (Login ↔ Signup) =====
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

if (showSignup) {
  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
  });
}

if (showLogin) {
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  });
}

// ===== Login Form =====
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    try {
      const response = await fetch('https://pawconnect-u65b.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      if (data.success) {
        // Save login info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username || email.split('@')[0]);
        localStorage.setItem("role", role);

        alert("✅ Login successful");
        window.location.href = "index.html"; // redirect to homepage
      } else {
        alert("❌ " + data.message);
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Network error");
    }
  });
}

// ===== Signup Form =====
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const role = document.getElementById('signupRole').value;

    try {
      const response = await fetch('https://pawconnect-u65b.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password, role })
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Signup successful! Please login.");
        signupForm.reset();
        signupForm.style.display = "none";
        loginForm.style.display = "block";
      } else {
        alert("❌ " + data.message);
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Network error");
    }
  });
}

// ===== Optional: Auto redirect if already logged in =====
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    // Already logged in, redirect to homepage
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
    }
  }
});

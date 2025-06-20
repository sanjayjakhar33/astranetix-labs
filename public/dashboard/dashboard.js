// dashboard.js

// Handle login
if (window.location.pathname.includes("login.html")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard/";
    } else {
      alert(data.error);
    }
  });
}

// Handle forgot password
if (window.location.pathname.includes("forgot.html")) {
  document.getElementById("forgotForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) window.location.href = "/dashboard/reset.html";
  });
}

// Handle reset password
if (window.location.pathname.includes("reset.html")) {
  document.getElementById("resetForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const otp = e.target.otp.value;
    const newPassword = e.target.newPassword.value;

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) window.location.href = "/dashboard/login.html";
  });
}

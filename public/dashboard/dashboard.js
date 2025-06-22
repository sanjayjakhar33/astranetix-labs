// dashboard.js

// 🔐 Protect dashboard (only for /dashboard/ or /dashboard/index.html)
if (window.location.pathname === "/dashboard/" || window.location.pathname === "/dashboard/index.html") {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/dashboard/login.html"; // Redirect if not logged in
  }
}

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

// 🚪 Logout function
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/dashboard/login.html";
}

// 🔐 Protect /dashboard/add-admin.html
if (window.location.pathname.includes("add-admin.html")) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/dashboard/login.html";
  }

  document.getElementById("addAdminForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      username: form.username.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const msg = document.getElementById("msg");
    msg.innerText = data.message || data.error;
    msg.style.color = res.ok ? "lime" : "red";
  });
}
// =============================
// 🧾 Invoice: Generate Invoice
// =============================
if (window.location.pathname.includes("invoice.html")) {
  document.getElementById("invoiceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const form = e.target;
    const payload = {
      clientName: form.clientName.value,
      clientEmail: form.clientEmail.value,
      products: []
    };

    const productNames = form.querySelectorAll(".product-name");
    const productPrices = form.querySelectorAll(".product-price");

    for (let i = 0; i < productNames.length; i++) {
      payload.products.push({
        name: productNames[i].value,
        price: parseFloat(productPrices[i].value)
      });
    }

    const res = await fetch("/api/invoice/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Invoice saved successfully!");
      window.print(); // Trigger browser print
      form.reset();
    } else {
      alert("❌ Error: " + data.error);
    }
  });

  // ➕ Add more product rows dynamically
  document.getElementById("addProductBtn").addEventListener("click", () => {
    const container = document.getElementById("productContainer");
    const row = document.createElement("div");
    row.className = "product-row";
    row.innerHTML = `
      <input type="text" class="product-name" placeholder="Product Name" required />
      <input type="number" class="product-price" placeholder="Price" required />
    `;
    container.appendChild(row);
  });
}

// =============================
// 📜 Invoice: History Page
// =============================
if (window.location.pathname.includes("invoice-history.html")) {
  const token = localStorage.getItem("token");

  fetch("/api/invoice/history", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("historyList");
      if (!data || data.length === 0) {
        container.innerHTML = "<p>No invoices found.</p>";
        return;
      }

      data.forEach(inv => {
        const date = new Date(inv.createdAt).toLocaleString();
        const items = inv.products.map(p => `<li>${p.name}: ₹${p.price.toFixed(2)}</li>`).join("");
        const total = inv.products.reduce((sum, p) => sum + p.price, 0);
        const gst = total * 0.18;
        const grandTotal = total + gst;

        container.innerHTML += `
          <div class="entry">
            <p><strong>Client:</strong> ${inv.clientName} (${inv.clientEmail})</p>
            <p><strong>Date:</strong> ${date}</p>
            <ul>${items}</ul>
            <p><strong>Subtotal:</strong> ₹${total.toFixed(2)}</p>
            <p><strong>GST (18%):</strong> ₹${gst.toFixed(2)}</p>
            <p><strong>Total:</strong> ₹${grandTotal.toFixed(2)}</p>
          </div>
        `;
      });
    })
    .catch(() => {
      document.getElementById("historyList").innerHTML = "<p style='color:red;'>Error loading invoices</p>";
    });
}


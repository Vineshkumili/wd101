const form = document.getElementById("regForm");
const tableBody = document.getElementById("tableBody");

let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
renderTable();

function validateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age >= 18 && age <= 55;
}

function renderTable() {
  tableBody.innerHTML = registrations.length
    ? registrations.map(entry => `
      <tr>
        <td>${entry.name}</td>
        <td>${entry.email}</td>
        <td>${"*".repeat(entry.password.length)}</td>
        <td>${entry.dob}</td>
        <td>${entry.termsAccepted ? "Yes" : "No"}</td>
      </tr>
    `).join("")
    : '<tr class="empty-row"><td colspan="5">No registrations yet</td></tr>';
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  ["name", "email", "password", "dob"].forEach(id => document.getElementById(id).classList.remove("error"));
  ["nameError", "emailError", "passwordError", "dobError", "termsError"].forEach(id => document.getElementById(id).textContent = "");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const termsAccepted = document.getElementById("terms").checked;

  let isValid = true;

  if (!name || name.length < 2) {
    document.getElementById("nameError").textContent = "Name must be at least 2 characters";
    document.getElementById("name").classList.add("error");
    isValid = false;
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Invalid email address";
    document.getElementById("email").classList.add("error");
    isValid = false;
  }

  if (!password || password.length < 6) {
    document.getElementById("passwordError").textContent = "Password must be at least 6 characters";
    document.getElementById("password").classList.add("error");
    isValid = false;
  }

  if (!dob || !validateAge(dob)) {
    document.getElementById("dobError").textContent = "Age must be between 18 and 55";
    document.getElementById("dob").classList.add("error");
    isValid = false;
  }

  if (!termsAccepted) {
    document.getElementById("termsError").textContent = "You must accept the terms";
    isValid = false;
  }

  if (!isValid) return;

  registrations.push({ name, email, password, dob, termsAccepted });
  localStorage.setItem("registrations", JSON.stringify(registrations));

  renderTable();
  form.reset();
});

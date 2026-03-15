// Firebase imports for browser + GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD55TZo8jQg7lI2bnO68yn2z3a9KsOsQWs",
  authDomain: "computer-training-d3147.firebaseapp.com",
  projectId: "computer-training-d3147",
  storageBucket: "computer-training-d3147.firebasestorage.app",
  messagingSenderId: "913118748940",
  appId: "1:913118748940:web:6058740970bf85f9766929",
  measurementId: "G-CJPNVG3JD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Student data
let students = [];

// Show section
function show(id) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hide");
  });

  document.getElementById(id).classList.remove("hide");
}

// Register student
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  const course = document.getElementById("course").value;

  if (!name || !email || !pass) {
    document.getElementById("regmsg").innerHTML = "Please fill in all fields";
    return;
  }

  students.push({
    name: name,
    email: email,
    password: pass,
    course: course
  });

  document.getElementById("regmsg").innerHTML = "Student Registered";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("course").selectedIndex = 0;

  updateTable();
}

// Login student
function login() {
  const email = document.getElementById("logemail").value.trim();
  const pass = document.getElementById("logpass").value.trim();

  const user = students.find(
    (student) => student.email === email && student.password === pass
  );

  if (user) {
    document.getElementById("loginmsg").innerHTML =
      "Login Success<br>Name: " + user.name + "<br>Course: " + user.course;
  } else {
    document.getElementById("loginmsg").innerHTML = "Wrong Login";
  }
}

// Update students table
function updateTable() {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  students.forEach((student) => {
    const row = `
      <tr>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// Show home first
show("home");

// Make functions available to buttons in HTML
window.show = show;
window.register = register;
window.login = login;

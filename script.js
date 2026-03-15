import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD55TZo8jQg7lI2bnO68yn2z3a9KsOsQWs",
  authDomain: "computer-training-d3147.firebaseapp.com",
  projectId: "computer-training-d3147",
  storageBucket: "computer-training-d3147.firebasestorage.app",
  messagingSenderId: "913118748940",
  appId: "1:913118748940:web:6058740970bf85f9766929",
  measurementId: "G-CJPNVG3JD2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ---------- TAB / PAGE SWITCH ----------
function switchSection(id) {
  const pages = document.querySelectorAll(".page");
  const buttons = document.querySelectorAll(".nav-btn");

  pages.forEach((page) => {
    page.classList.remove("active");
  });

  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  const targetPage = document.getElementById(id);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  const activeButton = document.querySelector(`[data-section="${id}"]`);
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// Make it available globally
window.switchSection = switchSection;

// ---------- REGISTER ----------
async function registerStudent() {
  const name = document.getElementById("regName")?.value.trim();
  const idNumber = document.getElementById("regIdNumber")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const phone = document.getElementById("regPhone")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();
  const course = document.getElementById("regCourse")?.value;
  const address = document.getElementById("regAddress")?.value.trim();
  const msg = document.getElementById("registerMessage");

  if (!name || !email || !password || !course) {
    if (msg) msg.textContent = "Please fill in all required fields.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    await addDoc(collection(db, "students"), {
      fullName: name,
      idNumber: idNumber || "",
      email,
      phone: phone || "",
      course,
      address: address || "",
      examScore: 0,
      attendance: 0,
      certificateReady: false
    });

    if (msg) msg.textContent = "Student registered successfully.";

    document.getElementById("registerForm")?.reset();
    loadStudents();
  } catch (error) {
    if (msg) msg.textContent = error.message;
  }
}

window.registerStudent = registerStudent;

// ---------- LOGIN ----------
async function loginUser() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  const msg = document.getElementById("loginMessage");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (msg) msg.textContent = "Login successful.";
    switchSection("portal");
  } catch (error) {
    if (msg) msg.textContent = "Login failed: " + error.message;
  }
}

window.loginUser = loginUser;

// ---------- LOAD STUDENTS ----------
async function loadStudents() {
  const tableBody = document.getElementById("studentTableBody");
  const statStudents = document.getElementById("statStudents");
  const metricStudents = document.getElementById("metricStudents");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "students"));
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      count++;

      const row = `
        <tr>
          <td>${data.fullName || ""}</td>
          <td>${data.email || ""}</td>
          <td>${data.course || ""}</td>
          <td>${data.examScore || 0}%</td>
          <td>${data.attendance || 0}%</td>
        </tr>
      `;

      tableBody.innerHTML += row;
    });

    if (statStudents) statStudents.textContent = count;
    if (metricStudents) metricStudents.textContent = count;
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

// ---------- START ----------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");
      switchSection(section);
    });
  });

  document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    registerStudent();
  });

  document.getElementById("loginBtn")?.addEventListener("click", loginUser);

  switchSection("home");
  loadStudents();
});

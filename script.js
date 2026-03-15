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
  signInWithEmailAndPassword,
  signOut
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

let students = [];
let currentStudent = null;

const COURSES = [
  {
    name: "Computer Basics",
    description: "Introduction to computers and Windows basics.",
    fee: "R450"
  },
  {
    name: "Microsoft Word",
    description: "Learn typing, formatting, letters, and CV creation.",
    fee: "R500"
  },
  {
    name: "Microsoft Excel",
    description: "Learn spreadsheets, formulas, tables, and calculations.",
    fee: "R550"
  },
  {
    name: "PowerPoint",
    description: "Create beautiful presentations and slideshows.",
    fee: "R450"
  }
];

function switchSection(id) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const targetPage = document.getElementById(id);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  const targetBtn = document.querySelector(`.nav-btn[data-section="${id}"]`);
  if (targetBtn) {
    targetBtn.classList.add("active");
  }
}

function renderCourses() {
  const courseGrid = document.getElementById("courseGrid");
  if (!courseGrid) return;

  courseGrid.innerHTML = COURSES.map((course) => `
    <article class="card">
      <h3>${course.name}</h3>
      <p>${course.description}</p>
      <div class="notice-box mt-16">Fee: <strong>${course.fee}</strong></div>
    </article>
  `).join("");
}

function updateDashboardCounts() {
  const totalStudents = students.length;
  const attendanceRecords = 0;
  const certificatesReady = students.filter((student) => student.certificateReady).length;

  const avgScore = students.length
    ? Math.round(students.reduce((sum, student) => sum + (Number(student.examScore) || 0), 0) / students.length)
    : 0;

  const statStudents = document.getElementById("statStudents");
  const statCertificates = document.getElementById("statCertificates");
  const statAttendance = document.getElementById("statAttendance");
  const metricStudents = document.getElementById("metricStudents");
  const metricAvgScore = document.getElementById("metricAvgScore");
  const adminStudents = document.getElementById("adminStudents");
  const adminAttendance = document.getElementById("adminAttendance");
  const adminReady = document.getElementById("adminReady");

  if (statStudents) statStudents.textContent = totalStudents;
  if (statCertificates) statCertificates.textContent = certificatesReady;
  if (statAttendance) statAttendance.textContent = attendanceRecords;
  if (metricStudents) metricStudents.textContent = totalStudents;
  if (metricAvgScore) metricAvgScore.textContent = `${avgScore}%`;
  if (adminStudents) adminStudents.textContent = totalStudents;
  if (adminAttendance) adminAttendance.textContent = attendanceRecords;
  if (adminReady) adminReady.textContent = certificatesReady;
}

function renderStudentPortal() {
  const portalEmpty = document.getElementById("portalEmpty");
  const portalContent = document.getElementById("portalContent");
  const metricUser = document.getElementById("metricUser");
  const sessionInfo = document.getElementById("sessionInfo");

  if (!currentStudent) {
    if (portalEmpty) portalEmpty.classList.remove("hidden");
    if (portalContent) portalContent.classList.add("hidden");
    if (metricUser) metricUser.textContent = "Guest";
    if (sessionInfo) sessionInfo.textContent = "No user logged in.";
    return;
  }

  if (portalEmpty) portalEmpty.classList.add("hidden");
  if (portalContent) portalContent.classList.remove("hidden");
  if (metricUser) metricUser.textContent = currentStudent.email || "Student";
  if (sessionInfo) sessionInfo.textContent = `Logged in as ${currentStudent.email}`;

  document.getElementById("portalAvatar").textContent = currentStudent.fullName
    ? currentStudent.fullName.charAt(0).toUpperCase()
    : "S";
  document.getElementById("portalName").textContent = currentStudent.fullName || "-";
  document.getElementById("portalCourse").textContent = currentStudent.course || "-";
  document.getElementById("portalEmail").textContent = currentStudent.email || "-";
  document.getElementById("portalScore").textContent = `${currentStudent.examScore || 0}%`;
  document.getElementById("portalAttendance").textContent = `${currentStudent.attendance || 0}%`;
  document.getElementById("portalCertificate").textContent = currentStudent.certificateReady ? "Ready" : "Pending";
  document.getElementById("portalStudentId").textContent = currentStudent.id || "-";
}

function renderCertificatesList() {
  const list = document.getElementById("certificateStudentList");
  if (!list) return;

  list.innerHTML = students.map((student) => `
    <div class="student-select-item">
      <div>
        <strong>${student.fullName || "-"}</strong>
        <p>${student.course || "-"}</p>
      </div>
      <button class="btn outline use-cert-btn" type="button" data-email="${student.email}">Select</button>
    </div>
  `).join("");

  document.querySelectorAll(".use-cert-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const student = students.find((item) => item.email === btn.dataset.email);
      if (student) {
        fillCertificate(student);
      }
    });
  });
}

function fillCertificate(student) {
  if (!student) return;

  const brandName = document.getElementById("brandName")?.value || "CoTeSy IT Services";
  const directorName = document.getElementById("directorName")?.value || "CoTeSy Director / Trainer";

  document.getElementById("certBrand").textContent = brandName;
  document.getElementById("certBrandFooter").textContent = brandName;
  document.getElementById("certDirector").textContent = directorName;
  document.getElementById("certStudentName").textContent = student.fullName || "Student Name";
  document.getElementById("certCourse").textContent = student.course || "Course Name";
  document.getElementById("certStudentId").textContent = student.id || "CTS-000";
  document.getElementById("certScore").textContent = `${student.examScore || 0}%`;
  document.getElementById("certDate").textContent = new Date().toLocaleDateString();
}

async function loadStudents() {
  const studentTableBody = document.getElementById("studentTableBody");
  const adminTableBody = document.getElementById("adminTableBody");

  if (!studentTableBody || !adminTableBody) return;

  studentTableBody.innerHTML = "";
  adminTableBody.innerHTML = "";
  students = [];

  try {
    const snapshot = await getDocs(collection(db, "students"));

    snapshot.forEach((doc) => {
      const data = doc.data();
      students.push(data);

      const studentRow = `
        <tr>
          <td>${data.id || "-"}</td>
          <td>${data.fullName || "-"}</td>
          <td>${data.email || "-"}</td>
          <td>${data.course || "-"}</td>
          <td>${data.examScore || 0}%</td>
          <td>${data.attendance || 0}%</td>
        </tr>
      `;

      const adminRow = `
        <tr>
          <td>${data.fullName || "-"}</td>
          <td>${data.email || "-"}</td>
          <td>${data.course || "-"}</td>
          <td>${data.examScore || 0}%</td>
          <td>${data.attendance || 0}%</td>
        </tr>
      `;

      studentTableBody.innerHTML += studentRow;
      adminTableBody.innerHTML += adminRow;
    });

    updateDashboardCounts();
    renderCertificatesList();

    if (currentStudent) {
      const refreshed = students.find((student) => student.email === currentStudent.email);
      if (refreshed) currentStudent = refreshed;
    }

    renderStudentPortal();
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

async function registerStudent(e) {
  e.preventDefault();

  const fullName = document.getElementById("regName").value.trim();
  const idNumber = document.getElementById("regIdNumber").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const course = document.getElementById("regCourse").value;
  const address = document.getElementById("regAddress").value.trim();
  const registerMessage = document.getElementById("registerMessage");
  const whatsappLink = document.getElementById("whatsappLink");

  if (!fullName || !idNumber || !email || !phone || !password || !course) {
    registerMessage.textContent = "Please fill in all required fields.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    const studentId = "CTS-" + Date.now();

    await addDoc(collection(db, "students"), {
      id: studentId,
      fullName,
      idNumber,
      email,
      phone,
      course,
      address,
      examScore: 0,
      attendance: 0,
      certificateReady: false
    });

    registerMessage.textContent = "Student registered successfully.";

    const message = `New CoTeSy registration:%0AName: ${fullName}%0AEmail: ${email}%0ACourse: ${course}%0APhone: ${phone}`;
    whatsappLink.href = `https://wa.me/27720654503?text=${message}`;
    whatsappLink.classList.remove("hidden");

    document.getElementById("registerForm").reset();
    await loadStudents();
    switchSection("register");
  } catch (error) {
    registerMessage.textContent = error.message;
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  try {
    await signInWithEmailAndPassword(auth, email, password);

    currentStudent = students.find((student) => student.email === email) || null;

    loginMessage.textContent = "Login successful.";
    renderStudentPortal();

    if (currentStudent) {
      fillCertificate(currentStudent);
    }

    switchSection("portal");
  } catch (error) {
    loginMessage.textContent = "Login failed: " + error.message;
  }
}

async function logoutUser() {
  try {
    await signOut(auth);
    currentStudent = null;
    renderStudentPortal();
    switchSection("home");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

function setupExamArea() {
  const examSelect = document.getElementById("examSelect");
  if (!examSelect) return;

  examSelect.innerHTML = `
    <option>Computer Basics Test</option>
    <option>Microsoft Word Test</option>
    <option>Microsoft Excel Test</option>
    <option>PowerPoint Test</option>
  `;

  document.getElementById("examCourse").textContent = "Course-based exam";
  document.getElementById("examPassMark").textContent = "50%";

  const examQuestions = document.getElementById("examQuestions");
  if (examQuestions) {
    examQuestions.innerHTML = `
      <div class="notice-box">
        <p><strong>1. What is a mouse used for?</strong></p>
        <label><input type="radio" name="q1" value="correct"> To move the pointer</label><br>
        <label><input type="radio" name="q1" value="wrong"> To print a page</label>
      </div>

      <div class="notice-box mt-16">
        <p><strong>2. Which program is used for typing letters?</strong></p>
        <label><input type="radio" name="q2" value="correct"> Microsoft Word</label><br>
        <label><input type="radio" name="q2" value="wrong"> Paint</label>
      </div>
    `;
  }
}

function setupAttendanceArea() {
  const attendanceActions = document.getElementById("attendanceActions");
  const attendanceTableBody = document.getElementById("attendanceTableBody");

  if (!attendanceActions || !attendanceTableBody) return;

  attendanceActions.innerHTML = `
    <div class="student-action-card">
      <h4>Attendance tools ready</h4>
      <p>You can expand this next with real Firebase attendance saving.</p>
      <span class="badge pending">Setup Stage</span>
    </div>
  `;

  attendanceTableBody.innerHTML = `
    <tr>
      <td>-</td>
      <td>No records yet</td>
      <td>-</td>
      <td><span class="badge pending">Pending</span></td>
    </tr>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");
      switchSection(section);
    });
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-go");
      switchSection(section);
    });
  });

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", registerStudent);
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", loginUser);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }

  const useLoggedStudentBtn = document.getElementById("useLoggedStudentBtn");
  if (useLoggedStudentBtn) {
    useLoggedStudentBtn.addEventListener("click", () => {
      if (currentStudent) fillCertificate(currentStudent);
    });
  }

  const brandName = document.getElementById("brandName");
  const directorName = document.getElementById("directorName");
  if (brandName) {
    brandName.addEventListener("input", () => {
      if (currentStudent) fillCertificate(currentStudent);
    });
  }
  if (directorName) {
    directorName.addEventListener("input", () => {
      if (currentStudent) fillCertificate(currentStudent);
    });
  }

  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => window.print());
  }

  setupExamArea();
  setupAttendanceArea();
  renderCourses();
  switchSection("home");
  await loadStudents();
});

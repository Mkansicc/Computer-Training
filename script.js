import { initializeApp, deleteApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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

const ADMIN_EMAILS = ["mkansicc@gmail.com"];
const WHATSAPP_NUMBER = "27720654503";

const COURSES = [
  { name: "Computer Basics", description: "Introduction to computers and Windows basics.", fee: "R450" },
  { name: "Microsoft Word", description: "Learn typing, formatting, letters, and CV creation.", fee: "R500" },
  { name: "Microsoft Excel", description: "Learn spreadsheets, formulas, tables, and calculations.", fee: "R550" },
  { name: "PowerPoint", description: "Create beautiful presentations and slideshows.", fee: "R450" }
];

let students = [];
let attendanceRecords = [];
let currentStudent = null;
let currentUserRole = null;
let currentUserEmail = null;

function getRoleByEmail(email = "") {
  return ADMIN_EMAILS.map((item) => item.toLowerCase()).includes(email.toLowerCase()) ? "admin" : "student";
}

function setAppVisibility(isLoggedIn) {
  const loginPage = document.getElementById("loginPage");
  const appShell = document.getElementById("appShell");

  if (isLoggedIn) {
    loginPage.classList.remove("active");
    loginPage.classList.add("hidden");
    appShell.classList.remove("hidden");
  } else {
    loginPage.classList.add("active");
    loginPage.classList.remove("hidden");
    appShell.classList.add("hidden");
  }
}

function applyRoleVisibility(role) {
  document.querySelectorAll(".nav-btn[data-role]").forEach((btn) => {
    const roles = (btn.dataset.role || "").split(",");
    if (roles.includes(role)) btn.classList.remove("role-hidden");
    else btn.classList.add("role-hidden");
  });
}

function switchSection(id) {
  if (!currentUserRole) return;

  const allowedStudentSections = ["home", "courses", "portal"];
  if (currentUserRole === "student" && !allowedStudentSections.includes(id)) id = "home";

  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => btn.classList.remove("active"));

  const targetPage = document.getElementById(id);
  const targetBtn = document.querySelector(`.nav-btn[data-section="${id}"]`);

  if (targetPage) targetPage.classList.add("active");
  if (targetBtn) targetBtn.classList.add("active");
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
  const certificatesReady = students.filter((student) => student.certificateReady).length;
  const avgScore = students.length
    ? Math.round(students.reduce((sum, item) => sum + (Number(item.examScore) || 0), 0) / students.length)
    : 0;

  setText("statStudents", totalStudents);
  setText("statCertificates", certificatesReady);
  setText("statAvgScore", `${avgScore}%`);
  setText("metricStudents", totalStudents);
  setText("metricAvg", `${avgScore}%`);
  setText("adminStudents", totalStudents);
  setText("adminReady", certificatesReady);
  setText("adminAvgScore", `${avgScore}%`);
}

function updateSessionUI() {
  if (!currentUserEmail) {
    setText("metricUser", "Guest");
    setText("metricRole", "No active session");
    setText("sessionInfo", "No user logged in.");
    return;
  }

  setText("metricUser", currentUserEmail);
  setText("metricRole", currentUserRole === "admin" ? "Administrator account" : "Student account");
  setText("sessionInfo", `Logged in as ${currentUserEmail} (${currentUserRole})`);
}

function renderPortal() {
  const portalEmpty = document.getElementById("portalEmpty");
  const portalContent = document.getElementById("portalContent");
  const avatar = document.getElementById("portalAvatar");
  const photo = document.getElementById("portalPhoto");

  if (!portalEmpty || !portalContent) return;

  if (!currentStudent) {
    portalEmpty.classList.remove("hidden");
    portalContent.classList.add("hidden");
    return;
  }

  portalEmpty.classList.add("hidden");
  portalContent.classList.remove("hidden");

  setText("portalName", currentStudent.fullName || "-");
  setText("portalCourse", currentStudent.course || "-");
  setText("portalEmail", currentStudent.email || "-");
  setText("portalScore", `${currentStudent.examScore || 0}%`);
  setText("portalAttendance", `${currentStudent.attendance || 0}%`);
  setText("portalCertificate", currentStudent.certificateReady ? "Ready" : "Pending");
  setText("portalStudentId", currentStudent.id || "-");

  if (currentStudent.photoUrl) {
    photo.src = currentStudent.photoUrl;
    photo.classList.remove("hidden");
    avatar.classList.add("hidden");
  } else {
    avatar.textContent = (currentStudent.fullName || "S").charAt(0).toUpperCase();
    avatar.classList.remove("hidden");
    photo.classList.add("hidden");
  }
}

function fillCertificate(student) {
  if (!student) return;

  const brandName = document.getElementById("brandName")?.value || "CoTeSy IT Services";
  const directorName = document.getElementById("directorName")?.value || "CoTeSy Director / Trainer";

  setText("certBrand", brandName);
  setText("certBrandFooter", brandName);
  setText("certDirector", directorName);
  setText("certStudentName", student.fullName || "Student Name");
  setText("certCourse", student.course || "Course Name");
  setText("certStudentId", student.id || "CTS-000");
  setText("certScore", `${student.examScore || 0}%`);
  setText("certDate", new Date().toLocaleDateString());

  const qrBox = document.getElementById("certQr");
  if (qrBox) {
    qrBox.innerHTML = "";
    const qrText = `CoTeSy Certificate | Name: ${student.fullName || ""} | Student ID: ${student.id || ""} | Course: ${student.course || ""} | Score: ${student.examScore || 0}%`;
    new QRCode(qrBox, {
      text: qrText,
      width: 110,
      height: 110
    });
  }
}

function renderCertificateStudentList() {
  const list = document.getElementById("certificateStudentList");
  if (!list) return;

  list.innerHTML = students.map((student) => `
    <div class="student-select-item">
      <div>
        <strong>${student.fullName || "-"}</strong>
        <p>${student.course || "-"}</p>
      </div>
      <button class="btn outline" type="button" data-cert="${student.docId}">Select</button>
    </div>
  `).join("");

  list.querySelectorAll("[data-cert]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const student = students.find((item) => item.docId === btn.dataset.cert);
      if (student) fillCertificate(student);
    });
  });
}

function renderAdminTable() {
  const adminTableBody = document.getElementById("adminTableBody");
  if (!adminTableBody) return;

  adminTableBody.innerHTML = students.map((student) => `
    <tr>
      <td>${student.id || "-"}</td>
      <td>${student.fullName || "-"}</td>
      <td>${student.email || "-"}</td>
      <td>${student.course || "-"}</td>
      <td>${student.examScore || 0}%</td>
      <td>${student.attendance || 0}%</td>
      <td>
        <div class="table-actions">
          <button class="btn tiny outline" type="button" data-edit="${student.docId}">Edit</button>
          <button class="btn tiny danger" type="button" data-delete="${student.docId}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  adminTableBody.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => startEditStudent(btn.dataset.edit));
  });

  adminTableBody.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteStudentRecord(btn.dataset.delete));
  });
}

function renderStudentSelects() {
  const examSelect = document.getElementById("examStudentSelect");
  const attendanceSelect = document.getElementById("attendanceStudentSelect");

  const options = students.map((student) => `
    <option value="${student.docId}">${student.fullName} - ${student.course}</option>
  `).join("");

  if (examSelect) examSelect.innerHTML = options || `<option value="">No students</option>`;
  if (attendanceSelect) attendanceSelect.innerHTML = options || `<option value="">No students</option>`;
}

function renderAttendanceTable() {
  const attendanceTableBody = document.getElementById("attendanceTableBody");
  if (!attendanceTableBody) return;

  if (!attendanceRecords.length) {
    attendanceTableBody.innerHTML = `
      <tr>
        <td>-</td>
        <td>No records yet</td>
        <td>-</td>
        <td>-</td>
      </tr>
    `;
    return;
  }

  attendanceTableBody.innerHTML = attendanceRecords.map((item) => `
    <tr>
      <td>${item.date}</td>
      <td>${item.studentName}</td>
      <td>${item.course}</td>
      <td><span class="badge ${item.status === "Present" ? "present" : "absent"}">${item.status}</span></td>
    </tr>
  `).join("");
}

function startEditStudent(docId) {
  if (currentUserRole !== "admin") return;

  const student = students.find((item) => item.docId === docId);
  if (!student) return;

  document.getElementById("editDocId").value = student.docId || "";
  document.getElementById("regName").value = student.fullName || "";
  document.getElementById("regIdNumber").value = student.idNumber || "";
  document.getElementById("regEmail").value = student.email || "";
  document.getElementById("regPhone").value = student.phone || "";
  document.getElementById("regPassword").value = "";
  document.getElementById("regCourse").value = student.course || "Computer Basics";
  document.getElementById("regPhotoUrl").value = student.photoUrl || "";
  document.getElementById("regAddress").value = student.address || "";

  setText("registerTitle", "Edit Student");
  setText("saveStudentBtn", "Update Student");
  document.getElementById("cancelEditBtn").classList.remove("hidden");
  switchSection("register");
}

function resetStudentForm() {
  document.getElementById("registerForm")?.reset();
  document.getElementById("editDocId").value = "";
  setText("registerTitle", "Register Student");
  setText("saveStudentBtn", "Register Student");
  document.getElementById("cancelEditBtn").classList.add("hidden");
  setText("registerMessage", "");
}

async function loadStudents() {
  students = [];

  try {
    const snapshot = await getDocs(collection(db, "students"));
    snapshot.forEach((snap) => {
      students.push({
        docId: snap.id,
        ...snap.data()
      });
    });

    students.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));

    updateDashboardCounts();
    renderAdminTable();
    renderCertificateStudentList();
    renderStudentSelects();

    if (currentUserRole === "student" && currentUserEmail) {
      currentStudent = students.find((student) => student.email === currentUserEmail) || null;
    }

    if (currentUserRole === "admin" && currentStudent?.docId) {
      const refreshed = students.find((student) => student.docId === currentStudent.docId);
      if (refreshed) currentStudent = refreshed;
    }

    renderPortal();
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

async function createStudentAuthWithSecondaryApp(email, password) {
  const existing = getApps().find((instance) => instance.name === "Secondary");
  if (existing) await deleteApp(existing);

  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  const secondaryAuth = getAuth(secondaryApp);

  try {
    await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await signOut(secondaryAuth);
  } finally {
    await deleteApp(secondaryApp);
  }
}

async function saveStudent(e) {
  e.preventDefault();
  if (currentUserRole !== "admin") return;

  const editDocId = document.getElementById("editDocId").value.trim();
  const fullName = document.getElementById("regName").value.trim();
  const idNumber = document.getElementById("regIdNumber").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const course = document.getElementById("regCourse").value;
  const photoUrl = document.getElementById("regPhotoUrl").value.trim();
  const address = document.getElementById("regAddress").value.trim();
  const registerMessage = document.getElementById("registerMessage");
  const whatsappLink = document.getElementById("whatsappLink");

  if (!fullName || !idNumber || !email || !phone || !course) {
    setText("registerMessage", "Please fill in all required fields.");
    return;
  }

  try {
    if (editDocId) {
      const current = students.find((item) => item.docId === editDocId);
      if (!current) {
        setText("registerMessage", "Student record not found.");
        return;
      }

      await updateDoc(doc(db, "students", editDocId), {
        fullName,
        idNumber,
        email,
        phone,
        course,
        photoUrl,
        address
      });

      setText("registerMessage", "Student updated successfully.");
      resetStudentForm();
      await loadStudents();
      return;
    }

    if (!password) {
      setText("registerMessage", "Password is required for new student registration.");
      return;
    }

    const studentId = "CTS-" + Date.now();

    await createStudentAuthWithSecondaryApp(email, password);

    await addDoc(collection(db, "students"), {
      id: studentId,
      fullName,
      idNumber,
      email,
      phone,
      course,
      photoUrl,
      address,
      examScore: 0,
      attendance: 0,
      certificateReady: false,
      createdAt: new Date().toISOString()
    });

    const message = `New CoTeSy registration:%0AName: ${fullName}%0AEmail: ${email}%0ACourse: ${course}%0APhone: ${phone}`;
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    whatsappLink.classList.remove("hidden");

    setText("registerMessage", "Student registered successfully.");
    resetStudentForm();
    await loadStudents();
  } catch (error) {
    setText("registerMessage", error.message);
  }
}

async function deleteStudentRecord(docId) {
  if (currentUserRole !== "admin") return;

  const student = students.find((item) => item.docId === docId);
  if (!student) return;

  const ok = window.confirm(`Delete ${student.fullName}? This removes the Firestore student record only.`);
  if (!ok) return;

  try {
    await deleteDoc(doc(db, "students", docId));
    if (currentStudent?.docId === docId) currentStudent = null;
    await loadStudents();
  } catch (error) {
    alert("Delete failed: " + error.message);
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    setText("loginMessage", "Please enter email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setText("loginMessage", "");
  } catch (error) {
    setText("loginMessage", "Login failed: " + error.message);
  }
}

async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

async function submitExam(e) {
  e.preventDefault();
  if (currentUserRole !== "admin") return;

  const docId = document.getElementById("examStudentSelect").value;
  const student = students.find((item) => item.docId === docId);
  if (!student) {
    setText("examMessage", "Please select a student.");
    return;
  }

  const answers = ["q1", "q2", "q3", "q4"];
  let score = 0;

  answers.forEach((name) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    score += Number(checked?.value || 0);
  });

  const percent = Math.round((score / answers.length) * 100);
  const certificateReady = percent >= 50;

  try {
    await updateDoc(doc(db, "students", docId), {
      examScore: percent,
      certificateReady
    });

    setText("examMessage", `Exam saved successfully. Score: ${percent}%`);
    document.getElementById("examForm").reset();
    await loadStudents();
  } catch (error) {
    setText("examMessage", error.message);
  }
}

async function saveAttendance() {
  if (currentUserRole !== "admin") return;

  const docId = document.getElementById("attendanceStudentSelect").value;
  const status = document.getElementById("attendanceStatus").value;
  const student = students.find((item) => item.docId === docId);

  if (!student) {
    setText("attendanceMessage", "Please select a student.");
    return;
  }

  const newAttendance = status === "Present"
    ? Math.min(100, Number(student.attendance || 0) + 10)
    : Math.max(0, Number(student.attendance || 0) - 5);

  try {
    await updateDoc(doc(db, "students", docId), {
      attendance: newAttendance
    });

    attendanceRecords.unshift({
      date: new Date().toLocaleDateString(),
      studentName: student.fullName,
      course: student.course,
      status
    });

    renderAttendanceTable();
    setText("attendanceMessage", "Attendance saved successfully.");
    await loadStudents();
  } catch (error) {
    setText("attendanceMessage", error.message);
  }
}

function bindStaticEvents() {
  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => switchSection(btn.dataset.section));
  });

  document.getElementById("loginBtn")?.addEventListener("click", loginUser);
  document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
  document.getElementById("registerForm")?.addEventListener("submit", saveStudent);
  document.getElementById("cancelEditBtn")?.addEventListener("click", resetStudentForm);
  document.getElementById("examForm")?.addEventListener("submit", submitExam);
  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);

  document.getElementById("useLoggedStudentBtn")?.addEventListener("click", () => {
    if (currentStudent) fillCertificate(currentStudent);
  });

  document.getElementById("brandName")?.addEventListener("input", () => {
    if (currentStudent) fillCertificate(currentStudent);
  });

  document.getElementById("directorName")?.addEventListener("input", () => {
    if (currentStudent) fillCertificate(currentStudent);
  });

  document.getElementById("downloadPdfBtn")?.addEventListener("click", () => {
    window.print();
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", async () => {
  bindStaticEvents();
  renderCourses();
  renderAttendanceTable();
  resetStudentForm();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      currentUserRole = null;
      currentUserEmail = null;
      currentStudent = null;
      updateSessionUI();
      renderPortal();
      setAppVisibility(false);
      return;
    }

    currentUserEmail = user.email || "";
    currentUserRole = getRoleByEmail(currentUserEmail);

    await loadStudents();

    if (currentUserRole === "student") {
      currentStudent = students.find((student) => student.email === currentUserEmail) || null;
    } else {
      currentStudent = students.find((student) => student.email === currentUserEmail) || null;
    }

    updateSessionUI();
    renderPortal();
    applyRoleVisibility(currentUserRole);
    setAppVisibility(true);
    switchSection("home");

    if (currentStudent) fillCertificate(currentStudent);
  });
});

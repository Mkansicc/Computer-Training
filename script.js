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

/* ADMIN EMAILS */
const ADMIN_EMAILS = [
  "mkansicc@gmail.com"
];

const WHATSAPP_NUMBER = "27720654503";

let students = [];
let currentStudent = null;
let currentUserRole = null;
let currentUserEmail = null;

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

function getRoleByEmail(email = "") {
  return ADMIN_EMAILS.map((item) => item.toLowerCase()).includes(email.toLowerCase())
    ? "admin"
    : "student";
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
    if (roles.includes(role)) {
      btn.classList.remove("role-hidden");
    } else {
      btn.classList.add("role-hidden");
    }
  });
}

function switchSection(id) {
  const allowedStudentSections = ["home", "courses", "portal"];

  if (!currentUserRole) return;

  if (currentUserRole === "student" && !allowedStudentSections.includes(id)) {
    id = "home";
  }

  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => btn.classList.remove("active"));

  const page = document.getElementById(id);
  const navBtn = document.querySelector(`.nav-btn[data-section="${id}"]`);

  if (page) page.classList.add("active");
  if (navBtn) navBtn.classList.add("active");
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

  const statStudents = document.getElementById("statStudents");
  const statCertificates = document.getElementById("statCertificates");
  const statAvgScore = document.getElementById("statAvgScore");
  const metricStudents = document.getElementById("metricStudents");
  const metricAvg = document.getElementById("metricAvg");
  const adminStudents = document.getElementById("adminStudents");
  const adminReady = document.getElementById("adminReady");
  const adminAvgScore = document.getElementById("adminAvgScore");

  if (statStudents) statStudents.textContent = totalStudents;
  if (statCertificates) statCertificates.textContent = certificatesReady;
  if (statAvgScore) statAvgScore.textContent = `${avgScore}%`;

  if (metricStudents) metricStudents.textContent = totalStudents;
  if (metricAvg) metricAvg.textContent = `${avgScore}%`;

  if (adminStudents) adminStudents.textContent = totalStudents;
  if (adminReady) adminReady.textContent = certificatesReady;
  if (adminAvgScore) adminAvgScore.textContent = `${avgScore}%`;
}

function updateSessionUI() {
  const metricUser = document.getElementById("metricUser");
  const metricRole = document.getElementById("metricRole");
  const sessionInfo = document.getElementById("sessionInfo");

  if (!currentUserEmail) {
    if (metricUser) metricUser.textContent = "Guest";
    if (metricRole) metricRole.textContent = "No active session";
    if (sessionInfo) sessionInfo.textContent = "No user logged in.";
    return;
  }

  if (metricUser) metricUser.textContent = currentUserEmail;
  if (metricRole) {
    metricRole.textContent =
      currentUserRole === "admin" ? "Administrator account" : "Student account";
  }
  if (sessionInfo) {
    sessionInfo.textContent = `Logged in as ${currentUserEmail} (${currentUserRole})`;
  }
}

function renderPortal() {
  const portalEmpty = document.getElementById("portalEmpty");
  const portalContent = document.getElementById("portalContent");

  if (!portalEmpty || !portalContent) return;

  if (!currentStudent) {
    portalEmpty.classList.remove("hidden");
    portalContent.classList.add("hidden");
    return;
  }

  portalEmpty.classList.add("hidden");
  portalContent.classList.remove("hidden");

  const avatar = document.getElementById("portalAvatar");
  const portalName = document.getElementById("portalName");
  const portalCourse = document.getElementById("portalCourse");
  const portalEmail = document.getElementById("portalEmail");
  const portalScore = document.getElementById("portalScore");
  const portalAttendance = document.getElementById("portalAttendance");
  const portalCertificate = document.getElementById("portalCertificate");
  const portalStudentId = document.getElementById("portalStudentId");

  if (avatar) avatar.textContent = (currentStudent.fullName || "S").charAt(0).toUpperCase();
  if (portalName) portalName.textContent = currentStudent.fullName || "-";
  if (portalCourse) portalCourse.textContent = currentStudent.course || "-";
  if (portalEmail) portalEmail.textContent = currentStudent.email || "-";
  if (portalScore) portalScore.textContent = `${currentStudent.examScore || 0}%`;
  if (portalAttendance) portalAttendance.textContent = `${currentStudent.attendance || 0}%`;
  if (portalCertificate) portalCertificate.textContent = currentStudent.certificateReady ? "Ready" : "Pending";
  if (portalStudentId) portalStudentId.textContent = currentStudent.id || "-";
}

function fillCertificate(student) {
  if (!student) return;

  const brandName = document.getElementById("brandName")?.value || "CoTeSy IT Services";
  const directorName = document.getElementById("directorName")?.value || "CoTeSy Director / Trainer";

  const certBrand = document.getElementById("certBrand");
  const certBrandFooter = document.getElementById("certBrandFooter");
  const certDirector = document.getElementById("certDirector");
  const certStudentName = document.getElementById("certStudentName");
  const certCourse = document.getElementById("certCourse");
  const certStudentId = document.getElementById("certStudentId");
  const certScore = document.getElementById("certScore");
  const certDate = document.getElementById("certDate");

  if (certBrand) certBrand.textContent = brandName;
  if (certBrandFooter) certBrandFooter.textContent = brandName;
  if (certDirector) certDirector.textContent = directorName;
  if (certStudentName) certStudentName.textContent = student.fullName || "Student Name";
  if (certCourse) certCourse.textContent = student.course || "Course Name";
  if (certStudentId) certStudentId.textContent = student.id || "CTS-000";
  if (certScore) certScore.textContent = `${student.examScore || 0}%`;
  if (certDate) certDate.textContent = new Date().toLocaleDateString();
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
      <button class="btn outline select-cert-btn" type="button" data-docid="${student.docId}">Select</button>
    </div>
  `).join("");

  document.querySelectorAll(".select-cert-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const student = students.find((item) => item.docId === btn.dataset.docid);
      if (student) {
        fillCertificate(student);
      }
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
          <button class="btn tiny outline edit-btn" type="button" data-docid="${student.docId}">Edit</button>
          <button class="btn tiny danger delete-btn" type="button" data-docid="${student.docId}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => startEditStudent(btn.dataset.docid));
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteStudentRecord(btn.dataset.docid));
  });
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
  document.getElementById("regAddress").value = student.address || "";

  document.getElementById("registerTitle").textContent = "Edit Student";
  document.getElementById("saveStudentBtn").textContent = "Update Student";
  document.getElementById("cancelEditBtn").classList.remove("hidden");

  switchSection("register");
}

function resetStudentForm() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.reset();

  document.getElementById("editDocId").value = "";
  document.getElementById("registerTitle").textContent = "Register Student";
  document.getElementById("saveStudentBtn").textContent = "Register Student";
  document.getElementById("cancelEditBtn").classList.add("hidden");
  document.getElementById("registerMessage").textContent = "";
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
  if (existing) {
    await deleteApp(existing);
  }

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
  const address = document.getElementById("regAddress").value.trim();
  const registerMessage = document.getElementById("registerMessage");
  const whatsappLink = document.getElementById("whatsappLink");

  if (!fullName || !idNumber || !email || !phone || !course) {
    registerMessage.textContent = "Please fill in all required fields.";
    return;
  }

  try {
    if (editDocId) {
      const current = students.find((item) => item.docId === editDocId);
      if (!current) {
        registerMessage.textContent = "Student record not found.";
        return;
      }

      await updateDoc(doc(db, "students", editDocId), {
        fullName,
        idNumber,
        email,
        phone,
        course,
        address
      });

      registerMessage.textContent = "Student updated successfully.";
      resetStudentForm();
      await loadStudents();
      return;
    }

    if (!password) {
      registerMessage.textContent = "Password is required for new student registration.";
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
      address,
      examScore: 0,
      attendance: 0,
      certificateReady: false,
      createdAt: new Date().toISOString()
    });

    registerMessage.textContent = "Student registered successfully.";

    const message = `New CoTeSy registration:%0AName: ${fullName}%0AEmail: ${email}%0ACourse: ${course}%0APhone: ${phone}`;
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    whatsappLink.classList.remove("hidden");

    resetStudentForm();
    await loadStudents();
  } catch (error) {
    registerMessage.textContent = error.message;
  }
}

async function deleteStudentRecord(docId) {
  if (currentUserRole !== "admin") return;

  const student = students.find((item) => item.docId === docId);
  if (!student) return;

  const ok = window.confirm(`Delete ${student.fullName}? This removes the Firestore student record.`);
  if (!ok) return;

  try {
    await deleteDoc(doc(db, "students", docId));

    if (currentStudent?.docId === docId) {
      currentStudent = null;
    }

    await loadStudents();
  } catch (error) {
    alert("Delete failed: " + error.message);
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  if (!email || !password) {
    loginMessage.textContent = "Please enter email and password.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginMessage.textContent = "";
  } catch (error) {
    loginMessage.textContent = "Login failed: " + error.message;
  }
}

async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
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

function bindStaticEvents() {
  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchSection(btn.dataset.section);
    });
  });

  document.getElementById("loginBtn")?.addEventListener("click", loginUser);
  document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
  document.getElementById("registerForm")?.addEventListener("submit", saveStudent);
  document.getElementById("cancelEditBtn")?.addEventListener("click", resetStudentForm);

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

document.addEventListener("DOMContentLoaded", async () => {
  bindStaticEvents();
  renderCourses();
  setupAttendanceArea();
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

    if (currentUserRole === "student") {
      switchSection("home");
      if (currentStudent) {
        fillCertificate(currentStudent);
      }
    } else {
      switchSection("home");
    }
  });
});

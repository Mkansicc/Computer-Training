import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD55TZo8jQg7lI2bnO68yn2z3a9KsOsQWs",
  authDomain: "computer-training-d3147.firebaseapp.com",
  projectId: "computer-training-d3147",
  storageBucket: "computer-training-d3147.firebasestorage.app",
  messagingSenderId: "913118748940",
  appId: "1:913118748940:web:6058740970bf85f9766929",
  measurementId: "G-CJPNVG3JD2"
};

const ADMIN_EMAIL = "mkansicc@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
getAnalytics(app);

const loginPage = document.getElementById("loginPage");
const appShell = document.getElementById("appShell");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMessage = document.getElementById("loginMessage");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const metricUser = document.getElementById("metricUser");
const metricRole = document.getElementById("metricRole");

const adminTab = document.getElementById("adminTab");
const attendanceTab = document.getElementById("attendanceTab");
const learnTabs = document.querySelectorAll(".learn-tab");
const pages = document.querySelectorAll(".page");

const courseGrid = document.getElementById("courseGrid");
const adminTableBody = document.getElementById("adminTableBody");
const attendanceTableBody = document.getElementById("attendanceTableBody");

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

const studentRegistrationForm = document.getElementById("studentRegistrationForm");
const studentRegistrationMessage = document.getElementById("studentRegistrationMessage");

const assessmentTitle = document.getElementById("assessmentTitle");
const examForm = document.getElementById("examForm");
const examMessage = document.getElementById("examMessage");

const currentCourseTitle = document.getElementById("currentCourseTitle");
const courseNameDisplay = document.getElementById("courseNameDisplay");
const courseDescDisplay = document.getElementById("courseDescDisplay");
const courseDuration = document.getElementById("courseDuration");
const courseLevel = document.getElementById("courseLevel");
const courseBigIcon = document.getElementById("courseBigIcon");

const paymentCourseName = document.getElementById("paymentCourseName");
const studentSelectedCourse = document.getElementById("studentSelectedCourse");

const goToMaterialsBtn = document.getElementById("goToMaterialsBtn");
const goToAssessmentBtn = document.getElementById("goToAssessmentBtn");

const pdfList = document.getElementById("pdfList");
const videoList = document.getElementById("videoList");
const quizList = document.getElementById("quizList");

const materialTabs = document.querySelectorAll(".material-tab");
const materialPanes = document.querySelectorAll(".material-pane");

const attendanceForm = document.getElementById("attendanceForm");
const attendanceMessage = document.getElementById("attendanceMessage");
const signaturePad = document.getElementById("signaturePad");
const clearSignatureBtn = document.getElementById("clearSignatureBtn");

const courses = [
  {
    title: "Basic Computer",
    icon: "fa-solid fa-desktop",
    duration: "4 Weeks",
    level: "Beginner",
    description: "Learn computer basics, parts of a computer, mouse skills, keyboard use, files, folders, and desktop navigation.",
    materials: {
      pdfs: [
        { title: "Basic Computer Manual", info: "Beginner training notes", url: "#" }
      ],
      videos: [
        { title: "Computer Basics Video", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=computer+basics+for+beginners" }
      ],
      quizzes: [
        { title: "Basic Computer Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft Word",
    icon: "fa-solid fa-file-word",
    duration: "4 Weeks",
    level: "Beginner",
    description: "Learn typing, formatting, saving, printing, page setup, tables, and document design in Microsoft Word.",
    materials: {
      pdfs: [
        { title: "Microsoft Word Manual", info: "Word beginner guide", url: "#" }
      ],
      videos: [
        { title: "Microsoft Word Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+word+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "Microsoft Word Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft Excel",
    icon: "fa-solid fa-file-excel",
    duration: "4 Weeks",
    level: "Beginner",
    description: "Learn spreadsheets, rows, columns, formulas, formatting, charts, and simple calculations in Excel.",
    materials: {
      pdfs: [
        { title: "Microsoft Excel Manual", info: "Excel beginner guide", url: "#" }
      ],
      videos: [
        { title: "Microsoft Excel Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+excel+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "Microsoft Excel Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft PowerPoint",
    icon: "fa-solid fa-file-powerpoint",
    duration: "3 Weeks",
    level: "Beginner",
    description: "Learn slides, themes, transitions, images, animations, and how to present professionally in PowerPoint.",
    materials: {
      pdfs: [
        { title: "PowerPoint Manual", info: "PowerPoint beginner guide", url: "#" }
      ],
      videos: [
        { title: "PowerPoint Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+powerpoint+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "PowerPoint Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft Outlook",
    icon: "fa-solid fa-envelope",
    duration: "2 Weeks",
    level: "Beginner",
    description: "Learn emails, inbox management, calendar, contacts, scheduling, and attachments in Outlook.",
    materials: {
      pdfs: [
        { title: "Outlook Manual", info: "Outlook beginner guide", url: "#" }
      ],
      videos: [
        { title: "Outlook Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+outlook+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "Outlook Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft Access",
    icon: "fa-solid fa-database",
    duration: "4 Weeks",
    level: "Beginner",
    description: "Learn databases, tables, forms, reports, and queries in Microsoft Access.",
    materials: {
      pdfs: [
        { title: "Access Manual", info: "Access beginner guide", url: "#" }
      ],
      videos: [
        { title: "Access Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+access+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "Access Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft Publisher",
    icon: "fa-solid fa-newspaper",
    duration: "3 Weeks",
    level: "Beginner",
    description: "Learn flyers, brochures, invitation cards, and publication layouts in Microsoft Publisher.",
    materials: {
      pdfs: [
        { title: "Publisher Manual", info: "Publisher beginner guide", url: "#" }
      ],
      videos: [
        { title: "Publisher Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+publisher+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "Publisher Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  },
  {
    title: "Microsoft Teams",
    icon: "fa-solid fa-users-rectangle",
    duration: "2 Weeks",
    level: "Beginner",
    description: "Learn Teams meetings, chats, channels, collaboration, and online class communication.",
    materials: {
      pdfs: [
        { title: "Teams Manual", info: "Teams beginner guide", url: "#" }
      ],
      videos: [
        { title: "Teams Tutorial", info: "YouTube lesson", url: "https://www.youtube.com/results?search_query=microsoft+teams+tutorial+for+beginners" }
      ],
      quizzes: [
        { title: "Teams Quiz", info: "Online practice quiz", url: "#" }
      ]
    }
  }
];

let currentUser = null;
let currentUserProfile = null;
let selectedCourse = courses[0];

function setMessage(el, text, color = "#dc2626") {
  el.textContent = text;
  el.style.color = color;
}

function isAdminUser(user) {
  return user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function showPage(sectionId) {
  pages.forEach(page => page.classList.remove("active"));
  learnTabs.forEach(tab => tab.classList.remove("active"));

  const page = document.getElementById(sectionId);
  const tab = document.querySelector(`.learn-tab[data-section="${sectionId}"]`);

  if (page) page.classList.add("active");
  if (tab) tab.classList.add("active");
}

function openApp() {
  loginPage.classList.remove("active");
  appShell.classList.remove("hidden");
}

function openLogin() {
  appShell.classList.add("hidden");
  loginPage.classList.add("active");
}

async function getStudentProfileByUid(uid) {
  const ref = doc(db, "students", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

async function saveStudentProfile(uid, data) {
  await setDoc(doc(db, "students", uid), data, { merge: true });
}

async function fetchAllStudents() {
  const snapshot = await getDocs(collection(db, "students"));
  const rows = [];
  snapshot.forEach(docSnap => rows.push({ id: docSnap.id, ...docSnap.data() }));
  return rows;
}

async function fetchAllAttendance() {
  const snapshot = await getDocs(collection(db, "attendance"));
  const rows = [];
  snapshot.forEach(docSnap => rows.push({ id: docSnap.id, ...docSnap.data() }));
  return rows;
}

function renderCourses() {
  courseGrid.innerHTML = "";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <div class="course-image-wrap">
        <div class="course-icon-wrap">
          <i class="${course.icon}"></i>
        </div>
      </div>
      <div class="course-body">
        <span class="recommended-pill">Recommended</span>
        <div class="course-title">${course.title}</div>
        <div class="course-actions">
          <button class="btn outline select-course-btn" type="button" data-title="${course.title}">Select Course</button>
          <button class="btn primary start-course-btn" type="button" data-title="${course.title}">Start</button>
        </div>
      </div>
    `;

    courseGrid.appendChild(card);
  });

  document.querySelectorAll(".select-course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const course = courses.find(c => c.title === btn.dataset.title);
      if (!course) return;
      selectedCourse = course;
      fillSelectedCourse();
      showPage("registrationPayment");
    });
  });

  document.querySelectorAll(".start-course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const course = courses.find(c => c.title === btn.dataset.title);
      if (!course) return;
      selectedCourse = course;
      fillSelectedCourse();
      showPage("coursePage");
    });
  });
}

function fillSelectedCourse() {
  currentCourseTitle.textContent = `${selectedCourse.title} Course`;
  courseNameDisplay.textContent = selectedCourse.title;
  courseDescDisplay.textContent = selectedCourse.description;
  courseDuration.textContent = selectedCourse.duration;
  courseLevel.textContent = selectedCourse.level;
  courseBigIcon.innerHTML = `<i class="${selectedCourse.icon}"></i>`;

  assessmentTitle.textContent = `${selectedCourse.title} Assessment`;
  paymentCourseName.textContent = selectedCourse.title;
  studentSelectedCourse.value = selectedCourse.title;

  renderMaterialLinks();
}

function renderMaterialLinks() {
  renderLinkGroup(pdfList, selectedCourse.materials.pdfs, "Open PDF");
  renderLinkGroup(videoList, selectedCourse.materials.videos, "Open Video");
  renderLinkGroup(quizList, selectedCourse.materials.quizzes, "Open Quiz");
}

function renderLinkGroup(container, items, buttonText) {
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "material-link-item";
    div.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <span>${item.info}</span>
      </div>
      <a class="btn outline" href="${item.url}" target="_blank" rel="noopener noreferrer">${buttonText}</a>
    `;
    container.appendChild(div);
  });
}

function renderPortal(profile) {
  metricUser.textContent = profile?.name || currentUser?.email || "User";
  metricRole.textContent = isAdminUser(currentUser) ? "ADMIN" : "STUDENT";
}

async function renderAdminTable() {
  if (!isAdminUser(currentUser)) return;

  const students = await fetchAllStudents();
  adminTableBody.innerHTML = "";

  if (!students.length) {
    adminTableBody.innerHTML = `<tr><td colspan="4">No student records found.</td></tr>`;
    return;
  }

  students.forEach(student => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.name || "-"}</td>
      <td>${student.email || "-"}</td>
      <td>${student.course || "-"}</td>
      <td>${student.score ?? 0}%</td>
    `;
    adminTableBody.appendChild(tr);
  });
}

async function renderAttendanceTable() {
  if (!isAdminUser(currentUser)) return;

  const attendanceRows = await fetchAllAttendance();
  attendanceTableBody.innerHTML = "";

  if (!attendanceRows.length) {
    attendanceTableBody.innerHTML = `<tr><td colspan="4">No attendance records found.</td></tr>`;
    return;
  }

  attendanceRows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date || "-"}</td>
      <td>${row.studentName || "-"}</td>
      <td>${row.status || "-"}</td>
      <td>${row.course || "-"}</td>
    `;
    attendanceTableBody.appendChild(tr);
  });
}

function applyRoleUI() {
  if (!currentUser) return;

  if (isAdminUser(currentUser)) {
    adminTab.classList.remove("hidden");
    attendanceTab.classList.remove("hidden");
  } else {
    adminTab.classList.add("hidden");
    attendanceTab.classList.add("hidden");
  }
}

async function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    setMessage(loginMessage, "Please enter email and password.");
    return;
  }

  try {
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";
    await signInWithEmailAndPassword(auth, email, password);
    setMessage(loginMessage, "", "#15803d");
  } catch (error) {
    console.error("Firebase login error:", error);
    setMessage(loginMessage, "Login failed. Please check your email and password.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
}

async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

async function saveStudentRecord(e) {
  e.preventDefault();

  if (!currentUser || !isAdminUser(currentUser)) {
    setMessage(registerMessage, "Only admin can save student records.");
    return;
  }

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const course = document.getElementById("regCourse").value;

  if (!name || !email || !course) {
    setMessage(registerMessage, "Please fill in all required fields.");
    return;
  }

  try {
    const studentId = email.replace(/[^a-zA-Z0-9]/g, "_");

    await setDoc(
      doc(db, "students", studentId),
      {
        name,
        email,
        phone,
        course,
        score: 0,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    setMessage(registerMessage, "Student record saved successfully.", "#15803d");
    registerForm.reset();
    await renderAdminTable();
  } catch (error) {
    console.error(error);
    setMessage(registerMessage, "Failed to save student record.");
  }
}

async function submitStudentRegistration(e) {
  e.preventDefault();

  const name = document.getElementById("studentFullName").value.trim();
  const email = document.getElementById("studentEmailReg").value.trim().toLowerCase();
  const phone = document.getElementById("studentPhoneReg").value.trim();
  const course = document.getElementById("studentSelectedCourse").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const paymentReference = document.getElementById("paymentReference").value.trim();

  if (!name || !email || !phone || !course || !paymentMethod) {
    setMessage(studentRegistrationMessage, "Please fill in all required fields.");
    return;
  }

  try {
    const regId = email.replace(/[^a-zA-Z0-9]/g, "_");

    await setDoc(
      doc(db, "registrations", regId),
      {
        name,
        email,
        phone,
        course,
        paymentMethod,
        paymentReference,
        submittedAt: new Date().toISOString()
      },
      { merge: true }
    );

    setMessage(studentRegistrationMessage, "Registration submitted successfully.", "#15803d");
    studentRegistrationForm.reset();
    studentSelectedCourse.value = selectedCourse.title;
  } catch (error) {
    console.error(error);
    setMessage(studentRegistrationMessage, "Could not submit registration.");
  }
}

async function submitAssessment(e) {
  e.preventDefault();

  if (!currentUser) {
    setMessage(examMessage, "Please login first.");
    return;
  }

  const answers = ["q1", "q2", "q3", "q4"];
  let score = 0;

  answers.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected) score += Number(selected.value);
  });

  const percent = Math.round((score / answers.length) * 100);

  try {
    if (!isAdminUser(currentUser)) {
      await saveStudentProfile(currentUser.uid, {
        name: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        course: selectedCourse.title,
        score: percent,
        updatedAt: new Date().toISOString()
      });
    }

    setMessage(
      examMessage,
      `Assessment submitted successfully. Your score is ${percent}%.`,
      percent >= 50 ? "#15803d" : "#dc2626"
    );

    examForm.reset();
    if (isAdminUser(currentUser)) await renderAdminTable();
  } catch (error) {
    console.error(error);
    setMessage(examMessage, "Could not save assessment result.");
  }
}

async function saveAttendance(e) {
  e.preventDefault();

  if (!currentUser || !isAdminUser(currentUser)) {
    setMessage(attendanceMessage, "Only admin can save attendance.");
    return;
  }

  const date = document.getElementById("attendanceDate").value;
  const studentName = document.getElementById("attendanceStudentName").value.trim();
  const status = document.getElementById("attendanceStatus").value;
  const course = document.getElementById("attendanceCourse").value.trim();

  if (!date || !studentName || !status || !course) {
    setMessage(attendanceMessage, "Please complete all attendance fields.");
    return;
  }

  const signatureData = signaturePad.toDataURL("image/png");

  try {
    const attendanceId = `${date}_${studentName}`.replace(/[^a-zA-Z0-9]/g, "_");

    await setDoc(
      doc(db, "attendance", attendanceId),
      {
        date,
        studentName,
        status,
        course,
        signature: signatureData,
        savedAt: new Date().toISOString()
      },
      { merge: true }
    );

    setMessage(attendanceMessage, "Attendance saved successfully.", "#15803d");
    attendanceForm.reset();
    clearCanvas();
    await renderAttendanceTable();
  } catch (error) {
    console.error(error);
    setMessage(attendanceMessage, "Could not save attendance.");
  }
}

onAuthStateChanged(auth, async user => {
  currentUser = user;
  currentUserProfile = null;

  if (!user) {
    openLogin();
    loginEmail.value = "";
    loginPassword.value = "";
    metricUser.textContent = "Guest";
    metricRole.textContent = "No active session";
    return;
  }

  openApp();
  renderCourses();
  fillSelectedCourse();
  applyRoleUI();

  if (isAdminUser(user)) {
    metricUser.textContent = user.email;
    metricRole.textContent = "ADMIN";
    await renderAdminTable();
    await renderAttendanceTable();
  } else {
    const profile = await getStudentProfileByUid(user.uid);

    if (profile) {
      currentUserProfile = profile;
    } else {
      const starterProfile = {
        name: user.displayName || user.email?.split("@")[0] || "Student",
        email: user.email,
        course: selectedCourse.title,
        score: 0,
        createdAt: new Date().toISOString()
      };
      await saveStudentProfile(user.uid, starterProfile);
      currentUserProfile = starterProfile;
    }

    renderPortal(currentUserProfile);
  }

  showPage("courses");
});

learnTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const section = tab.dataset.section;
    if ((section === "adminPanel" || section === "attendancePage") && !isAdminUser(currentUser)) return;
    showPage(section);
  });
});

materialTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    materialTabs.forEach(t => t.classList.remove("active"));
    materialPanes.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.material).classList.add("active");
  });
});

goToMaterialsBtn.addEventListener("click", () => showPage("materials"));
goToAssessmentBtn.addEventListener("click", () => showPage("assessments"));

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

loginPassword.addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});

registerForm.addEventListener("submit", saveStudentRecord);
studentRegistrationForm.addEventListener("submit", submitStudentRegistration);
examForm.addEventListener("submit", submitAssessment);
attendanceForm.addEventListener("submit", saveAttendance);

/* Signature pad */
const ctx = signaturePad.getContext("2d");
let drawing = false;

function getPos(e) {
  const rect = signaturePad.getBoundingClientRect();
  if (e.touches && e.touches[0]) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function startDraw(e) {
  drawing = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#162d74";
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
}

signaturePad.addEventListener("mousedown", startDraw);
signaturePad.addEventListener("mousemove", draw);
signaturePad.addEventListener("mouseup", stopDraw);
signaturePad.addEventListener("mouseleave", stopDraw);

signaturePad.addEventListener("touchstart", startDraw, { passive: false });
signaturePad.addEventListener("touchmove", draw, { passive: false });
signaturePad.addEventListener("touchend", stopDraw);

clearSignatureBtn.addEventListener("click", clearCanvas);

renderCourses();
fillSelectedCourse();

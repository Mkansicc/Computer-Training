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

/* =========================================================
   PASTE YOUR REAL FIREBASE CONFIG HERE
========================================================= */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

/* =========================================================
   ADMIN EMAIL
========================================================= */
const ADMIN_EMAIL = "mkansicc@gmail.com";

/* =========================================================
   FIREBASE INIT
========================================================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================================================
   DOM
========================================================= */
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
const learnTabs = document.querySelectorAll(".learn-tab");
const pages = document.querySelectorAll(".page");

const courseGrid = document.getElementById("courseGrid");
const adminTableBody = document.getElementById("adminTableBody");

const portalName = document.getElementById("portalName");
const portalEmail = document.getElementById("portalEmail");
const portalCourse = document.getElementById("portalCourse");
const portalScore = document.getElementById("portalScore");

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

const assessmentBox = document.getElementById("assessmentBox");
const assessmentTitle = document.getElementById("assessmentTitle");
const examForm = document.getElementById("examForm");
const examMessage = document.getElementById("examMessage");

/* =========================================================
   COURSES
========================================================= */
const courses = [
  {
    title: "Basic Computer",
    icon: "fa-solid fa-desktop",
    rating: "4.8"
  },
  {
    title: "Microsoft Word",
    icon: "fa-solid fa-file-word",
    rating: "4.9"
  },
  {
    title: "Microsoft Excel",
    icon: "fa-solid fa-file-excel",
    rating: "4.9"
  },
  {
    title: "Microsoft PowerPoint",
    icon: "fa-solid fa-file-powerpoint",
    rating: "4.8"
  },
  {
    title: "Microsoft Outlook",
    icon: "fa-solid fa-envelope",
    rating: "4.7"
  },
  {
    title: "Microsoft Access",
    icon: "fa-solid fa-database",
    rating: "4.7"
  },
  {
    title: "Microsoft Publisher",
    icon: "fa-solid fa-newspaper",
    rating: "4.6"
  },
  {
    title: "Microsoft Teams",
    icon: "fa-solid fa-users-rectangle",
    rating: "4.8"
  }
];

let currentUser = null;
let currentUserProfile = null;
let selectedAssessmentCourse = "Basic Computer";

/* =========================================================
   HELPERS
========================================================= */
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
  snapshot.forEach(docSnap => {
    rows.push({ id: docSnap.id, ...docSnap.data() });
  });
  return rows;
}

/* =========================================================
   UI RENDER
========================================================= */
function renderCourses() {
  courseGrid.innerHTML = "";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <div class="course-image-wrap">
        <span class="free-badge">Free</span>
        <div class="course-icon-wrap">
          <i class="${course.icon}"></i>
        </div>
      </div>
      <div class="course-body">
        <span class="recommended-pill">Recommended</span>
        <div class="course-title">${course.title}</div>

        <div class="rating-row">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-regular fa-star"></i>
          <span class="rating-score">${course.rating}</span>
        </div>

        <div class="course-actions">
          <button class="btn outline">Read More</button>
          <button class="btn primary start-course-btn" data-title="${course.title}">Start</button>
        </div>
      </div>
    `;

    courseGrid.appendChild(card);
  });

  document.querySelectorAll(".start-course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedAssessmentCourse = btn.dataset.title || "Basic Computer";
      assessmentTitle.textContent = `${selectedAssessmentCourse} Assessment`;
      assessmentBox.classList.remove("hidden");
      showPage("assessments");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderPortal(profile) {
  portalName.textContent = profile?.name || currentUser?.displayName || "Student";
  portalEmail.textContent = currentUser?.email || "No email";
  portalCourse.textContent = profile?.course || "Basic Computer";
  portalScore.textContent = `${profile?.score ?? 0}%`;

  metricUser.textContent = profile?.name || currentUser?.email || "User";
  metricRole.textContent = isAdminUser(currentUser) ? "ADMIN" : "STUDENT";
}

async function renderAdminTable() {
  if (!isAdminUser(currentUser)) return;

  const students = await fetchAllStudents();
  adminTableBody.innerHTML = "";

  if (students.length === 0) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="4">No student records found.</td>
      </tr>
    `;
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

function applyRoleUI() {
  if (!currentUser) return;

  if (isAdminUser(currentUser)) {
    adminTab.classList.remove("hidden");
  } else {
    adminTab.classList.add("hidden");
    if (document.getElementById("adminPanel").classList.contains("active")) {
      showPage("courses");
    }
  }
}

/* =========================================================
   LOGIN / LOGOUT
========================================================= */
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
    let msg = "Login failed. Please check your email and password.";

    if (error.code === "auth/invalid-credential") {
      msg = "Incorrect email or password.";
    } else if (error.code === "auth/user-not-found") {
      msg = "User not found in Firebase Authentication.";
    } else if (error.code === "auth/wrong-password") {
      msg = "Incorrect password.";
    } else if (error.code === "auth/invalid-email") {
      msg = "Invalid email address.";
    }

    setMessage(loginMessage, msg);
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

/* =========================================================
   ADMIN SAVE STUDENT RECORD
========================================================= */
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

/* =========================================================
   ASSESSMENT
========================================================= */
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
    let profileId = currentUser.uid;

    if (!currentUserProfile && !isAdminUser(currentUser)) {
      await saveStudentProfile(profileId, {
        name: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        course: selectedAssessmentCourse,
        score: percent,
        updatedAt: new Date().toISOString()
      });
    } else if (!isAdminUser(currentUser)) {
      await updateDoc(doc(db, "students", profileId), {
        course: selectedAssessmentCourse,
        score: percent,
        updatedAt: new Date().toISOString()
      });
    }

    if (!isAdminUser(currentUser)) {
      currentUserProfile = {
        ...(currentUserProfile || {}),
        course: selectedAssessmentCourse,
        score: percent
      };
      renderPortal(currentUserProfile);
    }

    setMessage(
      examMessage,
      `Assessment submitted successfully. Your score is ${percent}%.`,
      percent >= 50 ? "#15803d" : "#dc2626"
    );

    examForm.reset();

    if (isAdminUser(currentUser)) {
      await renderAdminTable();
    }
  } catch (error) {
    console.error(error);
    setMessage(examMessage, "Could not save assessment result.");
  }
}

/* =========================================================
   AUTH STATE
========================================================= */
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
  applyRoleUI();

  if (isAdminUser(user)) {
    metricUser.textContent = user.email;
    metricRole.textContent = "ADMIN";
    portalName.textContent = "Administrator";
    portalEmail.textContent = user.email;
    portalCourse.textContent = "All Courses";
    portalScore.textContent = "100%";
    await renderAdminTable();
  } else {
    const profile = await getStudentProfileByUid(user.uid);

    if (profile) {
      currentUserProfile = profile;
    } else {
      const starterProfile = {
        name: user.displayName || user.email?.split("@")[0] || "Student",
        email: user.email,
        course: "Basic Computer",
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

/* =========================================================
   EVENTS
========================================================= */
learnTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const section = tab.dataset.section;

    if (section === "adminPanel" && !isAdminUser(currentUser)) {
      return;
    }

    showPage(section);
  });
});

document.querySelectorAll(".open-assessment").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAssessmentCourse = btn.dataset.course || "Basic Computer";
    assessmentTitle.textContent = `${selectedAssessmentCourse} Assessment`;
    assessmentBox.classList.remove("hidden");
  });
});

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

loginPassword.addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});

if (registerForm) {
  registerForm.addEventListener("submit", saveStudentRecord);
}

if (examForm) {
  examForm.addEventListener("submit", submitAssessment);
}

renderCourses();

const loginPage = document.getElementById("loginPage");
const appShell = document.getElementById("appShell");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMessage = document.getElementById("loginMessage");
const metricUser = document.getElementById("metricUser");
const metricRole = document.getElementById("metricRole");

const learnTabs = document.querySelectorAll(".learn-tab");
const pages = document.querySelectorAll(".page");
const adminOnlyTab = document.querySelector(".admin-only");

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

const demoUsers = [
  {
    name: "Admin Mkansi",
    email: "mkansicc@gmail.com",
    password: "Mkansi33",
    role: "admin",
    course: "All Courses",
    score: 100
  },
  {
    name: "Student Demo",
    email: "student@cotesy.co.za",
    password: "123456",
    role: "student",
    course: "Microsoft Word",
    score: 0
  }
];

const courses = [
  {
    title: "Entrepreneurial Characteristics",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    rating: "3.0"
  },
  {
    title: "Introduction to AI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    rating: "4.0"
  },
  {
    title: "Managing Workplace Conflicts",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    rating: "4.0"
  },
  {
    title: "Mastering CV Construction and Interview Skills",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    rating: "4.0"
  },
  {
    title: "Microsoft Outlook",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/76/Microsoft_Office_Outlook_%282018-present%29.svg",
    rating: "4.0"
  }
];

let currentUser = null;
let selectedAssessmentCourse = "Microsoft Word";

function saveUsers(users) {
  localStorage.setItem("cotesy_users", JSON.stringify(users));
}

function getUsers() {
  const stored = localStorage.getItem("cotesy_users");
  if (stored) return JSON.parse(stored);

  saveUsers(demoUsers);
  return demoUsers;
}

function saveSession(user) {
  localStorage.setItem("cotesy_session", JSON.stringify(user));
}

function getSession() {
  const stored = localStorage.getItem("cotesy_session");
  return stored ? JSON.parse(stored) : null;
}

function clearSession() {
  localStorage.removeItem("cotesy_session");
}

function showPage(sectionId) {
  pages.forEach(page => page.classList.remove("active"));
  learnTabs.forEach(tab => tab.classList.remove("active"));

  document.getElementById(sectionId)?.classList.add("active");
  document.querySelector(`.learn-tab[data-section="${sectionId}"]`)?.classList.add("active");
}

function applyRoleUI() {
  if (!currentUser) return;

  metricUser.textContent = currentUser.name;
  metricRole.textContent = currentUser.role.toUpperCase();

  portalName.textContent = currentUser.name;
  portalEmail.textContent = currentUser.email;
  portalCourse.textContent = currentUser.course || "Computer Basics";
  portalScore.textContent = `${currentUser.score || 0}%`;

  if (currentUser.role === "admin") {
    adminOnlyTab.classList.remove("hidden");
  } else {
    adminOnlyTab.classList.add("hidden");
  }

  showPage("courses");
}

function renderCourses() {
  courseGrid.innerHTML = "";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <div class="course-image-wrap">
        <span class="free-badge">Free</span>
        <img src="${course.image}" alt="${course.title}" class="course-image" />
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
      const title = btn.dataset.title;
      selectedAssessmentCourse = title;
      assessmentTitle.textContent = `${title} Assessment`;
      assessmentBox.classList.remove("hidden");
      showPage("assessments");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderAdminTable() {
  const users = getUsers().filter(user => user.role === "student");

  adminTableBody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.course || ""}</td>
      <td>${user.score || 0}%</td>
    `;
    adminTableBody.appendChild(tr);
  });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();

  const users = getUsers();
  const foundUser = users.find(
    user => user.email.toLowerCase() === email && user.password === password
  );

  if (!foundUser) {
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.style.color = "#dc2626";
    return;
  }

  currentUser = foundUser;
  saveSession(foundUser);

  loginPage.classList.remove("active");
  appShell.classList.remove("hidden");
  loginMessage.textContent = "";

  renderCourses();
  renderAdminTable();
  applyRoleUI();
}

function logout() {
  clearSession();
  currentUser = null;
  appShell.classList.add("hidden");
  loginPage.classList.add("active");
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}

function registerStudent(e) {
  e.preventDefault();

  if (!currentUser || currentUser.role !== "admin") {
    registerMessage.textContent = "Only admin can add students.";
    registerMessage.style.color = "#dc2626";
    return;
  }

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const course = document.getElementById("regCourse").value;

  if (!name || !email || !password) {
    registerMessage.textContent = "Please fill in all required fields.";
    registerMessage.style.color = "#dc2626";
    return;
  }

  const users = getUsers();
  const exists = users.some(user => user.email.toLowerCase() === email);

  if (exists) {
    registerMessage.textContent = "Student email already exists.";
    registerMessage.style.color = "#dc2626";
    return;
  }

  users.push({
    name,
    email,
    phone,
    password,
    role: "student",
    course,
    score: 0
  });

  saveUsers(users);
  renderAdminTable();

  registerMessage.textContent = "Student added successfully.";
  registerMessage.style.color = "#15803d";
  registerForm.reset();
}

function submitAssessment(e) {
  e.preventDefault();

  if (!currentUser) {
    examMessage.textContent = "Please login first.";
    examMessage.style.color = "#dc2626";
    return;
  }

  const answers = ["q1", "q2", "q3", "q4"];
  let score = 0;

  answers.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected) score += Number(selected.value);
  });

  const percent = Math.round((score / answers.length) * 100);

  const users = getUsers();
  const index = users.findIndex(user => user.email === currentUser.email);

  if (index !== -1) {
    users[index].score = percent;
    if (currentUser.role === "student") {
      users[index].course = selectedAssessmentCourse;
    }
    saveUsers(users);
    currentUser = users[index];
    saveSession(currentUser);
  }

  portalScore.textContent = `${percent}%`;
  portalCourse.textContent = currentUser.course || selectedAssessmentCourse;

  examMessage.textContent = `Assessment submitted successfully. Your score is ${percent}%.`;
  examMessage.style.color = percent >= 50 ? "#15803d" : "#dc2626";

  renderAdminTable();
  examForm.reset();
}

function restoreSession() {
  const session = getSession();
  if (!session) return;

  currentUser = session;
  loginPage.classList.remove("active");
  appShell.classList.remove("hidden");

  renderCourses();
  renderAdminTable();
  applyRoleUI();
}

learnTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const section = tab.dataset.section;

    if (section === "adminPanel" && (!currentUser || currentUser.role !== "admin")) {
      return;
    }

    showPage(section);
  });
});

document.querySelectorAll(".open-assessment").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAssessmentCourse = btn.dataset.course;
    assessmentTitle.textContent = `${selectedAssessmentCourse} Assessment`;
    assessmentBox.classList.remove("hidden");
  });
});

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

if (registerForm) {
  registerForm.addEventListener("submit", registerStudent);
}

if (examForm) {
  examForm.addEventListener("submit", submitAssessment);
}

restoreSession();
renderCourses();

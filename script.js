import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const COURSES = [
  { name: "Computer Basics", description: "Introduction to computers and Windows.", fee: "R450" },
  { name: "Microsoft Word", description: "Create letters, CVs, and documents.", fee: "R500" },
  { name: "Microsoft Excel", description: "Spreadsheets, formulas, and calculations.", fee: "R550" },
  { name: "PowerPoint", description: "Create beautiful presentations.", fee: "R450" }
];

const EXAMS = [
  {
    id: 1,
    title: "Computer Basics Test",
    course: "Computer Basics",
    passMark: 50,
    questions: [
      { q: "Which device is used to move the pointer?", options: ["Monitor", "Mouse", "Printer", "Speaker"], answer: "Mouse" },
      { q: "Which part is used to type letters?", options: ["Keyboard", "Router", "Screen", "Cable"], answer: "Keyboard" }
    ]
  },
  {
    id: 2,
    title: "Microsoft Word Test",
    course: "Microsoft Word",
    passMark: 50,
    questions: [
      { q: "Which program is used to type letters?", options: ["Word", "Excel", "Paint", "Chrome"], answer: "Word" },
      { q: "Which shortcut saves a document?", options: ["Ctrl + S", "Ctrl + P", "Ctrl + X", "Ctrl + D"], answer: "Ctrl + S" }
    ]
  },
  {
    id: 3,
    title: "Microsoft Excel Test",
    course: "Microsoft Excel",
    passMark: 50,
    questions: [
      { q: "Excel is mainly used for?", options: ["Spreadsheets", "Music", "Drawing", "Video calls"], answer: "Spreadsheets" },
      { q: "Which symbol starts a formula in Excel?", options: ["=", "+", "#", "@"], answer: "=" }
    ]
  },
  {
    id: 4,
    title: "PowerPoint Test",
    course: "PowerPoint",
    passMark: 50,
    questions: [
      { q: "PowerPoint is used to create?", options: ["Presentations", "Passwords", "Antivirus", "Emails"], answer: "Presentations" },
      { q: "A PowerPoint page is called?", options: ["Slide", "Sheet", "Tab", "Form"], answer: "Slide" }
    ]
  }
];

const WHATSAPP_NUMBER = "27720654503";

let students = [];
let attendanceRecords = [];
let currentStudent = null;
let currentUser = null;

const $ = (id) => document.getElementById(id);
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

function switchSection(id) {
  pages.forEach((page) => page.classList.toggle("active", page.id === id));
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.section === id));

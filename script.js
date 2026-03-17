import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
getAuth,
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


const firebaseConfig = {

apiKey: "AIzaSyD55TZo8jQg7lI2bnO68yn2z3a9KsOsQWs",

authDomain: "computer-training-d3147.firebaseapp.com",

projectId: "computer-training-d3147",

storageBucket: "computer-training-d3147.appspot.com",

messagingSenderId: "913118748940",

appId: "1:913118748940:web:6058740970bf85f9766929"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


/* ADMIN ACCOUNT */

const ADMIN_EMAILS = [

"mkansicc@gmail.com"

];


/* LOGIN */

document.getElementById("loginBtn").onclick = async () => {

const email=document.getElementById("loginEmail").value;

const pass=document.getElementById("loginPassword").value;

try{

await signInWithEmailAndPassword(auth,email,pass);

document.getElementById("loginPage").classList.add("hidden");

document.getElementById("appShell").classList.remove("hidden");

if(!ADMIN_EMAILS.includes(email)){

document.querySelector(".admin-only").style.display="none";

}

loadStudents();

}catch(e){

document.getElementById("loginMessage").innerText=e.message;

}

};


/* LOGOUT */

document.getElementById("logoutBtn").onclick=async()=>{

await signOut(auth);

location.reload();

};


/* NAVIGATION */

document.querySelectorAll(".nav-btn").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));

document.getElementById(btn.dataset.section).classList.add("active");

};

});


/* LOAD STUDENTS */

async function loadStudents(){

const snap=await getDocs(collection(db,"students"));

const table=document.getElementById("adminTableBody");

table.innerHTML="";

snap.forEach(doc=>{

const s=doc.data();

table.innerHTML+=`

<tr>

<td>${s.fullName||""}</td>

<td>${s.email||""}</td>

<td>${s.course||""}</td>

<td>${s.examScore||0}%</td>

</tr>

`;

});

}

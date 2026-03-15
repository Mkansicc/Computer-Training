// FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


// FIREBASE CONFIG
const firebaseConfig = {

apiKey: "AIzaSyD55TZo8jQg7lI2bnO68yn2z3a9KsOsQWs",

authDomain: "computer-training-d3147.firebaseapp.com",

projectId: "computer-training-d3147",

storageBucket: "computer-training-d3147.firebasestorage.app",

messagingSenderId: "913118748940",

appId: "1:913118748940:web:6058740970bf85f9766929",

measurementId: "G-CJPNVG3JD2"

};


// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)



// SHOW PAGE
function show(id){

document.querySelectorAll("section").forEach(s=>{
s.classList.add("hide")
})

document.getElementById(id).classList.remove("hide")

}



// REGISTER STUDENT
async function register(){

let name=document.getElementById("name").value
let email=document.getElementById("email").value
let pass=document.getElementById("password").value
let course=document.getElementById("course").value

try{

await createUserWithEmailAndPassword(auth,email,pass)

await addDoc(collection(db,"students"),{

name:name,
email:email,
course:course

})

document.getElementById("regmsg").innerHTML="Student Registered"

loadStudents()

}catch(error){

document.getElementById("regmsg").innerHTML=error.message

}

}



// LOGIN
async function login(){

let email=document.getElementById("logemail").value
let pass=document.getElementById("logpass").value

try{

await signInWithEmailAndPassword(auth,email,pass)

document.getElementById("loginmsg").innerHTML="Login Successful"

}catch(error){

document.getElementById("loginmsg").innerHTML="Login Failed"

}

}



// LOAD STUDENTS
async function loadStudents(){

let table=document.getElementById("studentTable")

table.innerHTML=""

const querySnapshot = await getDocs(collection(db,"students"))

querySnapshot.forEach((doc)=>{

let data=doc.data()

let row=`
<tr>
<td>${data.name}</td>
<td>${data.email}</td>
<td>${data.course}</td>
</tr>
`

table.innerHTML+=row

})

}



// INITIAL LOAD
loadStudents()


// MAKE BUTTON FUNCTIONS WORK
window.show=show
window.register=register
window.login=login

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD55TZo8jQg7lI2bnO68yn2z3a9KsOsQWs",
  authDomain: "computer-training-d3147.firebaseapp.com",
  projectId: "computer-training-d3147",
  storageBucket: "computer-training-d3147.firebasestorage.app",
  messagingSenderId: "913118748940",
  appId: "1:913118748940:web:6058740970bf85f9766929",
  measurementId: "G-CJPNVG3JD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);let students=[]

function show(id){

document.querySelectorAll("section").forEach(s=>{
s.classList.add("hide")
})

document.getElementById(id).classList.remove("hide")

}

function register(){

let name=document.getElementById("name").value
let email=document.getElementById("email").value
let pass=document.getElementById("password").value
let course=document.getElementById("course").value

students.push({
name:name,
email:email,
password:pass,
course:course
})

document.getElementById("regmsg").innerHTML="Student Registered"

updateTable()

}

function login(){

let email=document.getElementById("logemail").value
let pass=document.getElementById("logpass").value

let user=students.find(s=>s.email==email && s.password==pass)

if(user){

document.getElementById("loginmsg").innerHTML="Login Success"

}else{

document.getElementById("loginmsg").innerHTML="Wrong Login"

}

}

function updateTable(){

let table=document.getElementById("studentTable")

table.innerHTML=""

students.forEach(s=>{

let row=`
<tr>
<td>${s.name}</td>
<td>${s.email}</td>
<td>${s.course}</td>
</tr>
`

table.innerHTML+=row

})

}

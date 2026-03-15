let students=[]

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

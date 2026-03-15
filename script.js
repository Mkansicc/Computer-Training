let students=[];

function showSection(id){

let pages=document.querySelectorAll('.page');

pages.forEach(p=>p.style.display='none');

document.getElementById(id).style.display='block';

}

showSection('home');

document.getElementById('registerForm').addEventListener('submit',function(e){

e.preventDefault();

let name=document.getElementById('name').value;
let email=document.getElementById('email').value;
let course=document.getElementById('course').value;

students.push({name,email,course});

updateStudents();

this.reset();

});

function updateStudents(){

let list=document.getElementById('studentList');

list.innerHTML='';

students.forEach(s=>{

let li=document.createElement('li');

li.innerText=s.name+" - "+s.course;

list.appendChild(li);

});

document.getElementById('studentCount').innerText=students.length;

}

function studentLogin(){

let email=document.getElementById('loginEmail').value;

let student=students.find(s=>s.email===email);

if(student){

document.getElementById('studentDashboard').innerHTML=

"Welcome "+student.name+"<br>Course: "+student.course;

}else{

alert("Student not found");

}

}

function adminLogin(){

let user=document.getElementById('adminUser').value;

let pass=document.getElementById('adminPass').value;

if(user=="admin" && pass=="1234"){

document.getElementById('adminPanel').innerHTML=

"Admin Logged In<br>Total Students: "+students.length;

}else{

alert("Wrong login");

}

}

function generateCertificate(){

let name=document.getElementById('certName').value;

let course=document.getElementById('certCourse').value;

let cert=`

<h3>CoTeSy IT Services</h3>

<h2>Certificate of Completion</h2>

<p>This certificate is awarded to</p>

<h2>${name}</h2>

<p>for completing</p>

<h3>${course}</h3>

`;

document.getElementById('certificatePreview').innerHTML=cert;

}

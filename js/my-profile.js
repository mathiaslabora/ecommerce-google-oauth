"use strict";
let nam = document.getElementById('name');
let age = document.getElementById('age');
let mail = document.getElementById('mail');
let tel = document.getElementById('tel');
let objSaveData = {};
let catchDataObj;
//para introducir datos en inputs no editables:
let nam2 = document.getElementById('name2');
let age2 = document.getElementById('age2');
let mail2 = document.getElementById('mail2');
let tel2 = document.getElementById('tel2');


//func que introduce la info en los placeholder de los input.
const putValue = () => {

  if (catchDataObj) {
    nam.value = catchDataObj.nombre;
    age.value = catchDataObj.edad;
    mail.value = catchDataObj.email;
    tel.value = catchDataObj.telefono;
    nam2.value = catchDataObj.nombre;
    age2.value = catchDataObj.edad;
    mail2.value = catchDataObj.email;
    tel2.value = catchDataObj.telefono;
  }
}


document.addEventListener("DOMContentLoaded", function (e) {

  const parseRedir = JSON.parse(localStorage.getItem('dataUser'));
  if (parseRedir === null) {
    window.location.href = "login.html";
  }


  let firstLetterMayus = parseRedir[0].user; 
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
document.getElementById("profileWelcome").innerHTML = `
<p>
Usuario: <b>${capitalizeFirstLetter(firstLetterMayus)}</b>, bienvenido!
<br><br>
Aquí se encuentran sus datos personales:
</p>`


  catchDataObj = JSON.parse(localStorage.getItem("dataObj"))
  putValue();

  //mensaje si campos vacios
if(nam.value ==="" && age.value ==="" && mail.value ==="" && tel.value ===""){
  document.getElementById('btnEditD').innerHTML = `Complete sus datos`
document.getElementById('intMsj').innerHTML = `
<div class="alert alert-success" role="alert">
  Bienvenido, complete sus datos por primera vez! Muchas Gracias!
</div>
`
setTimeout(() => {
  document.getElementById('intMsj').innerHTML = "";
  }, 4000)
}

  //boton guardar, guarda en objeto y en localstorage
  document.getElementById('save').addEventListener('click', () => {
    if(nam.value === "" || age.value === "" || mail.value === ""){
      document.getElementById('intMsj').innerHTML = `
<div class="alert alert-danger" role="alert">
  Ingrese los campos con * , son obligatorios!!
</div>`
setTimeout(() => {
  document.getElementById('intMsj').innerHTML = "";
  }, 4000)
    }else{
      document.getElementById('btnEditD').innerHTML = `Editar datos`
      objSaveData = {
      nombre: nam.value,
      edad: age.value,
      email: mail.value,
      telefono: tel.value
    }
    nam2.value = nam.value;
    age2.value = age.value;
    mail2.value = mail.value;
    tel2.value = tel.value;
    localStorage.setItem("dataObj", JSON.stringify(objSaveData))
    
    document.getElementById('intMsj').innerHTML = `
<div class="alert alert-primary" role="alert">
  Datos guardados satifactoriamente!!
</div>
`
  setTimeout(() => {
document.getElementById('intMsj').innerHTML = "";
}, 4000)
    }
    
  })
});
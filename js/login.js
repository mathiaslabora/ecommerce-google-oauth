//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
const data = [];
const userText = document.getElementById('user');
const passText = document.getElementById('pass');


//funcion que impide avanzar al index si los campos de usuario y constraseña estan vacios
const buttonSend = () => {
    const user = userText.value;
    const pass = passText.value;
    if (!user || !pass) {
        alert("Debe ingresar ambos campos!");
    } else {
        data.push({
            user,
            pass
        })
    //guarda en localstorage usuario y contrasena
        localStorage.setItem("dataUser", JSON.stringify(data))
        window.location.href = "index.html";
        userText.value = "";
        passText.value = "";
    }
}
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    userText.value = profile.getEmail(); // Do not send to your backend! Use an ID token instead.
    passText.value = profile.getName();
    var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
    buttonSend();
  }

  window.onLoadCallback = function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

document.addEventListener("DOMContentLoaded", function (e) {
    signOut();
    document.getElementById("enviar").addEventListener("click", buttonSend);
});
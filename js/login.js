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

document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("enviar").addEventListener("click", buttonSend);
});
const CATEGORIES_URL = "http://localhost:3000/category/all";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/product/publish";
const CATEGORY_INFO_URL = "http://localhost:3000/category/1234";
const PRODUCTS_URL = "http://localhost:3000/product/all";
const PRODUCT_INFO_URL = "http://localhost:3000/product/5678";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/product/comments";
const CART_INFO_URL = "http://localhost:3000/cart/654";
const CART_BUY_URL = "http://localhost:3000/cart/buy";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}


var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

const logOf = () => {//boton cerrar sesion
  localStorage.clear();
  window.location.reload();
}  


document.addEventListener("DOMContentLoaded", function (e) {

const parseRedir = JSON.parse(localStorage.getItem('dataUser'));
//si el objeto esta vacio redirige a login
  setTimeout(() => {
    if (parseRedir === null) {
    window.location.href = "login.html";
  }
}, 4000)
  


document.getElementById("cerrar").addEventListener("click", logOf)//escucha boton cerrar sesion

  //muestra nombre de usuario en barra nav
  let ingUsu = document.getElementById('dropdownMenuLink');
  let firstLetterMayus = parseRedir[0].user; 
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  ingUsu.innerHTML = capitalizeFirstLetter(firstLetterMayus)


});
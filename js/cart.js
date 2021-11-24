"use strict";
let divPut = document.getElementById('putProd');
let tabPut = document.getElementById('putTableR');
let selectSendMetod = document.getElementById('metEnv');
let getO; //objeto ref al json
let selector = "TJ";

//arrays para extraer datos y poder utilizarlos y modificarlos:
let unitCost = [];
let nam = [];
let src = [];
let currency = [];
let tot = [];
let count = [];
//variables a utilizar:
let subTotal = 0;
let total;
let costSend = 0;
let typeCurrency = 'UYU';
let dolar = 40;
//array de nombres para post a mongo:
let nameToSave = [];

//funcion que guarda los datos del json en respectivos arrays,se iguala la moneda en caso que sea dolar a peso
const saveDat = () => {
  unitCost = [];
  nam = [];
  src = [];
  currency = [];
  tot = [];
  count = [];
  for (let h of getO) {
      count.push(h.count);
      tot.push(h.unitCost * h.count);
      currency.push(h.currency);
      nam.push(h.name);
      if (h.currency === "USD") {
        unitCost.push((h.unitCost) * dolar)
      } else {
        unitCost.push(h.unitCost)
      }
      src.push(h.src);
    }   
}

//toma datos almacenados en los array con el indice correspondiente y muestra en pantalla:
const putDat = () => {
nameToSave = [];
  divPut.innerHTML = "";
  for (let h in getO) {
    nameToSave.push(nam[h]);
      tot[h] = unitCost[h] * count[h];
      divPut.innerHTML += `<div class="d-flex w-100 justify-content-between">
<div class="col"><img width='100px' src="${src[h]}" class="img-thumbnail">
<h4 class="mb-1">${nam[h]}</h4>
</div>
<div class="col">
<h5 class="mb-1">${typeCurrency} ${operCurr(unitCost[h])} C/U</h5>
<br>
<h5 class="mb-1">Total Articulos:${typeCurrency} ${operCurr(tot[h])}</h5>
</div>
<div class="col">
<label for="qElem${h}">Cantidad:
<input id="qElem${h}" class="sizeInput backColor" onchange="changeCoun(${h})" placeholder="${count[h]}" type="number" max="500" /></label>
<button type="button" onclick="deleteProd(${h})" class="btn btn-dark mt-4">Quitar articulo</button>
</div> 
</div>
</div>
<hr>`
    
  }
  //calculo con el for el subtotal sumando todos los totales por articulos.
  subTotal = 0;
  for (let i of tot) { subTotal += i };
  costSend = subTotal * (selectSendMetod.value);
  total = parseFloat(subTotal) + parseFloat(costSend);
  //creacion tabla con costos
  tabPut.innerHTML = `<tr>
    <th>Subtotal:</th>
    <td>${typeCurrency}  ${operCurr(subTotal)}</td>
    </tr>
    <tr>
    <th>Costo de envío:</th>
    <td>${typeCurrency} ${operCurr(costSend)}</td>
    </tr>
    <tr>
    <th>Costo Total:</th>
    <td>${typeCurrency} ${operCurr(total)}</td>
    </tr>`
}

//funcion que devuelve los precios en la moneda seleccionada 
const operCurr = (param) => {
  if (typeCurrency === 'USD') {
    return param / dolar;
  } else {
    return param;
  }
}
//funcion que utilizan los input creados con onchange en cada articulo agregado
const changeCoun = (o) => {
  count[o] = document.getElementById('qElem' + o).value;
  putDat();
}

//funcion eliminar prod
const deleteProd = (p) => {

  let deletedProd = getO.splice(p, 1);
  saveDat()
  putDat()
}


document.addEventListener("DOMContentLoaded", async function (e) {
  const parseRedir = JSON.parse(localStorage.getItem('dataUser'));
  if (parseRedir === null) {
    window.location.href = "login.html";
  }
  const jsonbuy = (await getJSONData(CART_BUY_URL)).data;
  const jsonCatch = (await getJSONData(CART_INFO_URL)).data;
  getO = jsonCatch;
  saveDat();
  putDat();
  //metodo de envio:
  selectSendMetod.addEventListener('change', () => {
    putDat();
  })
  //boton compra:  
  document.getElementById('buy').addEventListener('click', async () => {
        //boton extra procesando su compra cuando click en comprar
    if (total !== 0) {

      if (document.getElementById("address").value === "") {
        alert('Seleccione un metodo de Envío');
      } else if (selector === "TJ" && document.getElementById("tar").value === "") {
        alert('Seleccione una forma de pago');
      } else if (selector === "TR" && document.getElementById("numbBank").value === "") {
        alert('Seleccione una forma de pago');
      } else {
        
        
        

        document.getElementById('messageSucc').innerHTML = `<button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Procesando su compra...
  </button>`
        setTimeout(() => {
          //temporizador para mostrar mensaje exitoso desde json
          document.getElementById('messageSucc').innerHTML = `<div class="alert alert-success">
  <strong>${jsonbuy[0].msg}</strong>
</div>`
          //temporizador para borrar contenidos
          setTimeout(() => {
            document.getElementById('messageSucc').innerHTML = "";
          }, 4000)
        }, 5000)
      }
      //post a mongodb datos de compra
      await fetch("http://localhost:3000/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "Articulos vendidos":nameToSave,
        "Costo de envio":costSend,
        "Subtotal": subTotal,
        "Costo total": total,
      })
    })
    } else {


      //muestro mensaje si no hay nada en carrito impide "comprar"
      document.getElementById('messageSucc').innerHTML = `<div class="alert alert-success">
  <strong>"El carrito está vacío"</strong>
</div>`
      //temporizador para borrar contenidos
      setTimeout(() => {
        document.getElementById('messageSucc').innerHTML = "";
      }, 4000)
    }
  })

  //boton de tipo de moneda:
  document.getElementById('curr').addEventListener('change', () => {
    typeCurrency = document.getElementById('curr').value;
    putDat();
  })

  //selec metodo de compra

  document.getElementById('selecMet').addEventListener('change', () => {
    selector = document.getElementById('selecMet').value;
    let met = document.getElementById('selecMet');
    let putMetP = document.getElementById('addMet');
    if (met.value === 'TJ') {
      //metodo tarjeta de credito
      putMetP.innerHTML = `
<div class="form-group">

<form>
                  <label for="t">Nombre y apellido del titular:</label>
                  <input class="form-control mb-4" id="nameS" placeholder="Ingrese nombre y apellido" type="text">

                  <label for="n">Numero tarjeta de credito:</label>
                  <input class="form-control mb-4" id="tar" placeholder="Ingrese entre 10 y 14 digitos de su tarjeta" type="number">

                  <label for="d">Fecha de vencimiento:</label>
                  <input class="form-control mb-4" id="dat" type="date">

                  <label for="c">CVV:</label>
                  <input class="form-control mb-4" id="cvv" placeholder="Numero de 3 o 4 digitos" type="text">
                </form>
`
    } else {
      //metodo transferencia bancaria
      putMetP.innerHTML = `
<form>
<label for="t">Seleccione banco</label>
<select class="form-control" name="t" id="t">
  <option value="">BROU</option>
  <option value="">Scotiabank</option>
  <option value="">Santander</option>
  <option value="">HSBC</option>
  <option value="">ITAU</option>
</select>
  <label>Nro de cuenta bancaria:</label>
  <input class="form-control" id="numbBank" placeholder="Numero de cuenta de 8 a 14 digitos" type="number">
</form>
`
    }

  })

  //funcion validacion envio
  document.getElementById('btnSend').addEventListener('click', () => {
    let m = document.getElementById("address").value;
    let n = document.getElementById("country").value;
    let o = document.getElementById("corner").value;
    let expreg = /^\s*$/; //campo vacio

    if (expreg.test(m) || expreg.test(n) || expreg.test(o)) {
      alert("Uno o más campos estan vacíos o no cunplen con el formato requerido!");
    } else {
      $('#exampleModal2').modal('toggle')
    }
  })

  //funcion validacion forma de pago
  document.getElementById('btnPay').addEventListener('click', () => {

    if (selector === "TJ") {

      let name = document.getElementById("nameS").value;
      let tar = document.getElementById("tar").value;
      let dat = document.getElementById("dat").value;
      let nroCvv = document.getElementById("cvv").value;
      let expreg = /^\s*$/; //campo vacio
      let cvv = /^[0-9]{3,4}$/; //expresion cvv
      let numbTar = /^[0-9]{10,14}$/;//expresion tarjeta de 10 a 14 nros


      if (expreg.test(name) || expreg.test(dat) || !(cvv.test(nroCvv)) || !(numbTar.test(tar))) {
        alert("Uno o más campos estan vacíos o no cunplen con el formato requerido!");
      } else {
        $('#exampleModal').modal('toggle')
      }
    } else if (selector === "TR") {

      let expreg2 = /^[0-9]{8,14}$/; //campo vacio
      let numbBank = document.getElementById("numbBank").value;

      if (!expreg2.test(numbBank)) {
        alert("Uno o más campos estan vacíos!");
      } else {
        $('#exampleModal').modal('toggle')
      }

    }
  })


});
"use strict";
let defOrd = 'REL';
let priceFrom;
let priceTo;
let prodFilt; //aqui queda el objeto del json 
let listado = document.getElementById('listadoColeccion');
let msj = document.getElementById('putMsj')
const createListOfProd = (productos) => {
    listado.innerHTML = "";
    const lista = document.createElement('div');
    lista.classList.add('row')
    //en forma de tarjetas:
    for (let key of productos) {
        lista.innerHTML += `
       <div class="col-md-4">
        <a href="product-info.html" class="card mb-4 shadow-sm custom-card">
            <img src="` + key.imgSrc + `" alt="` + key.description + `" class="img-thumbnail">
            <h3 class="m-3">`+ key.name + `</h3>
          
            <div class="card-body">
                <small class="text-muted">` + key.soldCount + ` vendidos</small>
                <p class="card-text">` + key.description + `</p>
                <p class="mb-1">` + key.currency + ` ` + key.cost + `</p>
            </div>
        </a>
      </div>
           `
        listado.appendChild(lista)
    }
    localStorage.setItem("arrayProductos", JSON.stringify(prodFilt))//guardo array de productos en localStorage
}

/*
en forma de listas:
<div class="row prodSt">
        <div class="col-3">
            <img src="` + key.imgSrc + `" alt="` + key.description + `" class="img-thumbnail">
        </div>
        <div class="col">
            <div class="d-flex w-100 justify-content-between">
                <h2 class="mb-1">`+ key.name + `</h2>
                <small class="text-muted">` + key.soldCount + ` vendidos</small>
            </div>
            <p class="mb-1">` + key.description + `</p><br>
            <p class="mb-1">` + key.currency + ` ` + key.cost + `</p>
        </div>
    </div> */


function ordPorPrecioYRel(array, defOrd) {
    defOrd === 'AZ' ? array.sort((a, b) => {
        return a.cost - b.cost
    })
        : defOrd === 'ZA' ? array.sort((a, b) => {
            return b.cost - a.cost
        })
            : array.sort((a, b) => {
                if (a.soldCount < b.soldCount) { return 1 }
                else { return -1 }
                return 0;
            })
    return createListOfProd(array)
}

//funcion para el filter
function dentroDeRango(products) {
    return products.cost >= priceFrom && products.cost <= priceTo
}
//funcion de filtrado
function filtradoPorPrecio(productos) {
    if (priceFrom !== undefined && priceFrom !== undefined) {
        prodFilt = productos.filter(dentroDeRango)//guardo los prod filtrados asi se pueden ordenar despues de filtrados
        createListOfProd(prodFilt)
    }
}


//funcion buscar
let valueSerch = document.getElementById('SER');
valueSerch.value = ""
const auxfiltSearch = (products) => {
    return ((products.name).toUpperCase()).includes((valueSerch.value).toUpperCase())
}
const filtSearch = (q) => {
    prodFilt = q.filter(auxfiltSearch);
    createListOfProd(prodFilt)
}


document.addEventListener("DOMContentLoaded", async function (e) {

    prodFilt = (await getJSONData(PRODUCTS_URL)).data //traigo el json correspondiente

    ordPorPrecioYRel(prodFilt, defOrd) //se ordena en ingreso por relevancia

    //buscar
    let products = prodFilt;
    document.getElementById('SER').addEventListener('keyup', () => {
        filtSearch(products);
    })

    //siguientes botones orden precio mayor menor y relevancia:
    document.getElementById('AZ').addEventListener('click', () => {
        defOrd = 'AZ';
        if (prodFilt.length != 0) {
            ordPorPrecioYRel(prodFilt, defOrd)
        }
    })
    document.getElementById('ZA').addEventListener('click', () => {
        defOrd = 'ZA';
        if (prodFilt.length != 0) {
            ordPorPrecioYRel(prodFilt, defOrd)
        }
    })
    document.getElementById('REL').addEventListener('click', () => {
        defOrd = 'REL';
        if (prodFilt.length != 0) {
            ordPorPrecioYRel(prodFilt, defOrd)
        }
    })


    //limpia filtro
    document.getElementById('cleanFilter').addEventListener('click', () => {
        document.getElementById('from').value = "";
        document.getElementById('to').value = "";
        priceFrom = undefined;
        priceTo = undefined;
        prodFilt = products
        ordPorPrecioYRel(prodFilt, defOrd)
    })


    //cambia valores en form de input -desde-
    document.getElementById('from').addEventListener('input', () => {
        priceFrom = document.getElementById('from').value;
    })
    //cambia valores en form de input -hasta-
    document.getElementById('to').addEventListener('input', () => {
        priceTo = document.getElementById('to').value;
    })
    //siguiente filtrado por precio desde hasta:
    document.getElementById('filter').addEventListener('click', () => {
        if (priceFrom === undefined && priceTo !== undefined) {
            priceFrom = 0;
        }
        if ((priceTo && priceFrom) === "") {
            ordPorPrecioYRel(prodFilt, defOrd)
        } else if (parseInt(priceFrom) > parseInt(priceTo)) {
            msj.innerHTML = `
                <div class="alert alert-primary" role="alert">
                Ingrese precio mas bajo en DESDE y mas alto en HASTA!!
</div>
`
            setTimeout(() => {
                msj.innerHTML = "";
            }, 4000)
        } else if (((parseInt(priceFrom) === 0) && (parseInt(priceTo) === 0))) {
            msj.innerHTML = `
                <div class="alert alert-primary" role="alert">
  No hay productos para ese rango de precios!!
</div>
`
            setTimeout(() => {
                msj.innerHTML = "";
            }, 4000)
        } else {
            filtradoPorPrecio(products)
            if (prodFilt.length === 0) {
                msj.innerHTML = `
                <div class="alert alert-primary" role="alert">
  No hay productos para ese rango de precios!!
</div>
`
                setTimeout(() => {
                    msj.innerHTML = "";
                }, 4000)
            }
        }
    })
})

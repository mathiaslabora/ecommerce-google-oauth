const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')

//config

const CATEGORIES_URL = "/category/all";
const CATEGORY_INFO_URL = "/category/1234";
const PUBLISH_PRODUCT_URL = "/product/publish";
const PRODUCTS_URL = "/product/all";
const PRODUCT_INFO_URL = "/product/5678";
const PRODUCT_INFO_COMMENTS_URL = "/product/comments";
const CART_INFO_URL = "/cart/654";
const CART_BUY_URL = "/cart/buy";
// direcciones a json locales:
/* let cartB = require('../Backend/JSON/cart/buy.json');
let cart654 = require('../Backend/JSON/cart/654.json');
let prodComm = require('../Backend/JSON/product/5678-comments.json');
let prodInfo = require('../Backend/JSON/product/5678.json');
let prod = require('../Backend/JSON/product/all.json');
let prodPub = require('../Backend/JSON/product/publish.json');
let catInfo = require('../Backend/JSON/category/1234.json');
let cat = require('../Backend/JSON/category/all.json'); */

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));//se encarga de entender los datos que envia un form desde html
app.use(express.json());

//conection db
const { MongoClient } = require('mongodb');
const password = 'ecommerceJAP';
const nameDB = 'contaJSON'
const URI = `mongodb+srv://ecommerceJAP:${password}@cluster0.4xwfp.mongodb.net/${nameDB}?retryWrites=true&w=majority`
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db = client.db(nameDB);


//Routes
//todas dirigidas a base de datos mongoatlas.
app.get(CATEGORIES_URL, async (req, res) => {
    try {
        await client.connect();
        const allJ = await db.collection('all').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
        
    }
    await client.close()
});
app.get(CATEGORY_INFO_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('1234').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close()
});
app.get(PUBLISH_PRODUCT_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('publish').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close()

});
app.get(PRODUCTS_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('allP').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close() });
app.get(PRODUCT_INFO_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('5678').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close()});
app.get(PRODUCT_INFO_COMMENTS_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('5678C').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close() });
app.get(CART_INFO_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('654').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close()});
app.get(CART_BUY_URL, async (req, res) => { 
    try {
        await client.connect();
        const allJ = await db.collection('buy').find().toArray()
        res.json(allJ)
    } catch (error) {
        console.log(error)
    }
    await client.close() });

app.post("/purchase", async(req, res) =>{
    let body = req.body
    console.log(body)
    try {
        await client.connect()
        await db.collection('transaction').insertOne(body)
    } catch (error) {
        console.log(error)
    }


})

//init server
app.listen(3000, () => {
    console.log('eCommerce escuchando en el puerto 3000!')
})




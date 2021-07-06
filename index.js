const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const objectID = require('mongodb').ObjectID
const { MongoClient } = require('mongodb');
// console.log(process.env.DB_USER);
// const port = 5000
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('server side of Agro-hut')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oysdd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
    const productsCollection = client.db("agro-hut").collection("products");
    const ordersCollection = client.db("agro-hut").collection("orders");
    const reviewsCollection = client.db("agro-hut").collection("reviews");
    const salePosterCollection = client.db("agro-hut").collection("saleposter");
    const adminCollection = client.db("agro-hut").collection("admin");
    console.log("db connected succesfully");
    // perform actions on the collection object
    //   client.close();

    // For adding products
    app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        console.log('adding products ', newProduct);
        productsCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })

    })


    // for getting products
    app.get('/products', (req, res) => {
        productsCollection.find()
            .toArray((err, items) => {
                res.send(items)
                console.log('from db', items)
            })

    })

    //adding getting orders

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
        // console.log(newOrder);
    })

    // Getting specific email orders
    app.get('/orders', (req, res) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    //getting all orders
    app.get('/allOrders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })


    })



    //   posting reviews
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding service ', newReview);
        reviewsCollection.insertOne(newReview)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })

    })

    // for getting reviews

    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, items) => {
                res.send(items)
                // console.log('from db',items)
            })

    })

    // For adding Saleposter
    app.post('/addSalePoster', (req, res) => {
        const newSaleProduct = req.body;
        console.log('adding products ', newSaleProduct);
        salePosterCollection.insertOne(newSaleProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })

    })

    //getting saleposters
    app.get('/salePosters', (req, res) => {
        salePosterCollection.find()
            .toArray((err, items) => {
                res.send(items)
                // console.log('from db',items)
            })

    })

    //deleting products
    app.delete('/deleteProduct/:id', (req, res) => {

        const id = objectID(req.params.id);
        console.log('delete this ', id);
        productsCollection.findOneAndDelete({ _id: objectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
                console.log(result);
            });
        console.log(req.params.id);

    })


    //deleting reviews
    app.delete('/deletereviews/:id', (req, res) => {
        const id = objectID(req.params.id);
        console.log('delete this ', id);
        reviewsCollection.findOneAndDelete({ _id: objectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
                console.log(result);
            });
        console.log(req.params.id);

    })

    //Making admin

    app.post('/adminEmail', (req, res) => {
        const newAdmin = req.body;
        console.log(newAdmin);
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)

            })
        // console.log(newOrder);
    })

    ////filtering admin
    app.get('/isAdmin', (req, res) => {
        const email = req.query.email
        adminCollection.find({ email: email })
            .toArray((err, documents) => {
                console.log(documents);
                res.send(documents.length > 0)
            })

    })






});


app.listen((process.env.PORT || port))
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;


// bikeuser1
// Ncm9Jqk55kUA04Fe

// middleware
app.use(cors())
app.use(express.json())

// mongodbconnection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajbho.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const bikeCollection = client.db("bikePark").collection("bikeCollection")
        console.log("connected")

        // get all bike items api
        app.get('/bikeitems', async (req, res) => {
            const email = req.query.email;
            let query;
            if (email) {
                query = { email: email }
            } else {
                query = {};
            }
            const cursor = bikeCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // find a data from database mongo
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.findOne(query)
            res.send(result)
        })

        // update a data from mongodb database
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            console.log(body)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateProduct = {
                $set: {
                    name: body.name,
                    img: body.img,
                    price: body.price,
                    supplier: body.supplier,
                    description: body.description,
                    quantity: body.quantity
                }
            }
            const result = await bikeCollection.updateOne(filter, updateProduct, options)
            res.send(result)
        })

        // insert an item in database
        app.post('/bikeitems', async (req, res) => {
            const body = req.body;
            const result = await bikeCollection.insertOne(body);
            res.send(result)
        })

        // dlete an itemm 
        app.delete('/bikeitems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.deleteOne(query)
            res.send(result)
        })

    } finally {

    }
}

run().catch(console.dir)

// general api
app.get('/', (req, res) => {
    res.send('I am Bike parker. Are you ready to go?')
})

// Port listen
app.listen(port, () => {
    console.log('My port is', port)
})
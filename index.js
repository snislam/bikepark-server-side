const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('connected')
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect()
        const bikeCollection = client.db("bikePark").collection("bikeCollection")
        console.log("connected")

        // get all bike items api
        app.get('/bikeitems', async (req, res) => {
            const query = {};
            const cursor = bikeCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
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
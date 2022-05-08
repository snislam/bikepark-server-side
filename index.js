const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// middletear
async function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "unautorized access" });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden" })
        } else {
            req.decoded = decoded;
            next();
        }
    })
}


// mongodbconnection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajbho.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const bikeCollection = client.db("bikePark").collection("bikeCollection");
        const faculty = client.db("bikePark").collection("faculty");
        const blogCollection = client.db("bikePark").collection("blog")
        console.log("connected")


        // post user for jwt
        app.post('/token', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.send(token)
        })

        // get all bike items api
        app.get('/bikeitems', async (req, res) => {
            const query = {}
            const cursor = bikeCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.get('/mybikeitems', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email }
                const cursor = bikeCollection.find(query);
                const items = await cursor.toArray();
                res.send(items);
            } else {
                res.status(403).send({ message: "Forbidden" })
            }
        })

        // get faculty data
        app.get('/faculty', async (req, res) => {
            const query = {}
            const cursor = faculty.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get blog data
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);
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
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// general api
app.get('/', (req, res) => {
    res.send('I am Bike parker. Are you ready to go?')
})

// Port listen
app.listen(port, () => {
    console.log('My port is', port)
})
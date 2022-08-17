// Import express
let express = require('express')

const mongodb = require('./mongodb/mongodb.utils')
// Initialize the app
let app = express();

console.log(process.env.MONGODB_URL)

let apiRoutes = require('./routes/api-routes')
//Middleware

//this helps the express middleware to handle the json body request we call with the endpoint
app.use(express.json());

app.use('/api',apiRoutes)

app.get('/', (req,res) => {
    res.status(200).json("hello from employee app");
})

module.exports = app;
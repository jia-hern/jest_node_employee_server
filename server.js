const app = require('./app');
const mongodb = require('./mongodb/mongodb.utils');
let port = 8080
mongodb.connect();

app.listen(port, ()=>{
    console.log("running employee app on port ", port)
})
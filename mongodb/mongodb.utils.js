const mongoose = require('mongoose');
const dotenv = require('dotenv');
console.log('dotenv called')
dotenv.config()
const connect = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,
            {   useNewUrlParser: true ,
                useUnifiedTopology: true });
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

//using callback
// const connect = () =>{
//     mongoose.connect(
//         process.env.MONGODB_URL,
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         () => {
//             console.log('connected to mongo db');
//         }
//       );
// }

//using promise
// const connect = () => {
//     mongoose.connect(
//         process.env.MONGODB_URL,
//         { useNewUrlParser: true, useUnifiedTopology: true })
//         .then((result)=>{
//             console.log("mongoose connected via  promise");
//         })
//         .catch((error)=>{
//             throw new Error("couldnt connect to mongo db");
//         });
//     };

const disconnect = async () => {
    try {
        await mongoose.disconnect();
        // console.log("mongodb database connected disconnected")
    }
    catch (err){
        console.log(err)
        throw new Error(err);
    }
}

const dropCollection = async (collectionName) => {
    try {
        await mongoose.connection.collection(collectionName).drop();
    }
    catch (err){
      if (err.code === 26) {
        console.log('namespace %s not found',collectionName)
      } else {
        throw new Error(err);
      }
    }
}


module.exports = {
    connect,
    disconnect,
    dropCollection
};

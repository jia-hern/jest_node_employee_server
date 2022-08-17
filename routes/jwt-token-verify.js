const jwt = require('jsonwebtoken');

const verifytoken = (req,res,next) => {

    const token = req.header('auth-token');
    console.log(token)
    if(!token)
        res.status(400).json('Token Not Provided in auth-token header');
    try {
        const jwtTokenVerify = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        console.log(jwtTokenVerify)
        req.user = jwtTokenVerify;
        console.log("verify token successful")
    }
    catch(err) {
        console.log(err)
        res.status(400).json("Token was not authenticated or missing")
    }
    next(); // if next() is not provided , middleware will hung here
};

module.exports = {
    verifytoken
};
const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next)=> {
    console.log('req.headers.authorization', req.headers.authorization)
    try{
        const token = req?.headers?.authorization?.split(' ')[1];

        if(!token){
            return res.status(401).json({message: "No Token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
        next();

    }catch(err){
        next(err)
    }
}

module.exports = authMiddleware
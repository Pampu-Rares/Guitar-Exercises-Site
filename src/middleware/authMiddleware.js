import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];
    if(!token) return res.status(401).json({message: "No token provided"});
    jwt.verify(token, process.env.MY_SECRET, (err, decoded) => {
        if(err) return res.status(401).json({message: "Invalid token", err: err});
        req.userId = decoded.id;
        next();
    })
}

export default authMiddleware;
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");

    //if there is no token in the request, then fail
    if (!token) return res.status(401).json({ error: "Access Denied" });

    //check the token...
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();        
    } catch (error) {
        res.status(400).json({ error: "Token is not valid"});
    }
}

module.exports = { verifyToken };
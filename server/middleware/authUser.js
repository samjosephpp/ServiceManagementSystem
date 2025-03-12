const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: "User not authenticated" });
    }
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!verifiedToken) {
        return res.status(400).json({ message: "User not authenticated" });
    }

    req.user = verifiedToken.user;

    console.log("--------------------------------------");
    const time = new Date().toLocaleTimeString();
    console.log('CURRENT TIME IS : ', time)

    next();
};

module.exports = { authenticateToken };

const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: "User not authenticated 0" });
    }

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifiedToken) {
            return res.status(400).json({ message: "User not authenticated 1 " });
        }

        // req.user = verifiedToken.user;
        req.user = verifiedToken; // Ensure req.user is set correctly
       
        console.log("--------------------------------------");
        const time = new Date().toLocaleTimeString();
        console.log('CURRENT TIME IS : ', time)

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "User not authenticated" });
    }


};

module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token." });
    }

    try {
        const secret = "mi_llave_secreta"; 
        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado." });
    }
};
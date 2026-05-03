const jwt = require('jsonwebtoken');
    const secret = "mi_llave_secreta";
    exports.generateToken = (payload) => jwt.sign(payload, secret, { expiresIn: '1h' });
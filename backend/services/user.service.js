const db = require("../models");

const userService = {
    findUserById: async (id) => {
        return await db.Usuario.findByPk(id);
    },
    findUserByEmail: async (email) => {
        return await db.Usuario.findOne({
            where: { email }
        });
    },
    createUser: async (nombre, email, password) => {
        return await db.Usuario.create({
            nombre,
            email,
            password: password
        });
    }
};

module.exports = userService;
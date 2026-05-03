const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Proyecto = sequelize.define('Proyecto', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    });
    return Proyecto;
};
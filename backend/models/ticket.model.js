const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Ticket = sequelize.define('Ticket', {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        estado: {
            type: DataTypes.ENUM('Pendiente', 'En Progreso', 'Completado'),
            defaultValue: 'Pendiente',
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    });
    return Ticket;
};
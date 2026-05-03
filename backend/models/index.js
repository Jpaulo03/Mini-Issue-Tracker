const { sequelize } = require("../config/db.config");
const Usuario = require("./usuario.model")(sequelize);
const Proyecto = require("./proyecto.model")(sequelize);
const Ticket = require("./ticket.model")(sequelize);

// Relaciones Usuario - Proyecto
Usuario.hasMany(Proyecto, { foreignKey: 'duenoId', as: 'proyectosCreados' });
Proyecto.belongsTo(Usuario, { foreignKey: 'duenoId', as: 'dueno' });

// Relaciones Proyecto con Ticket
Proyecto.hasMany(Ticket, { foreignKey: 'proyectoId', as: 'tickets' });
Ticket.belongsTo(Proyecto, { foreignKey: 'proyectoId' });

// Relaciones Usuario con Ticket
Usuario.hasMany(Ticket, { foreignKey: 'asignadoId', as: 'tareas' });
Ticket.belongsTo(Usuario, { foreignKey: 'asignadoId', as: 'responsable' });

module.exports = {
  Usuario,
  Proyecto,
  Ticket,
  sequelize,
  Sequelize: sequelize.Sequelize,
};

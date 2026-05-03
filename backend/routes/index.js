const authController = require("../controllers/auth.controller");
const proyectoController = require("../controllers/proyecto.controller");
const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.post("/api/auth/register", authController.postRegister);
  app.post("/api/auth/login", authController.postLogin);

  //rutas de proyectos
  app.post("/api/proyectos", authMiddleware, proyectoController.postCreate);
  app.get("/api/proyectos", authMiddleware, proyectoController.getList);
  app.get("/api/proyectos/:id", authMiddleware, proyectoController.getDetail); 
  app.put("/api/proyectos/:id", authMiddleware, proyectoController.putUpdate); 

  // Rutas de Tickets
  app.post("/api/tickets", authMiddleware, ticketController.postCreate);
  app.get("/api/tickets", authMiddleware, ticketController.getList);
  app.get("/api/tickets/:id", authMiddleware, ticketController.getDetail); 
  app.put("/api/tickets/:id", authMiddleware, ticketController.putUpdateInfo); 
  app.put("/api/tickets/:id/estado", authMiddleware, ticketController.putUpdateStatus);
};
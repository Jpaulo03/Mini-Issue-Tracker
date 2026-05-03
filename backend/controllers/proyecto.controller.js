const { Proyecto } = require("../models");

exports.postCreate = async (req, res) => {
    const { nombre, descripcion } = req.body;
    
    const duenoId = req.user.id;

    try {
        const nuevoProyecto = await Proyecto.create({
            nombre,
            descripcion,
            duenoId
        });
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el proyecto", error: error.message });
    }
};

exports.getList = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll({
            where: { duenoId: req.user.id }
        });
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener proyectos" });
    }
};

exports.getDetail = async (req, res) => {
    try {
        const proyecto = await Proyecto.findOne({
            where: { id: req.params.id, duenoId: req.user.id },
            include: ["tickets"] 
        });
        if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el detalle" });
    }
};

exports.putUpdate = async (req, res) => {
    try {
        const proyecto = await Proyecto.findOne({
            where: { id: req.params.id, duenoId: req.user.id }
        });
        if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

        const { nombre, descripcion } = req.body;
        proyecto.nombre = nombre || proyecto.nombre;
        proyecto.descripcion = descripcion || proyecto.descripcion;
        
        await proyecto.save();
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el proyecto" });
    }
};
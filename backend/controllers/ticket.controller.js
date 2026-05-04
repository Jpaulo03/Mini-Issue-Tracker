const { Ticket, Proyecto, Usuario } = require("../models");
const Joi = require('joi');

exports.postCreate = async (req, res) => {
    const schema = Joi.object({
        titulo: Joi.string().min(3).required(),
        descripcion: Joi.string().allow(''),
        proyectoId: Joi.number().required(),
        emailAsignado: Joi.string().email().allow(null, '') 
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { titulo, descripcion, proyectoId, emailAsignado } = req.body;
        let asignadoId = null;

        if (emailAsignado) {
            const usuario = await Usuario.findOne({ where: { email: emailAsignado } });
            if (!usuario) {
                return res.status(404).json({ message: "No se encontró ningún usuario con ese correo electrónico." });
            }
            asignadoId = usuario.id;
        }
        
        const nuevoTicket = await Ticket.create({
            titulo,
            descripcion,
            proyectoId,
            asignadoId,
            estado: 'Pendiente'
        });

        res.status(201).json(nuevoTicket);
    } catch (err) {
        res.status(500).json({ message: "Error al crear el ticket", error: err.message });
    }
};

exports.putUpdateStatus = async (req, res) => {
    const { id } = req.params;
    const { nuevoEstado } = req.body;
    const estados = ['Pendiente', 'En Progreso', 'Completado'];

    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const indiceActual = estados.indexOf(ticket.estado);
        const indiceNuevo = estados.indexOf(nuevoEstado);

        if (Math.abs(indiceActual - indiceNuevo) !== 1) {
            return res.status(400).json({ 
                message: "Cambio de estado no permitido. Solo se puede mover entre estados contiguos." 
            });
        }

        if (nuevoEstado === 'En Progreso' && !ticket.asignadoId) {
            return res.status(400).json({ message: "El ticket debe tener un responsable para iniciar." });
        }

        ticket.estado = nuevoEstado;
        await ticket.save();
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

exports.getList = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            where: { asignadoId: req.user.id }
        });
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener tareas" });
    }
};

exports.getDetail = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id, {
            include: ["responsable"] 
        });
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el detalle del ticket" });
    }
};

exports.putUpdateInfo = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const { titulo, descripcion, asignadoId } = req.body;
        ticket.titulo = titulo || ticket.titulo;
        ticket.descripcion = descripcion || ticket.descripcion;
        ticket.asignadoId = asignadoId || ticket.asignadoId;

        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: "Error al editar ticket" });
    }
};
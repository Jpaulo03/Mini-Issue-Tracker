import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    asignadoId: "",
  });

  const [error, setError] = useState("");

  const estados = ["Pendiente", "En Progreso", "Completado"];

  useEffect(() => {
    api
      .get(`/proyectos/${id}`)
      .then((response) => {
        setProyecto(response.data);
        setTickets(response.data.tickets || []);
      })
      .catch(() => {
        setError("Error al cargar el proyecto");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const crearTicket = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        proyectoId: Number(id),
        asignadoId: form.asignadoId ? Number(form.asignadoId) : null,
      };

      await api.post("/tickets", payload);

      setForm({
        titulo: "",
        descripcion: "",
        asignadoId: "",
      });

      const response = await api.get(`/proyectos/${id}`);
      setProyecto(response.data);
      setTickets(response.data.tickets || []);
    } catch (error) {
      setError(error.response?.data?.message || "Error al crear ticket");
    }
  };

  const cambiarEstado = async (ticketId, nuevoEstado) => {
    setError("");

    try {
      await api.put(`/tickets/${ticketId}/estado`, {
        nuevoEstado,
      });

      const response = await api.get(`/proyectos/${id}`);
      setProyecto(response.data);
      setTickets(response.data.tickets || []);
    } catch (error) {
      setError(error.response?.data?.message || "Error al cambiar estado");
    }
  };

  const obtenerSiguienteEstado = (estadoActual) => {
    if (estadoActual === "Pendiente") return "En Progreso";
    if (estadoActual === "En Progreso") return "Completado";
    return null;
  };

  const obtenerEstadoAnterior = (estadoActual) => {
    if (estadoActual === "Completado") return "En Progreso";
    if (estadoActual === "En Progreso") return "Pendiente";
    return null;
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <button onClick={() => navigate("/proyectos")}>Volver</button>
          <h1>{proyecto?.nombre || "Tablero"}</h1>
          <p>{proyecto?.descripcion}</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="card form-row" onSubmit={crearTicket}>
        <input
          name="titulo"
          type="text"
          placeholder="Título del ticket"
          value={form.titulo}
          onChange={handleChange}
        />

        <input
          name="descripcion"
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <input
          name="asignadoId"
          type="number"
          placeholder="ID responsable"
          value={form.asignadoId}
          onChange={handleChange}
        />

        <button type="submit">Crear ticket</button>
      </form>

      <div className="board">
        {estados.map((estado) => (
          <div className="column" key={estado}>
            <h2>{estado}</h2>

            {tickets
              .filter((ticket) => ticket.estado === estado)
              .map((ticket) => {
                const siguiente = obtenerSiguienteEstado(ticket.estado);
                const anterior = obtenerEstadoAnterior(ticket.estado);

                return (
                  <div className="ticket" key={ticket.id}>
                    <h3>{ticket.titulo}</h3>
                    <p>{ticket.descripcion}</p>
                    <small>ID: {ticket.id}</small>

                    <div className="actions">
                      {anterior && (
                        <button onClick={() => cambiarEstado(ticket.id, anterior)}>
                          Volver a {anterior}
                        </button>
                      )}

                      {siguiente && (
                        <button onClick={() => cambiarEstado(ticket.id, siguiente)}>
                          Pasar a {siguiente}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Projects() {
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/proyectos")
      .then((response) => {
        setProyectos(response.data);
      })
      .catch(() => {
        setError("Error al cargar proyectos");
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const crearProyecto = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/proyectos", form);

      setForm({
        nombre: "",
        descripcion: "",
      });

      const response = await api.get("/proyectos");
      setProyectos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear proyecto");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="topbar">
        <h1>Mis proyectos</h1>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="card form-row" onSubmit={crearProyecto}>
        <input
          name="nombre"
          type="text"
          placeholder="Nombre del proyecto"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          name="descripcion"
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <button type="submit">Crear proyecto</button>
      </form>

      <div className="grid">
        {proyectos.map((proyecto) => (
          <div className="card" key={proyecto.id}>
            <h2>{proyecto.nombre}</h2>
            <p>{proyecto.descripcion}</p>

            <button
              onClick={() =>
                navigate(`/proyectos/${proyecto.id}/tablero`)
              }
            >
              Ver tablero
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
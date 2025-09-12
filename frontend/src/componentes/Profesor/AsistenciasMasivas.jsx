import { useState } from "react";

export default function AsistenciasMasivas() {
  const [form, setForm] = useState({
    id_funcionario: "",
    id_grado_asistencia: "",
    fecha: "",
    asistencias: [{ id_estudiante: "", id_estado_asistencia: "", observacion: "" }]
  });

  const handleChange = (e, index, field) => {
    const newAsistencias = [...form.asistencias];
    newAsistencias[index][field] = e.target.value;
    setForm({ ...form, asistencias: newAsistencias });
  };

  const addRow = () => setForm({ ...form, asistencias: [...form.asistencias, { id_estudiante: "", id_estado_asistencia: "", observacion: "" }] });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/profesor/asistencias/registro-masivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      alert(data.mensaje);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="id_funcionario" placeholder="ID Funcionario" onChange={e => setForm({ ...form, id_funcionario: e.target.value })} />
      <input name="id_grado_asistencia" placeholder="ID Grado Asistencia" onChange={e => setForm({ ...form, id_grado_asistencia: e.target.value })} />
      <input type="date" name="fecha" onChange={e => setForm({ ...form, fecha: e.target.value })} />

      {form.asistencias.map((a, i) => (
        <div key={i}>
          <input placeholder="ID Estudiante" value={a.id_estudiante} onChange={e => handleChange(e, i, "id_estudiante")} />
          <input placeholder="ID Estado" value={a.id_estado_asistencia} onChange={e => handleChange(e, i, "id_estado_asistencia")} />
          <input placeholder="Observación" value={a.observacion} onChange={e => handleChange(e, i, "observacion")} />
        </div>
      ))}
      <button type="button" onClick={addRow}>Agregar Estudiante</button>
      <button type="submit">Registrar Masivo</button>
    </form>
  );
}

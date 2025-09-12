export default function AsistenciaItem({ asistencia }) {
  return (
    <tr>
      <td>{asistencia.Estudiante.Persona.nombre} {asistencia.Estudiante.Persona.apellido}</td>
      <td>{asistencia.Funcionario.Persona.nombre} {asistencia.Funcionario.Persona.apellido}</td>
      <td>{asistencia.EstadoAsistencia.nombre}</td>
      <td>{asistencia.fecha}</td>
      <td>{asistencia.observacion}</td>
    </tr>
  );
}

## Obtener estudiantes que dicta clase el profesor

**GET** `/api/profesor/estudiantes`

### Query params
- `profesorId` (obligatorio)
- `nombre`, `apellido`, `numero_documento`, `grado`, `page`, `limit` (opcionales)

### Comportamiento
Solo trae estudiantes de los grados donde el funcionario tiene `rol = 'Profesor'` en `funcionario_grado`.

### Ejemplo
GET /api/profesor/estudiantes?profesorId=10&nombre=Juan



## Asistencias

**POST** POST /api/profesor/asistencias/registrar

## comportamiento##

 Permite registrar una asistencia para un estudiante específico.


Ejemplo
 {
  "id_estudiante": 5,
  "id_funcionario": 18,
  "id_grado_asistencia": 1,
  "id_estado_asistencia": 1,
  "observacion": "Llegó tarde",
  "fecha": "2025-08-07"
}

**Historial de asistencias por profesor**

GET /api/profesor/asistencias/historial/profesor/:id
 **Parametro::id → ID del funcionario (profesor)

 Ejemplo:
 /api/profesor/asistencias/historial/profesor/18

 **Comportamiento**

 Descripción: Muestra todas las asistencias registradas por un profesor específico.

 **Historial de asistencias por estudiante**

 GET /api/profesor/asistencias/historial/estudiante/:id
 **Parametro::id → ID del estudiante

 Ejemplo:/api/profesor/asistencias/historial/estudiante/5

 **Comportamiento
 Muestra todas las asistencias relacionadas a un estudiante específico.

 


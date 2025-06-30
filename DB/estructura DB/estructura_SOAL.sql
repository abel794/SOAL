USE soal1;
-- Estructura tabla persona
SHOW CREATE TABLE persona;

-- Estructura tabla usuario
SHOW CREATE TABLE usuario;

-- Estructura tabla estudiante
SHOW CREATE TABLE estudiante;

-- Estructura tabla funcionario
SHOW CREATE TABLE funcionario;

-- Estructura tabla acudiente
SHOW CREATE TABLE acudiente;

-- Estructura tabla observacion
SHOW CREATE TABLE observacion;

-- Estructura tabla notificacion
SHOW CREATE TABLE notificacion;

-- Estructura tabla justificacion
SHOW CREATE TABLE justificacion;

-- Estructura tabla pqr
SHOW CREATE TABLE pqr;

-- Estructura tabla cita
SHOW CREATE TABLE cita;

-- Estructura tabla asistencia
SHOW CREATE TABLE asistencia;

-- Estructura tabla estudiante_grado
SHOW CREATE TABLE estudiante_grado;

-- Estructura tabla funcionario_grado
SHOW CREATE TABLE funcionario_grado;

-- Estructura tabla auditoria_observacion (si la implementaste)
SHOW CREATE TABLE auditoria_observacion;

-- Estructura tabla tipo_usuario
SHOW CREATE TABLE tipo_usuario;

-- Estructura tabla tipo_documento
SHOW CREATE TABLE tipo_documento;

-- Estructura tabla sexo
SHOW CREATE TABLE sexo;

-- Estructura tabla eps
SHOW CREATE TABLE eps;

-- Estructura tabla estado_usuario
SHOW CREATE TABLE estado_usuario;

-- Estructura tabla estado_academico
SHOW CREATE TABLE estado_academico;

-- Estructura tabla estado_asistencia
SHOW CREATE TABLE estado_asistencia;

-- Estructura tabla estado_pqr
SHOW CREATE TABLE estado_pqr;

-- Estructura tabla estado_notificacion
SHOW CREATE TABLE estado_notificacion;

-- Estructura tabla canal_notificacion
SHOW CREATE TABLE canal_notificacion;

-- Estructura tabla tipo_pqr
SHOW CREATE TABLE tipo_pqr;

-- Estructura tabla gravedad_observacion
SHOW CREATE TABLE gravedad_observacion;

-- Estructura tabla categoria_observacion
SHOW CREATE TABLE categoria_observacion;

-- Estructura tabla nivel_escolaridad
SHOW CREATE TABLE nivel_escolaridad;

-- Estructura tabla relacion_acudiente
SHOW CREATE TABLE relacion_acudiente;

-- Estructura tabla grado
SHOW CREATE TABLE grado;

-- Procedimiento para inactivar usuario
SHOW CREATE PROCEDURE inactivar_usuario;

-- Trigger para auditoría de observaciones (si lo has creado)
SHOW CREATE TRIGGER trg_insert_observacion;

const express = require('express');
const routes = express.Router();
const obtenerUsuario = require('../../controllers/controlador_coordinador/reportes');

routes.get('/obtenerUsuario', obtenerUsuario.ObtenerUsuarios1);
routes.get('/obtenerArchivos', obtenerUsuario.obtenerArchivos);
routes.get('/reporteAsistencia', obtenerUsuario.reportesAsistencia);


routes.get('/descargarArchivo/:id', obtenerUsuario.descargarArchivo);

module.exports = routes;

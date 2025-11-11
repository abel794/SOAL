const express=require('express')
const routes=express.Router()
const obtenerUsuario=require('../../controllers/controlador_coordinador/reportes')


routes.get('/obtenerUsuario',obtenerUsuario.ObtenerUsuarios1)
routes.get('/obtenerArchivo',obtenerUsuario.obtenerArchivo)
routes.get('/reporteAsistencia',obtenerUsuario.reportesAsistencia)


module.exports=routes
const db = require('../models');
const FuncionarioGrado = db.FuncionarioGrado;
const Funcionario = db.Funcionario;
const Grado = db.Grado;
const Persona = db.Persona;
const { Op } = require('sequelize');

const controller = {

  // ✅ Asignar grado a un funcionario
  async asignar(req, res) {
    try {
      const { id_funcionario, id_grado, rol } = req.body;

      const nuevo = await FuncionarioGrado.create({ id_funcionario, id_grado, rol });
      res.status(201).json({ mensaje: 'Asignación creada', data: nuevo });
    } catch (error) {
      console.error("Error en asignar:", error);
      res.status(500).json({ error: 'Error al asignar grado', detalle: error.message });
    }
  },

  // ✅ Obtener todos los grados asignados
  async listarTodos(req, res) {
    try {
      const asignaciones = await FuncionarioGrado.findAll({
        include: [
          { model: Funcionario, as: 'funcionario', include: [{ model: Persona, as: 'persona' }] },
          { model: Grado, as: 'grado' }
        ]
      });

      res.json(asignaciones);
    } catch (error) {
      console.error("Error en listarTodos:", error);
      res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
  },

  // ✅ Obtener grados de un funcionario
  async gradosPorFuncionario(req, res) {
    try {
      const { id_funcionario } = req.params;

      const resultado = await FuncionarioGrado.findAll({
        where: { id_funcionario },
        include: [{ model: Grado, as: 'grado' }]
      });

      res.json(resultado);
    } catch (error) {
      console.error("Error en gradosPorFuncionario:", error);
      res.status(500).json({ error: 'Error al obtener grados por funcionario' });
    }
  },

  // ✅ Filtrar asignaciones por rol
  async filtrarPorRol(req, res) {
    try {
      const { rol } = req.query;

      if (!rol) return res.status(400).json({ error: 'Debe enviar el rol a buscar' });

      const resultado = await FuncionarioGrado.findAll({
        where: {
          rol: { [Op.like]: `%${rol}%` }
        },
        include: [{ model: Funcionario, as: 'funcionario' }, { model: Grado, as: 'grado' }]
      });

      res.json(resultado);
    } catch (error) {
      console.error("Error en filtrarPorRol:", error);
      res.status(500).json({ error: 'Error al filtrar por rol' });
    }
  },

  // ✅ Contar funcionarios asignados a un grado específico
  async contarPorGrado(req, res) {
    try {
      const { id_grado } = req.query;

      if (!id_grado) return res.status(400).json({ error: 'Debe enviar el id_grado' });

      const total = await FuncionarioGrado.count({
        where: { id_grado }
      });

      res.json({ id_grado, total });
    } catch (error) {
      console.error("Error en contarPorGrado:", error);
      res.status(500).json({ error: 'Error al contar asignaciones' });
    }
  },
  // ✅ Eliminar una asignación por ID
async eliminar(req, res) {
  try {
    const { id } = req.params;

    const eliminados = await FuncionarioGrado.destroy({ where: { id } });

    if (eliminados === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.json({ mensaje: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error('Error en eliminar:', error);
    res.status(500).json({ error: 'Error al eliminar asignación' });
  }
}


};

module.exports = controller;

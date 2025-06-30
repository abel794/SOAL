const db = require('../models');
const { Op } = require('sequelize');

const Funcionario = db.Funcionario;
const Persona = db.Persona;
const Usuario = db.Usuario;
const NivelEscolaridad = db.NivelEscolaridad;
const FuncionarioGrado = db.FuncionarioGrado;
const Grado = db.Grado;

const funcionarioController = {

  // ✅ Obtener todos los funcionarios
  async obtenerTodos(req, res) {
    try {
      const funcionarios = await Funcionario.findAll({
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'username', 'id_tipo_usuario'] },
          { model: NivelEscolaridad, as: 'escolaridad' }
        ]
      });
      res.json(funcionarios);
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      res.status(500).json({ error: 'Error al obtener funcionarios', detalle: error.message });
    }
  },

  // ✅ Obtener funcionario por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const funcionario = await Funcionario.findByPk(id, {
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'username', 'id_tipo_usuario'] },
          { model: NivelEscolaridad, as: 'escolaridad' }
        ]
      });

      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionario no encontrado' });
      }

      res.json(funcionario);
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      res.status(500).json({ error: 'Error al obtener funcionario', detalle: error.message });
    }
  },

  // ✅ Crear nuevo funcionario
  async crear(req, res) {
    try {
      const nuevo = await Funcionario.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear funcionario:', error);
      res.status(400).json({ error: 'Error al crear funcionario', detalle: error.message });
    }
  },

  // ✅ Actualizar funcionario
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Funcionario.update(req.body, {
        where: { id_funcionario: id }
      });

      if (filas === 0) {
        return res.status(404).json({ error: 'Funcionario no encontrado o sin cambios' });
      }

      res.json({ mensaje: 'Funcionario actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar funcionario:', error);
      res.status(400).json({ error: 'Error al actualizar funcionario', detalle: error.message });
    }
  },

  // ✅ Eliminar funcionario
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filas = await Funcionario.destroy({ where: { id_funcionario: id } });

      if (filas === 0) {
        return res.status(404).json({ error: 'Funcionario no encontrado' });
      }

      res.json({ mensaje: 'Funcionario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar funcionario:', error);
      res.status(500).json({ error: 'Error al eliminar funcionario', detalle: error.message });
    }
  },

  // 🔍 Buscar funcionarios por nombre (en la tabla Persona)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: 'Debe enviar el parámetro "nombre"' });
    }

    try {
      const resultados = await Funcionario.findAll({
        include: [
          {
            model: Persona,
            as: 'persona',
            where: {
              [Op.or]: [
                { nombre: { [Op.like]: `%${nombre}%` } },
                { apellido: { [Op.like]: `%${nombre}%` } }
              ]
            }
          },
          { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'username', 'id_tipo_usuario'] }
        ]
      });

      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      }

      res.json({ status: 'correcto', mensaje: 'Consulta exitosa', error: null, data: resultados });
    } catch (error) {
      console.error('Error en buscarPorNombre:', error);
      res.status(500).json({ error: 'Error al buscar funcionarios', detalle: error.message });
    }
  },

  // 📚 Asignar grado a funcionario
  async asignarGrado(req, res) {
    const { id_funcionario, id_grado } = req.body;

    try {
      const funcionario = await Funcionario.findByPk(id_funcionario);
      const grado = await Grado.findByPk(id_grado);

      if (!funcionario || !grado) {
        return res.status(404).json({ error: 'Funcionario o grado no encontrado' });
      }

      await FuncionarioGrado.create({ id_funcionario, id_grado });

      res.status(201).json({ mensaje: 'Grado asignado correctamente' });
    } catch (error) {
      console.error('Error en asignarGrado:', error);
      res.status(500).json({ error: 'Error al asignar el grado', detalle: error.message });
    }
  },

  // 📚 Obtener grados asignados a un funcionario
  // 📚 Obtener grados asignados a un funcionario
async gradosAsignados(req, res) {
  const id_funcionario = req.params.id;
  try {
    const grados = await FuncionarioGrado.findAll({
      where: { id_funcionario },
      include: [
        {
          model: Grado,
          as: 'grado' // 👈 Este alias debe coincidir con el definido en el modelo
        }
      ]
    });
    res.json(grados);
  } catch (error) {
    console.error('Error en gradosAsignados:', error);
    res.status(500).json({ error: 'Error al obtener los grados asignados', detalle: error.message });
  }
},


  // 📊 Contar funcionarios por cargo
  async contarPorCargo(req, res) {
    const { cargo } = req.query;

    if (!cargo) {
      return res.status(400).json({ error: 'Debe proporcionar el cargo' });
    }

    try {
      const total = await Funcionario.count({
        where: { cargo: { [Op.like]: `%${cargo}%` } }
      });

      res.json({ cargo, total });
    } catch (error) {
      console.error('Error al contar por cargo:', error);
      res.status(500).json({ error: 'Error al contar funcionarios', detalle: error.message });
    }
  },

  // 📚 Filtrar funcionarios por nivel de escolaridad
  async filtrarPorEscolaridad(req, res) {
    const { id_escolaridad } = req.query;

    if (!id_escolaridad) {
      return res.status(400).json({ error: 'Debe enviar id_escolaridad' });
    }

    try {
      const resultados = await Funcionario.findAll({
        where: { id_escolaridad },
        include: [
          { model: Persona, as: 'persona' },
          { model: NivelEscolaridad, as: 'escolaridad' }
        ]
      });

      res.json(resultados);
    } catch (error) {
      console.error('Error al filtrar por escolaridad:', error);
      res.status(500).json({ error: 'Error al filtrar funcionarios', detalle: error.message });
    }
  }

};

module.exports = funcionarioController;

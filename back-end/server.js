const express = require('express');
const cors = require('cors');
const app = express();

const estudianteRoutes = require('./routes/estudiante.routes');
const citaRoutes = require('./routes/cita.routes');
const observacionRoutes = require('./routes/observacion.routes');


app.use(cors());
app.use(express.json());

app.use('/api/estudiante', estudianteRoutes); // ✅ Solo una vez
app.use('/api/citas', citaRoutes); // Para que funcione /api/citas/total
app.use('/api', observacionRoutes);// Ahora funciona /api/observaciones/total y /api/observaciones/criticos



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

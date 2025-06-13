const express = require('express')
const cors = require('cors')
const app=express()
const PORT=3001

app.use(cors())
app.use(express.json());

const observacionesRoutes = require('./routes/observaciones');
app.use('/api/observaciones', observacionesRoutes);

app.get('/api/saludo', (req,res) =>{
    res.json({mensaje: 'hola desde el servidor'})
})

app.listen(PORT, ()=>{
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})
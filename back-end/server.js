const express=require('express')
const cors = require ('cors')

const app = require('app')

const PORT =3001

app.use(cors());

app.use(express.json())

app.get('/api/saludo',(req,res) =>{
    res.json({mensaje :'hola desde el servidor'})
})

app.liste(PORT, () =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})
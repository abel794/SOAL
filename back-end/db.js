const mysql=require('mysql2')

const connecion=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'SOAL'
})

connecion.connect(err =>{
    if (err){
        console.error('error al conectar la base de datos',err)
        return
    }
    console.log('coneccion a la base de datos con exito')

})

module.exports=connecion
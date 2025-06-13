import { useEffect,useState } from "react";

function App(){
  const [mensaje,setMensaje]=useState('')
  useEffect(()=>{
    fetch('http://localhost:3001/api/saludo')
    .then(res => res.json())
    .then(data => setMensaje(data.mensaje))
    .catch( err => console.error(err))
  },[]);

  return <h1>{mensaje || 'cargando...'}</h1>;
}


export default App
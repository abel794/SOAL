# README - Proyecto SOAL

## 1. Requisitos previos
- Node.js (v18+)
- MySQL (v8+)
- Git
- Opcional: VSCode

## 2. Clonar el proyecto
cd C:\Users\TuUsuario\Desktop
git clone https://github.com/TuUsuario/SOAL.git
cd SOAL

## 3. Configurar la base de datos
mysql -u root -p
CREATE DATABASE soal_db;
USE soal_db;

# Ejecutar script inicial con usuarios y roles
mysql -u root -p soal_db < C:\Users\TuUsuario\Desktop\SOAL\db\script DB\respaldo-soal-04-11-2025.sql

# El script ya incluye:
# - Tabla Usuario
# - Tabla Rol
# - Todos los usuarios de prueba con sus roles y contraseñas
# No es necesario insertar usuarios manualmente después.

## 4. Configurar variables de entorno
# En back-end
cd back-end
# Crear .env con:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TuContraseña
DB_NAME=soal_db
PORT=3000
JWT_SECRET=tu_clave_secreta_aqui

## 5. Instalar dependencias backend
npm install

## 6. Levantar backend
node server.js

## 7. Configurar frontend
cd ../frontend
npm install
# Configurar URL backend en .env o config.js
VITE_API_URL=http://localhost:3000

## 8. Levantar frontend
npm run dev
# Abrir navegador en http://localhost:5173/

## 9. Probar rápidamente
# Ya vienen usuarios y roles cargados desde el script:
# Puedes iniciar sesión con alguno de estos:
# Coordinador: abelmoreno / 1234567890
# Estudiante: est111111 / 111111
# Acudiente: acu222222 / 222222
# Profesor: asnedo123 / 33333333
# Administrativo: brajan / 333333

## 10. Atajos útiles
# Reiniciar backend: Ctrl+C + node server.js
# Reiniciar frontend: Ctrl+C + npm run dev
# Consultar tablas:
mysql -u root -p
USE soal_db;
SELECT * FROM Usuario;

## 11. Estructura del proyecto
SOAL/
│
├─ back-end/
├─ frontend/
└─ db/

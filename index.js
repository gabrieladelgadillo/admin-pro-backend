require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use( express.json() );

//Base de Datos
dbConnection();

//Directorio público
app.use( express.static('public') );

//console.log( process.env );

//Rutas
app.use('/api/hospitales', require('./routes/hospitales_route.js'));
app.use('/api/medicos', require('./routes/medicos_route.js'));
app.use('/api/todo', require('./routes/busquedas_route.js'));
app.use('/api/uploads', require('./routes/uploads_route.js'));
app.use('/api/usuarios', require('./routes/usuarios_route.js'));
app.use('/api/login', require('./routes/auth_route.js'));

app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
} )
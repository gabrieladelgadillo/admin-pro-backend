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

//console.log( process.env );

//Rutas
app.use('/api/usuarios', require('./routes/usuarios_route.js'));
app.use('/api/login', require('./routes/auth_route.js'));

app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
} )
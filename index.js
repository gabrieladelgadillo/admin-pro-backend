require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Base de Datos
dbConnection();

console.log( process.env );
//TIyDv18RaRsIAIiY
//mean_user
//Rutas
app.get( '/', (request, response) => { 
    response.json({
        ok: true,
        msg: 'Hola Mundo'
    })
} );

app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
} )
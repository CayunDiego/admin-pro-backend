require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Creamos el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//database
dbConnection();

//Rutas
app.get( '/', (req, res) => {
    res.json({
        ok: true, 
        msj: 'hola mundo'
    });
});

app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})

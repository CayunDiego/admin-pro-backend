require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Creamos el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

// //Lectura y parseo del body
app.use( express.json() )

//database
dbConnection();

//Directorio público
app.use( express.static('public') );

//Rutas
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/hospitals', require('./routes/hospitals.routes'));
app.use('/api/doctors', require('./routes/doctors.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/all', require('./routes/search.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

//Lo último
app.get('*', (req,res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html') );
});




app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})

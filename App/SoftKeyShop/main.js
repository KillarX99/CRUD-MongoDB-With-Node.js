// Imports
require("dotenv").config(); // Configura las variables de entorno desde un archivo .env
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000; // Utiliza el puerto definido en las variables de entorno o el puerto 4000 por defecto

// Conexión a la base de datos
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Manejo de eventos de la base de datos
db.on('error', (error) => console.error('Error de conexión a la base de datos:', error));
db.once('open', () => console.log('Conexión exitosa a la base de datos.'));

// Middlewares
app.use(express.urlencoded({ extended: false })); // Middleware para manejar datos de formulario
app.use(express.json()); // Middleware para manejar datos JSON
app.use(express.static('uploads')); // Middleware para servir archivos estáticos desde el directorio 'uploads'

// Configuración de sesiones
app.use(session({
    secret: '666', // Clave secreta para firmar la cookie de sesión
    saveUninitialized: true,
    resave: false,
}));

// Middleware para manejar mensajes de sesión
app.use((req, res, next) => {
    res.locals.message = req.session.message; // Establece la variable local 'message' para mensajes de sesión
    delete req.session.message; // Borra el mensaje de la sesión después de asignarlo a 'res.locals.message'
    next();
});

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");

// Prefijo de ruta para las rutas del proyecto
app.use("", require("./routes/routes"));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});

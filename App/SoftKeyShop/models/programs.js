// Importa la biblioteca mongoose, que se utiliza para interactuar con MongoDB desde Node.js
const mongoose = require('mongoose');

// Define un esquema para los documentos de la colección "Program" en MongoDB
const programSchema = new mongoose.Schema({
    // Campo "name" de tipo String, obligatorio (required)
    name: {
        type: String,
        required: true,
    },
    // Campo "description" de tipo String, obligatorio (required)
    description: {
        type: String,
        required: true,
    },
    // Campo "price" de tipo String, obligatorio (required)
    price: {
        type: String,
        required: true,
    },
    // Campo "image" de tipo String, obligatorio (required)
    image: {
        type: String,
        required: true,
    },
    // Campo "created" de tipo Date, obligatorio (required) con un valor por defecto de la fecha actual
    created: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

// Exporta el modelo de mongoose creado a partir del esquema, con el nombre 'Program'
module.exports = mongoose.model('Program', programSchema);

// Importa la biblioteca express para la creación de rutas
const express = require("express");
const router = express.Router();

// Importa el modelo de mongoose creado para los programas
const Program = require('../models/programs');

// Importa las bibliotecas multer y fs para el manejo de archivos y sistema de archivos, respectivamente
const multer = require('multer');
const fs = require("fs");

// Configura multer para el almacenamiento de imágenes
var storage = multer.diskStorage({
    destination: function (req, title, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

// Ruta para insertar un programa en la base de datos
router.post('/agregar', upload, async (req, res) => {
    try {
        // Crea una nueva instancia del modelo Program con los datos recibidos
        const program = new Program({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file.filename,
        });

        // Guarda el programa en la base de datos
        await program.save();

        // Configura un mensaje de éxito y redirige a la página principal
        req.session.message = {
            type: 'success',
            message: 'Programa agregado de forma exitosa.',
        };
        res.redirect('/');
    } catch (err) {
        // Maneja los errores y muestra un mensaje de error en formato JSON
        res.json({ message: err.message, type: 'danger' });
    }
});

// Ruta para obtener todos los programas de la base de datos
router.get("/", async (req, res) => {
    try {
        // Obtiene todos los programas y renderiza la página principal con los datos
        const programs = await Program.find().exec();
        res.render('index', {
            title: 'Base de datos',
            programs: programs,
        });
    } catch (err) {
        // Maneja los errores y muestra un mensaje de error en formato JSON
        res.json({ message: err.message });
    }
});

// Ruta para editar un programa
router.get("/edit/:id", async (req, res) => {
    try {
        // Obtiene el ID de la URL y busca el programa correspondiente en la base de datos
        let id = req.params.id;
        const program = await Program.findById(id);

        // Si el programa no existe, redirige a la página principal
        if (!program) {
            return res.redirect('/');
        }

        // Renderiza la página de edición con los datos del programa
        res.render("edit_programs", {
            title: "Editar Programas",
            program: program,
        });
    } catch (err) {
        // Maneja los errores y redirige a la página principal
        console.error(err);
        res.redirect('/');
    }
});

// Ruta para actualizar un programa
router.post('/actualizar/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    // Verifica si se cargó una nueva imagen y actualiza la variable correspondiente
    if (req.file) {
        new_image = req.file.filename;
        // Intenta eliminar la imagen anterior del sistema de archivos
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        // Actualiza el programa en la base de datos con los nuevos datos
        const result = await Program.findByIdAndUpdate(id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: new_image,
        }).exec();

        // Configura un mensaje de éxito y redirige a la página principal
        req.session.message = {
            type: 'success',
            message: 'Programa actualizado correctamente.',
        };
        res.redirect('/');
    } catch (err) {
        // Maneja los errores y muestra un mensaje de error en formato JSON
        res.json({ message: err.message, type: 'danger' });
    }
});

// Ruta para eliminar un programa
router.get('/delete/:id', async (req, res) => {
    try {
        // Obtiene el ID de la URL y elimina el programa correspondiente de la base de datos
        const id = req.params.id;
        const result = await Program.findByIdAndDelete(id);

        // Si se eliminó con éxito, intenta eliminar la imagen del sistema de archivos
        if (result && result.image !== '') {
            try {
                await fs.unlink(`./uploads/${result.image}`);
            } catch (err) {
                console.error(err);
            }
        }

        // Configura un mensaje de información y redirige a la página principal
        req.session.message = {
            type: 'info',
            message: 'Se eliminó satisfactoriamente',
        };
        res.redirect('/');
    } catch (err) {
        // Maneja los errores y muestra un mensaje de error en formato JSON
        res.json({ message: err.message });
    }
});

// Rutas para renderizar páginas adicionales
router.get("/agregar", (req, res) => {
    res.render('add_programs', { title: 'Agregar Programa' });
});

router.get("/info", (req, res) => {
    res.render('about', { title: 'Acerca de nosotros' });
});

// Exporta las rutas configuradas
module.exports = router;

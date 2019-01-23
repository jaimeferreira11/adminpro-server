var express = require('express');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// inicializar variables
var app = express();

const path = require('path');
const fs = require('fs');
// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;




    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida ',
            errors: { message: 'las colecciones validos son: ' + tiposValidos.join(', ') }
        });

    }


    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }



});

module.exports = app;
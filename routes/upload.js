var express = require('express');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


var fileUpload = require('express-fileupload');
var fs = require('fs');


// inicializar variables
var app = express();

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida ',
            errors: { message: 'las colecciones validos son: ' + tiposValidos.join(', ') }
        });

    }


    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Error subiendo imagen ',
            errors: err
        });
    }

    // obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1]

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida ',
            errors: { message: 'las extensiones validos son: ' + extensionesValidas.join(', ') }
        });

    }

    // Nombre de archivo generalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover imagen ',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res)

        /*   */


    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {


            if (!usuario) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontro el usuario ',
                    errors: { message: 'El usuairo no existe' }
                });


            }

            var pathAnterior = './uploads/usuarios/' + usuario.img;

            // si existe, elimina la imagen anterior
            if (fs.existsSync(pathAnterior)) {
                fs.unlinkSync(pathAnterior);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {


                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usaurio actualizada',
                    usuario: usuarioActualizado
                });


            });



        })

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontro el medico ',
                    errors: { message: 'El medico no existe' }
                });


            }

            var pathAnterior = './uploads/medicos/' + medico.img;

            // si existe, elimina la imagen anterior
            if (fs.existsSync(pathAnterior)) {
                fs.unlinkSync(pathAnterior);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });


            });



        })

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {


            if (!hospital) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontro el hospital ',
                    errors: { message: 'El hospital no existe' }
                });


            }

            var pathAnterior = './uploads/hospitales/' + hospital.img;

            // si existe, elimina la imagen anterior
            if (fs.existsSync(pathAnterior)) {
                fs.unlinkSync(pathAnterior);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });


            });



        })

    }

}

module.exports = app;
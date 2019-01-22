var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// inicializar variables
var app = express();


var Usuario = require('../models/usuario');

// =======================================
// Login
// =======================================

app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario ',
                errors: err
            });
        }


        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: { message: 'Credenciales incorrectas - email' }
            });
        }



        if (!bcrypt.compareSync(body.password, usuario.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: { message: 'Credenciales incorrectas - password' }
            });
        }

        // Crear un token
        usuario.password = ':)'
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }) // 4horas


        res.status(200).json({
            ok: true,
            mensaje: 'Login Correcto',
            token: token,
            usuario: usuario,
            id: usuario._id
        });


    });


});







module.exports = app;
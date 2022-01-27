const { response } = require('express');
const encrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(request, res = response) => {

    const { email, password } = request.body;
    try{

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario.'
            });
        }

        // Verificar password
        const validaPassword = encrypt.compareSync(password, usuarioDB.password)

        if (!validaPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida.'
            });
        }

        //Generar el TOKEN -JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
}

module.exports = { login }
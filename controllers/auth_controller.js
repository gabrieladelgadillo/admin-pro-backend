const { response } = require('express');
const encrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');

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

const googleSignIn = async( request, res = response) => {

    const googleToken = request.body.token;

    try {

        const {name, email, picture} = await googleVerify( googleToken );

        //Verificar si existe el usuario con email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            //Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en BD
        await usuario.save();

        //Generar el TOKEN -JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            token
        })
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg:'El token no es correcto.'
        })
    }
}

module.exports = { login, googleSignIn }
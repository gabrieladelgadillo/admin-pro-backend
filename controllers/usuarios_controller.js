const { response } = require('express');
const encrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(request, res = response) => { 

    try {
        const desde = Number(request.query.desde) || 0;

        const [ usuarios, total ] = await Promise.all([
            Usuario.find({}, 'nombre email role google img')
                    .skip( desde )
                    .limit( 5 ),
            Usuario.count()
        ])

        res.json({
            ok: true,
            usuarios,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
    
}

const createUsuario = async(request, res = response) => { 

    const { email, password } = request.body;

    try {

        const existEmail = await Usuario.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

        const usuario = new Usuario(request.body);

        // Encriptar contraseña
        const salt = encrypt.genSaltSync();
        usuario.password = encrypt.hashSync(password, salt);

        //Guardar Usuario
        await usuario.save();

        //Generar el TOKEN -JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
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

const updateUsuarios = async(request, res = response) => {

    //TODO: Validar token y comprobar si es el usuario correcto
    const uid = request.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id.'
            });
        }

        const { password, google, email, ...campos} = request.body;
        
        if (usuarioDB.email != email ){
            const existEmail = await Usuario.findOne({ email });
        
            if(existEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email.'
                });
            }
        }

        //Actualización
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })

    }
}

const deleteUsuario = async(request, res = response) => { 

    const uid = request.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id.'
            });
        }

        //Eliminar Usuario
        await Usuario.findByIdAndDelete(uid);
    
        res.json({
            ok: true,
            msg: 'Usuario '+ usuarioDB.nombre + ' eliminado.'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
}

module.exports = { getUsuarios, createUsuario, updateUsuarios, deleteUsuario }
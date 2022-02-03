const { response } = require('express');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async(request, res = response) => { 

    try {
        const desde = Number(request.query.desde) || 0;

        const [ medicos, total ] = await Promise.all([
            Medico.find()
                    .populate('usuario', 'nombre img')
                    .populate('hospital', 'nombre img')
                    .skip( desde )
                    .limit( 5 ),
            Medico.count()
        ])                        

        res.json({
            ok: true,
            medicos,
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

const createMedico = async(request, res = response) => { 

    const uidUsuario = request.uid;
    const medico = new Medico({
        usuario:uidUsuario,
        ...request.body
    });

    try {

        //Guardar Medico
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
}

const updateMedico = async(request, res = response) => {

    // const uid = request.params.id;

    try {

        // const usuarioDB = await Usuario.findById(uid);

        // if (!usuarioDB) {
        //     return res.status(404).json({
        //         ok: false,
        //         msg: 'No existe usuario con ese id.'
        //     });
        // }

        res.json({
            ok: true,
            msg: 'Se actualizó médico.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })

    }
}

const deleteMedico = async(request, res = response) => { 
    res.json({
        ok: true,
        msg: 'Se eliminó médico.'
    });
}

module.exports = { getMedicos, createMedico, updateMedico, deleteMedico }
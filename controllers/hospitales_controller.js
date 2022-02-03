const { response } = require('express');
const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async(request, res = response) => { 

    try {
        const desde = Number(request.query.desde) || 0;

        const [ hospitales, total ] = await Promise.all([
            Hospital.find()
                    .populate('usuario', 'nombre img')
                    .skip( desde )
                    .limit( 5 ),
            Hospital.count()
        ])                                    

        res.json({
            ok: true,
            hospitales,
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

const createHospital = async(request, res = response) => { 

    const uidUsuario = request.uid;
    const hospital = new Hospital({
        usuario:uidUsuario,
        ...request.body
    });

    try {

        //Guardar Hospital
        const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
}

const updateHospital = async(request, res = response) => {

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
            msg: 'Se actualizó hospital.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })

    }
}

const deleteHospital = async(request, res = response) => { 
    res.json({
        ok: true,
        msg: 'Se eliminó hospital.'
    });
}

module.exports = { getHospitales, createHospital, updateHospital, deleteHospital }
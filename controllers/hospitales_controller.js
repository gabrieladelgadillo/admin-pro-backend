const { response } = require('express');
const Hospital = require('../models/hospital');

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

    const id = request.params.id;
    const uid = request.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id.'
            });
        }

        //hospitalDB.nombre = request.body.nombre;
        const cambiosHospital = {
            ...request.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
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
    
    const id = request.params.id;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id.'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Hospital eliminado."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })

    }
}

module.exports = { getHospitales, createHospital, updateHospital, deleteHospital }
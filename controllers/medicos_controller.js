const { response } = require('express');
const Medico = require('../models/medico');

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

    const id = request.params.id;
    const uid = request.uid;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado por id.'
            });
        }

        const cambiosMedico = {
            ...request.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
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
    
    const id = request.params.id;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado por id.'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Médico eliminado."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })

    }
}

module.exports = { getMedicos, createMedico, updateMedico, deleteMedico }
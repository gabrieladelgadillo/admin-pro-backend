const { response } = require('express');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

const getBusquedaTodo = async(request, res = response) => { 

    try {
        const desde = Number(request.query.desde) || 0;
        const busqueda = request.params.busqueda;
        const regex = new RegExp( busqueda, 'i');

        const [ usuarios, hospital, medicos ] = await Promise.all([
            Usuario.find({ nombre: regex })
                    .skip( desde )
                    .limit( 5 ),
            Hospital.find({ nombre: regex })
                    .skip( desde )
                    .limit( 5 ),
            Medico.find({ nombre: regex })
                    .skip( desde )
                    .limit( 5 ),
        ])

        res.json({
            ok: true,
            usuarios,
            hospital,
            medicos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
    
}

const getColeccion = async(request, res = response) => { 

    try {
        const desde = Number(request.query.desde) || 0;
        const tabla = request.params.tabla;
        const busqueda = request.params.busqueda;
        const regex = new RegExp( busqueda, 'i');

        let data = [];
        switch ( tabla ) {
            case 'usuarios':
                
                data = await Usuario.find({ nombre: regex })
                                .skip( desde )
                                .limit( 5 )
                break;
            case 'medicos':

                data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
                                .skip( desde )
                                .limit( 5 )
                break;
            case 'hospitales':
                
                data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .skip( desde )
                                .limit( 5 )
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La colección debe ser usarios/medicos/hospitales.'
                })
        }
        
        res.json({
            ok: true,
            resultado: data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
    
}

module.exports = { getBusquedaTodo, getColeccion }
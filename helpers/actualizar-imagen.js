const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (tipo, nombreArchivo) => {
    const pathViejo = `./uploads/${ tipo }/${ nombreArchivo }`;
    if (fs.existsSync( pathViejo )) {
        //Borrar imagen anterior
        fs.unlinkSync(pathViejo);
    }
}

const actualizarImagen = async(tabla, id, nombreArchivo) => {

    switch( tabla ) {
        case 'medicos':
            const medico = await Medico.findById(id);

            if (!medico) {
                return false;
            }

            borrarImagen(tabla, medico.img);

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                return false;
            }

            borrarImagen(tabla, hospital.img);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return false;
            }

            borrarImagen(tabla, usuario.img);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
    }
}

module.exports = { actualizarImagen }
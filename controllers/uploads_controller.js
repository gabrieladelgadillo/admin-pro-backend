const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async(request, res = response) => { 

    try {
        const tabla = request.params.tabla;
        const id = request.params.id;
        const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

        //Validar el tipo de tabla a actualizar
        if (!tiposValidos.includes(tabla)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo no es médico, usuario ni hopital.'
            });
        }

        //Validar que existe un archivo
        if (!request.files || Object.keys(request.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay ningún archivo.'
            });
        }

        //Processar la imagen...
        const file = request.files.imagen;

        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length -1];

        //Validar extensión
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            return res.status(400).json({
                ok: false,
                msg: 'El archivo tiene una extensión no permitada.'
            });
        }

        //Generar el nombre del archivo
        const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

        //Path para guardar la imagen
        const uploadPath = `./uploads/${ tabla }/${ nombreArchivo }`;
        
        // Use the mv() method to place the file somewhere on your server (Mover la imagen)
        file.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen.'
                });
            }

            //Actualizar base de datos
            actualizarImagen(tabla, id, nombreArchivo);

            res.json({
                ok: true,
                msg: 'Archivo subido', nombreArchivo
            })

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
    
}

const retornaImagen = async(request, res = response) => { 

    try {
        const tabla = request.params.tabla;
        const foto = request.params.foto;
        const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

        //Validar el tipo de tabla a actualizar
        if (!tiposValidos.includes(tabla)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo no es médico, usuario ni hopital.'
            });
        }

        const pathImg = path.join(__dirname, `../uploads/${ tabla }/${ foto }`);

        if (fs.existsSync(pathImg)) {
            res.sendFile(pathImg);
        } else {
            const noPathImg = path.join(__dirname, `../uploads/no-img.jpg`);
            res.sendFile(noPathImg);
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado... revisar logs.'
        })
    }
    
}

module.exports = { fileUpload, retornaImagen }
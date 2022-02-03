const { Schema, model } = require('mongoose');
const Hospial = require('./hospital');
const Usuario = require('./usuario');

const MedicoSchema = Schema({

    nombre: {
        type: String,
        requiered: true
    },
    img: {
        type: String
    },
    usuario: {
        requiered: true,
        type: Schema.Types.ObjectId,
        ref: Usuario,
    },
    hospital: {
        requiered: true,
        type: Schema.Types.ObjectId,
        ref: Hospial,
    },
});

MedicoSchema.method('toJSON', function() {
    
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Medico', MedicoSchema);
const { Schema, model } = require('mongoose');
const Usuario = require('./usuario');

const HospitalSchema = Schema({

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
}, {collection: 'hospitales' });

HospitalSchema.method('toJSON', function() {
    
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);
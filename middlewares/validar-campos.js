const { response } = require('express');
const {validationResult } = require('express-validator');

const validarCampos = ( request, res = response, next) => {

    const errores = validationResult(request);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports = { validarCampos }
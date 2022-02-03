/*
    Ruta: /api/hospitales
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');
const { getHospitales, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitales_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', getHospitales);
router.post( '/', [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio.').notEmpty(),
        validarCampos
    ], createHospital);
router.put( '/:id', [], updateHospital);
router.delete( '/:id', deleteHospital);

module.exports = router;
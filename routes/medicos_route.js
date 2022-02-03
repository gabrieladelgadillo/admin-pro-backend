/*
    Ruta: /api/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');
const { getMedicos, createMedico, updateMedico, deleteMedico } = require('../controllers/medicos_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', getMedicos);
router.post( '/', [
        validarJWT,
        check('nombre', 'El nombre del médico es obligatorio.').notEmpty(),
        check('hospital', 'El hospital debe ser válido.').isMongoId(),
        validarCampos
    ], createMedico);
router.put( '/:id', [], updateMedico);
router.delete( '/:id', deleteMedico);

module.exports = router;
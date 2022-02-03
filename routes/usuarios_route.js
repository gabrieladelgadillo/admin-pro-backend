/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');
const { getUsuarios, createUsuario, updateUsuarios, deleteUsuario } = require('../controllers/usuarios_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT, getUsuarios);
router.post( '/', [
        check('nombre', 'El nombre es obligatorio.').notEmpty(),
        check('password', 'El password es obligatorio.').notEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        validarCampos,
    ], createUsuario);
router.put( '/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio.').notEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        check('role', 'El rol es obligatorio.').notEmpty(),
        validarCampos,
    ], updateUsuarios);
    router.delete( '/:id', validarJWT, deleteUsuario);
    
module.exports = router;
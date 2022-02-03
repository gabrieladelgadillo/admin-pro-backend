/*
    Ruta: /api/todo/
*/
const { Router } = require('express');
const { getBusquedaTodo, getColeccion } = require('../controllers/busquedas_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/:busqueda', validarJWT, getBusquedaTodo);
router.get( '/coleccion/:tabla/:busqueda', validarJWT, getColeccion);

module.exports = router;
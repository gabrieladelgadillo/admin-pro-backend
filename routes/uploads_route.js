/*
    Ruta: /api/uploads/
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { append } = require('express/lib/response');
const { fileUpload, retornaImagen } = require('../controllers/uploads_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload());
router.put( '/:tabla/:id', validarJWT, fileUpload);
router.get( '/:tabla/:foto', retornaImagen);

module.exports = router;
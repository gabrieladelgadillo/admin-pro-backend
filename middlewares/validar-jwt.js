const jwt = require('jsonwebtoken');
const validarJWT = (request, res, next) => {

    //Leer el token
    const token = request.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición.'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        request.uid = uid;
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido.'
        });
    }

}

module.exports = { validarJWT }
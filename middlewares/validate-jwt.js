const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
  //leer el TOKEN
  const token = req.header('x-token');
  if ( !token ) {
    return res.status(401).json({
      ok: false,
      msj: 'No hay token en la petición'
    });
  } 

  try {
    const { uid } = jwt.verify( token, process.env.JWT_SECRET );
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msj: 'Token no válido'
    });
  }
}

module.exports = {
  validateJWT
}
const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const validateJWT = ( req, res = response, next ) => {
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

const validateADMIN_ROLE = async ( req, res = response, next ) => {
  const uid = req.uid;
  try {
    const userDB = await User.findById( uid );
    if ( !userDB ) {
      return res.status(404).json({
        ok: false,
        msj: 'Usuario no existe'
      });
    }
    if ( userDB.role !== 'ADMIN_ROLE' ) {
      return res.status(403).json({
        ok: false,
        msj: 'No tiene previlegios'
      });
    }
    next();
  } catch (error) {
    console.log( error );
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador'
    });
  }
}

const validateADMIN_ROLE_or_SameUser = async ( req, res = response, next ) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const userDB = await User.findById( uid );
    if ( !userDB ) {
      return res.status(404).json({
        ok: false,
        msj: 'Usuario no existe'
      });
    }
    if ( userDB.role === 'ADMIN_ROLE' || uid === id ) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msj: 'No tiene previlegios'
      });
    }
  } catch (error) {
    console.log( error );
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador'
    });
  }
}

module.exports = {
  validateJWT,
  validateADMIN_ROLE,
  validateADMIN_ROLE_or_SameUser
}
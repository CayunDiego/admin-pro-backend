const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/jwt');
const User = require('../models/user.model');

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //Verificar email
    const userDB = await User.findOne({ email });
    
    //En el msj, no deberíamos dar pistas si la contraseña o el email
    //no son válidos.
    //Lo ideal sería poner: email o contraseña inválido 
    if ( !userDB ) {
      return res.status(404).json({
        ok: false,
        mes: 'Email no válida'
      });
    }

    //Verificar contraseña
    const validPassword = bcrypt.compareSync( password, userDB.password );
    if ( !validPassword ) {
      return res.status(400).json({
        ok: false,
        msj: 'Contraseña no válida'
      });
    }

    //Generar el TOKEN - JWT
    const token = await generateJWT( userDB.id );

    res.status(200).json({
      ok: true,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador'
    });
  }
}

module.exports = {
  login
}
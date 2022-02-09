const bcrypt = require('bcryptjs');
const { response } = require('express');
const { googleVerify } = require('../helpers/googleVerify');
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

const googleSignIn = async ( req, res = response ) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify( googleToken );

    //Verificar que el usuario existe
    const userDB = await User.findOne({ email });
    let user;

    if ( !userDB ) {
      //Si no existe el usuario
      user = new User({
        name,
        email,
        password: '@@@',
        img: picture,
        google: true
      });
    } else {
      //Existe usuario
      user = userDB;
      user.google = true;
    }

    //Guardar en DB
    await user.save();

    //Generar el TOKEN - JWT
    const token = await generateJWT( userDB.id )

    res.json({
      ok: true,
      token
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msj: 'Token no válido.'
    });
  }
}

const renewToken = async ( req, res = response ) => {
  const uid = req.uid;

  //Generar el TOKEN - JWT
  const token = await generateJWT( uid )

  res.json({
    ok: true,
    token
  });
}

module.exports = {
  login,
  googleSignIn,
  renewToken
}

const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {
  const users = await User.find({}, 'name email role google');

  res.json({
    ok: true, 
    users,
    uid: req.uid
  });
}

//Crear Usuario
const postUsers = async (req, res = response) => {
  const { password, email } = req.body;
  
  try {
    const isEmail = await User.findOne({ email });
    if ( isEmail ) {
      return res.status(400).json({
        ok: false,
        msj: 'El correo ya está registrado'
      });
    }
    const user = new User( req.body );

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    //guardar usuario
    await user.save();

    //Generar el TOKEN - JWT
    const token = await generateJWT( user.id );

    res.json({
      ok: true, 
      user,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Erros inesperado... revisar logs'
    });
  }
}

const putUsers = async (req, res = response) => {
  //TODO: validar token y comprobar si es el usuario correcto
  
  const uid = req.params.id;
  try {
    const userDB = await User.findById( uid );
    if ( !userDB ) {
      return res.status(404).json({
        ok: false,
        msj: 'No existe un usuario con ese id'
      });
    }

    // Actualización
    const { password, google, email, ...fields } = req.body;

    if ( userDB.email !== email ) {
      const isEmail = await User.findOne({ email });
      if ( isEmail ) {
        return res.status(404).json({
          ok: false,
          msj: 'Ya existe un usuario con ese email'
        });
      }
    }
    fields.email = email;
    //Si no ponemos new: true, nos traerá el usuario como estaba antes de actualizar
    const updatedUser = await User.findByIdAndUpdate( uid, fields, { new: true } );

    res.json({
      ok: true,
      user: updatedUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msj: 'Error inesperado'
    });
  }
}

const deleteUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const userDB = await User.findById( uid );
    if ( !userDB ) {
      return res.status(404).json({
        ok: false,
        msj: 'No existe un usuario con ese id'
      });
    }
    //Actualmente ya no se usa esta forma de borrar un usuario
    //Se debería desactivar nomas.
    await User.findByIdAndDelete( uid );
    res.status(200).json({
      ok: true,
      msj: 'Usuario eliminado'
    });
  } catch (error) {
    console.log( error );
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador.'
    });
  }
  
}

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUser
}
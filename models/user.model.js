const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    require: true,

  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    require: true,
    default: 'USER_ROLE',
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//Esto es para fines viasuales, no afecta a la DB
//Cambiamos el nombre del _id que nos va a entregar para visualizar
UserSchema.method('toJSON', function() {
  const { __v, _id, password,...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model( 'User', UserSchema );
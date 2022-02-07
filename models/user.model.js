const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
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
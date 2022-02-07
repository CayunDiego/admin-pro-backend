const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

//Esto es para fines viasuales, no afecta a la DB
//Cambiamos el nombre del _id que nos va a entregar para visualizar
HospitalSchema.method('toJSON', function() {
  const { __v,...object } = this.toObject();
  return object;
});

module.exports = model( 'Hospital', HospitalSchema );
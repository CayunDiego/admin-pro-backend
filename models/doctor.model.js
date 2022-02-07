const { Schema, model } = require('mongoose');

const DoctorSchema = Schema({
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
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  }
});

//Esto es para fines viasuales, no afecta a la DB
//Cambiamos el nombre del _id que nos va a entregar para visualizar
DoctorSchema.method('toJSON', function() {
  const { __v, _id,...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model( 'Doctor', DoctorSchema );
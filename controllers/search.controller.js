const { response } = require('express');
const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

const getSearch = async (req, res = response) => {
  const search = req.params.search;
  const regex = new RegExp( search, 'i' );

  //Tarda mucho hasta resolver cada una de las promesas
  // const users     = await User.find({ name: regex });
  // const hospitals = await Hospital.find({ name: regex });
  // const doctors   = await Doctor.find({ name: regex });

  //Se resuelven en paralelo
  const [ users, hospitals, doctors ] = await Promise.all([
    User.find({ name: regex }),
    Hospital.find({ name: regex }),
    Doctor.find({ name: regex })
  ]);

  res.json({
    ok: true,
    users,
    hospitals,
    doctors
  });
}

const getDocumentsCollection = async (req, res = response) => {
  const collection = req.params.table;
  const search = req.params.search;
  const regex = new RegExp( search, 'i' );
  let data = [];

  switch ( collection ) {
    case 'users':
      data = await User.find({ name: regex });
      break;
    case 'hospitals':
      data = await Hospital.find({ name: regex })
                           .populate('user', 'name img');
      break;
    case 'doctors':
      data = await Doctor.find({ name: regex })
                         .populate('user', 'name img')
                         .populate('hospital', 'name img');                
      break;
    default:
      return  res.status(400).json({
                ok: false,
                msj: 'La tabla tiene que ser users - hospitals - doctors'
              });
      break;
  }

  res.json({
    ok: true,
    result: data
  });
}

module.exports = {
  getSearch,
  getDocumentsCollection
}
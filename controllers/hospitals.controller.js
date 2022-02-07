const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find()
                                  .populate('user', 'name img')
  res.json({
    ok: true,
    hospitals
  });
}

const posHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({
    user: uid,
    ...req.body
  });

  try {
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador'
    });
  }
}

const putHospital = (req, res = response) => {
  res.json({
    ok: true,
    msj: 'putHospital'
  });
}

const deleteHospital = (req, res = response) => {
  res.json({
    ok: true,
    msj: 'deleteHospital'
  });
}

module.exports = {
  getHospitals,
  posHospital,
  putHospital,
  deleteHospital
}
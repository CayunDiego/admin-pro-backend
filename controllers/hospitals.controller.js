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

const putHospital = async (req, res = response) => {
  const hospitalId = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDb = await Hospital.findById( hospitalId );

    if ( !hospitalDb ) {
      return  res.status(404).json({
                ok: false,
                msj: 'Hospital no encontrado por id.'
              });
    }

    const changesHospital = {
      ...req.body,
      user: uid
    }
    
    const updatedHospital = await Hospital.findByIdAndUpdate( hospitalId, changesHospital, { new: true } );

    res.json({
      ok: true,
      hospital: updatedHospital
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: true,
      msj: 'Hable con el administrador.'
    });
  }
}

const deleteHospital = async (req, res = response) => {
  const hospitalId = req.params.id;

  try {
    const hospitalDb = await Hospital.findById( hospitalId );

    if ( !hospitalDb ) {
      return  res.status(404).json({
                ok: false,
                msj: 'Hospital no encontrado por id.'
              });
    }

    await Hospital.findByIdAndDelete( hospitalId );

    res.json({
      ok: true,
      msj: 'Hospital Eliminado.'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: true,
      msj: 'Hable con el administrador.'
    });
  }
}

module.exports = {
  getHospitals,
  posHospital,
  putHospital,
  deleteHospital
}
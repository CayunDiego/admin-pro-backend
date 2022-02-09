const { response } = require('express');
const Doctor = require('../models/doctor.model');


const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
                              .populate('user', 'name img')
                              .populate('hospital', 'name img')
  res.json({
    ok: true,
    doctors
  });
}

const posDoctor = async (req, res = response) => {
  const uid = req.uid;
  const doctor = new Doctor({
    user: uid,
    ...req.body
  });

  try {
    const doctorDB = await doctor.save();

    res.json({
      ok: true,
      doctor: doctorDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador'
    });
  }
  
}

const putDoctor = async (req, res = response) => {
  const doctorlId = req.params.id;
  const uid = req.uid;

  try {
    const doctor = await Doctor.findById( doctorlId );

    if ( !doctor ) {
      return  res.status(404).json({
        ok: false,
        msj: 'Doctor no encontrado por id.'
      });
    }

    const changesDoctor = {
      ...req.body,
      user: uid
    }
    
    const updatedDoctor = await Doctor.findByIdAndUpdate( doctorlId, changesDoctor, { new: true } );

    res.json({
      ok: true,
      doctor: updatedDoctor
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msj: 'Hable con el administrador'
    });
  }


  
}

const deleteDoctor = async (req, res = response) => {
  const doctorlId = req.params.id;

  try {
    const doctorDb = await Doctor.findById( doctorlId );

    if ( !doctorDb ) {
      return  res.status(404).json({
                ok: false,
                msj: 'Doctor no encontrado por id.'
              });
    }

    await Doctor.findByIdAndDelete( doctorlId );

    res.json({
      ok: true,
      msj: 'Doctor Eliminado.'
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
  getDoctors,
  posDoctor,
  putDoctor,
  deleteDoctor
}
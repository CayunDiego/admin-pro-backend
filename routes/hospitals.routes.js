/*
    Routes: /api/hospitals 
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middlewares');
const { 
  getHospitals,
  posHospital,
  putHospital,
  deleteHospital } = require('../controllers/hospitals.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get( '/', getHospitals );

router.post( '/', 
  [
    validateJWT,
    check('name', 'El nombre del hospital es necesario').not().isEmpty(),
    validateFields
  ],
  posHospital );

router.put( '/:id', 
  [
    validateJWT,
    check('name', 'El nombre del hospital es necesario').not().isEmpty(),
    validateFields
  ],
  putHospital );

router.delete( '/:id', validateJWT, deleteHospital );

module.exports = router;
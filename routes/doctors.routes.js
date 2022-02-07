/*
    Routes: /api/doctors 
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middlewares');
const { 
  getDoctors,
  posDoctor,
  putDoctor,
  deleteDoctor } = require('../controllers/doctors.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get( '/', getDoctors );

router.post( '/', 
  [
    validateJWT,
    check('name', 'El nombre del Doctor es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital id debe ser válido').isMongoId(),
    validateFields
  ],
  posDoctor );

router.put( '/:id', 
  [],
  putDoctor );

router.delete( '/:id', deleteDoctor );

module.exports = router;
/*
    Routes: /api/users 
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middlewares');
const { 
  getUsers, 
  postUser, 
  putUser,
  deleteUser } = require('../controllers/users.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get( '/', validateJWT, getUsers );
//el segundo argumeto son los middlewares
//Cuando queremos usar varios middlewares, usamos un arreglo
//el check lo usamos para validar si los campos estan llegando
router.post( '/', 
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validateFields,
  ],
  postUser );

router.put( '/:id', 
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validateFields,
  ],
  putUser );

router.delete( '/:id', validateJWT, deleteUser );

module.exports = router;
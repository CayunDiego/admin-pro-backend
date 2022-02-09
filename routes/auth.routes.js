/*
    Routes: /api/auth 
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields.middlewares');


const router = Router();

router.post( '/',
 [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validateFields
 ],
 login
);

router.post( '/google',
 [
  check('token', 'El token es obligatorio').not().isEmpty(),
  validateFields
 ],
 googleSignIn
)

module.exports = router;
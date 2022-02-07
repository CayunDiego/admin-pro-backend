/*
    Routes: /api/all
*/
const { Router } = require('express');
const { 
  getSearch,
  getDocumentsCollection } = require('../controllers/search.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get( '/:search', validateJWT, getSearch );
router.get( '/collection/:table/:search', validateJWT, getDocumentsCollection );

module.exports = router;
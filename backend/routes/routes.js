const express = require('express');
const router = express.Router();
const {getAllDataBase} = require('../controllers/controller');
const {CheckIfValid,IsTokenExpired} = require('../Authorization/auth');
const {loginWithGoogle} = require('../controllers/loginController');
const {ChqTokenHeaderIsValid} = require('../Authorization/auth');


router.get('/database/:pageNum/:limit/:serchValue',ChqTokenHeaderIsValid,getAllDataBase);

router.post('/loginGoogle',CheckIfValid,loginWithGoogle);

router.post('/CheckIfTokenExpired',IsTokenExpired);

module.exports = router;
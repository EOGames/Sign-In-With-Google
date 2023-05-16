const express = require('express');
const router = express.Router();
const {getAllDataBase} = require('../controllers/controller');
const {CheckIfValid,IsTokenExpired} = require('../Authorization/auth');
const {loginWithGoogle} = require('../controllers/loginController');
const {ChqTokenHeaderIsValid} = require('../Authorization/auth');
const {SendMail} = require('../controllers/sendMail');
const {GetUserDetails} = require('../controllers/UserDetailsController');


router.get('/database/:pageNum/:limit/:serchValue',ChqTokenHeaderIsValid,getAllDataBase);

router.post('/loginGoogle',CheckIfValid,loginWithGoogle);

router.post('/CheckIfTokenExpired',IsTokenExpired);

router.post('/sendMail',SendMail);

router.get('/userDetails/:email',GetUserDetails);

// router.post('/genrateRefreshToken/:acessCode',)

module.exports = router;
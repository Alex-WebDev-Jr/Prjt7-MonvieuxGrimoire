const express = require('express');
const router = express.Router();

const loginCtrl = require('../controllers/users/loginUsers');
const signupCtrl = require('../controllers/users/signupUsers');

router.post('/signup', signupCtrl.signup);
router.post('/login', loginCtrl.login);

module.exports = router;

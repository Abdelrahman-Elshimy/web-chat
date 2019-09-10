const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check;
const authGuard = require('./guards/auth.guard');
const bodyParserM = bodyParser.urlencoded({
    extended: true,
});
const authController = require('../controllers/auth.controller');
router.get('/signup', authGuard.isNotAuth, authController.goToSignup);
router.post('/signup', 
bodyParserM, 
check('username').not().isEmpty().withMessage('username is required'),
check('email').not().isEmpty().withMessage('email is invalid').isEmail(),
check('password').isLength({min: 6}).withMessage('password must be more than 6 chars'),
check('confirmPassword').custom((value, {req}) => {
    if(value === req.body.password) return true;
    else throw 'Passwords no equal';
}).withMessage('Passwords not equal'),
authController.register);
router.get('/login', authGuard.isNotAuth, authController.goToLogin);
router.post('/login',bodyParserM, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
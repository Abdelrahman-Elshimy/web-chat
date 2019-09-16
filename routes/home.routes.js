const router = require('express').Router();
const homeController = require('../controllers/home.controller.js');
const authGuard = require('./guards/auth.guard');

router.get('/', authGuard.isAuth, homeController.getHome);

module.exports = router;
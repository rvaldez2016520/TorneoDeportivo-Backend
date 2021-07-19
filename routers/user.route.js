'use stirct'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/users'})

var api = express.Router();

//api.get('/pruebaUser',userController.pruebaUser);
api.post('/login',userController.login);
api.post('/saveUser', userController.saveUser);
api.post('/saveUserByAdmin/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],userController.saveUserByAdmin);
api.put('/updateUser/:id',mdAuth.ensureAuth,userController.updateUser);
api.put('/removeUser/:id',mdAuth.ensureAuth,userController.removeUser);
api.get('/getUsers',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],userController.getUsers);
api.post('/search',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],userController.search); 
api.put('/:id/uploadImage', [mdAuth.ensureAuth, upload], userController.uploadImage); 
api.get('/getImage/:fileName', [upload], userController.getImage);

module.exports = api;

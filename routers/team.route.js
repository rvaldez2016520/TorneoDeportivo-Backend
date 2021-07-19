'use strict'

var express = require('express');
var teamController = require('../controllers/team.controller');
var  mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/equipos'})

var api = express.Router();

//rutas de Equipos
api.post('/setTeam/:id',mdAuth.ensureAuth, teamController.setTeam);
api.put('/:idG/updateTeam/:idt',mdAuth.ensureAuth,teamController.updateTeam);
api.put('/:idG/removeTeam/:idt',mdAuth.ensureAuth,teamController.removeTeam);
api.get('/getTeams',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],teamController.getTeams);
api.put('/:idt/uploadImageTeam/', [upload],teamController.uploadImageTeam); 
api.get('/getImageTeam/:fileName', [upload],teamController.getImageTeam);

//rutas  de partidios
api.post('/createPartido/:id',mdAuth.ensureAuth,teamController.createPartido);
api.put('/:idT/finalizacionPartido/:idP',mdAuth.ensureAuth,teamController.finalizacionPartido);
api.get('/getPartidos',mdAuth.ensureAuth,teamController.getPartidos);
api.put('/:idT/SetGoals/:idP', mdAuth.ensureAuth,teamController.SetGoals);

module.exports = api;
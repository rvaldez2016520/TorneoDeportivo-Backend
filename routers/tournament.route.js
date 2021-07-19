'use stirct'

var express = require('express');
var tournamentController = require('../controllers/tournament.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/pruebaTorneo',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],tournamentController.pruebaTorneo);
api.post('/createTorneo/:id',mdAuth.ensureAuth,tournamentController.createTorneo);
api.put('/setTorneo/:id', mdAuth.ensureAuth , tournamentController.setTorneo);
api.put('/:idU/updateTorneo/:idT',mdAuth.ensureAuth,tournamentController.updateTorneo);
api.put('/:idU/removeTorneo/:idT',mdAuth.ensureAuth,tournamentController.removeTorneo);
api.get('/getTorneo',mdAuth.ensureAuth,tournamentController.getTorneo);


module.exports = api;

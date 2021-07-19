
'use strict'

const mongoose = require('mongoose');


const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: [true, "La Torneo necesita un nombre"] },
    team: [{type: mongoose.ObjectId, ref: 'team'}],
    partido: [{type: mongoose.ObjectId, ref: 'partido'}],
    report: [{type: mongoose.ObjectId, ref: 'report'}],

});

module.exports = mongoose.model('torneo', tournamentSchema);

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = Schema({
   torneo: {type: mongoose.ObjectId, ref: 'torneo'},
   team: { type: mongoose.Schema.ObjectId, ref: 'team' },
   partido:{ type: mongoose.Schema.ObjectId, ref :'partido'},
   goals: {
      type: Number,
      required: [true, "Se necesita los goles anotados"],
    },
    goalsAgainst: {
      type: Number,
      required: [true, "Se necesitan los goles en contra"],
    },
    goalDifference: {
      type: Number,
      required: [true, "Se necesita la diferencia de goles"],
    },
    score: {
      type: Number,
      required: [true, "se necesita los puntos obtenidos"],
    },
});

module.exports = mongoose.model('report', reportSchema);
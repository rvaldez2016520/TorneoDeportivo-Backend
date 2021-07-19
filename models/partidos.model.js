
'use strict'

const mongoose = require('mongoose');

const partidosSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  teamOne:{
    type: String,
},
goalsTeamOne:Number,
  teamTwo:{
    type: String,
},
goalsTeamTwo:Number
});

module.exports = mongoose.model('partido', partidosSchema);
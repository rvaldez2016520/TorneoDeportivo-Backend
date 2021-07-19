  
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: [true, "El equipo necesita un nombre"] },
  image:String,
});

module.exports = mongoose.model("team", teamSchema);
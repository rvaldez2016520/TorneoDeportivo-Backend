
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        username: {
          type: String,
        },
        password: {
          type: String,
        },
        name: {
          type: String,
        }, 
        lastname: {
          type: String,
        },
        email: {
            type: String,
          },
        role: {
          type: String,
        },
        image: {
          type: String,
        },
    torneo: [{type: mongoose.ObjectId, ref: 'torneo'}]
});

module.exports = mongoose.model('user', userSchema);

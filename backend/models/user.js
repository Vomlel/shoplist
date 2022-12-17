const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: false
  },
  sessionExpiration: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
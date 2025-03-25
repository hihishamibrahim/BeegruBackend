const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  auth:{
    refreshToken: {
      type: String,
      optional: true,
    },
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

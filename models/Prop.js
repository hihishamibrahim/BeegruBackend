const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdBy:{
    type:  String,
    required: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const PropertyModal = mongoose.model('Prop', propSchema);

module.exports = PropertyModal;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  nameHi: String,
  namePa: String,
  nameBn: String,
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  unit: {
    type: String,
    default: 'quintal'
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity']
  },
  quality: {
    type: String,
    enum: ['Premium', 'A Grade', 'B Grade', 'Fresh'],
    default: 'A Grade'
  },
  emoji: {
    type: String,
    default: '��'
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: String,
  rating: {
    type: Number,
    default: 4.5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

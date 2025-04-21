import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['prescription', 'over-the-counter', 'healthcare', 'personal-care'],
  },
  image: {
    type: String,
    required: [true, 'Please provide product image'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
  },
  manufacturer: {
    type: String,
    required: [true, 'Please provide manufacturer name'],
  },
  requiresPrescription: {
    type: Boolean,
    default: false,
  },
  activeIngredients: [{
    name: String,
    strength: String,
  }],
  dosage: {
    type: String,
    required: [true, 'Please provide dosage information'],
  },
  sideEffects: [String],
  warnings: [String],
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date'],
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', productSchema); 
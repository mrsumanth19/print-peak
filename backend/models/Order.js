const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String },
  designUrl: { type: String },
  method: { type: String }, // 'Home Delivery' or 'Card Payment'
  address: { type: String }, // ✅ new field for shipping address
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

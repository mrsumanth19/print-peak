const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// Add to cart
router.post('/', async (req, res) => {
  const { userId, productId } = req.body;
  const existing = await Cart.findOne({ user: userId, product: productId });
  if (existing) return res.json({ message: 'Already in cart' });

  const cartItem = new Cart({ user: userId, product: productId });
  await cartItem.save();
  res.json(cartItem);
});

// Get user's cart
router.get('/:userId', async (req, res) => {
  const cart = await Cart.find({ user: req.params.userId }).populate('product');
  res.json(cart);
});

// Delete item from cart
router.delete('/item/:productId/:userId', async (req, res) => {
  await Cart.findOneAndDelete({
    user: req.params.userId,
    product: req.params.productId,
  });
  res.json({ message: 'Removed from cart' });
});

// Clear all (optional)
router.delete('/clear/:userId', async (req, res) => {
  await Cart.deleteMany({ user: req.params.userId });
  res.json({ message: 'Cart cleared' });
});

module.exports = router;

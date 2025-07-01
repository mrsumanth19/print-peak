const Order = require('../models/Order');

// 🛒 Create Order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, productId, size, method, address } = req.body;
    const designUrl = req.file?.path; // from multer upload

    const order = new Order({
      user: userId,
      product: productId,
      size,
      method,
      address,
      designUrl,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ message: 'Order creation failed' });
  }
};

// 📦 Get User's Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('product');
    res.json(orders); // address is included automatically
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


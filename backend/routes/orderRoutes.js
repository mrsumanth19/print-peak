// orderRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const { cloudinary } = require('../utils/cloudinary');
const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const upload = multer();

// 🛒 Place custom order (Home Delivery)
router.post('/custom', upload.single('design'), async (req, res) => {
  try {
    const { userId, productId, size, method, address } = req.body;
    let designUrl = '';

    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'PrintPeak_Designs' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      designUrl = result.secure_url;
    }

    const newOrder = new Order({
      user: userId,
      product: productId,
      size,
      method,
      address,
      designUrl,
      status: 'Pending',
      date: new Date(),
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id).populate('product');

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error('❌ Cloudinary upload error:', err);
    res.status(500).json({ message: '❌ Order failed' });
  }
});

// 💳 Create Stripe Checkout session
router.post('/create-stripe-session', upload.single('design'), async (req, res) => {
  try {
    const { userId, productId, size, method, address } = req.body;
    let designUrl = '';

    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'PrintPeak_Designs' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      designUrl = result.secure_url;
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${product.name} - Size: ${size}`,
              images: [product.image],
            },
            unit_amount: Math.max(product.price * 100, 5000), // Minimum ₹50
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/orders?status=success&userId=${userId}&productId=${productId}&size=${size}&method=${method}&designUrl=${encodeURIComponent(
        designUrl
      )}&address=${encodeURIComponent(address)}`,
      cancel_url: 'http://localhost:3000/products?status=cancel',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('❌ Stripe session error:', err);
    res.status(500).json({ message: '❌ Stripe session creation failed' });
  }
});

// 📦 Save order after Stripe success
router.post('/create-after-stripe', async (req, res) => {
  try {
    const { userId, productId, size, method, designUrl, address } = req.body;

    const newOrder = new Order({
      user: userId,
      product: productId,
      size,
      method,
      address,
      designUrl,
      status: 'Pending',
      date: new Date(),
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id).populate('product');

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error('❌ Saving Stripe order error:', err);
    res.status(500).json({ message: '❌ Failed to save Stripe order' });
  }
});

// 👤 Get orders by user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('product');
    res.json(orders);
  } catch (err) {
    console.error('❌ Fetching orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;

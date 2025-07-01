import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Button, Modal, Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './Products.css';

const stripePromise = loadStripe('pk_test_51RflLWRnB0shCfGSAQM4e9kS3pDD8w4DqSMyRrea4jOtuVkho5UuDOukJM2NecCgLRZ48u17z09ArGrD5BFsJYTg00uSbHwuE3');

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [size, setSize] = useState('');
  const [method, setMethod] = useState('Home Delivery');
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  const fetchCart = async () => {
    try {
      const res = await axios.get(`/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('❌ Error fetching cart:', err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/api/cart/item/${productId}/${userId}`);
      fetchCart();
    } catch (err) {
      console.error('❌ Error removing item:', err);
    }
  };

  const openBuyModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setSize('');
    setMethod('Home Delivery');
    setDesignFile(null);
    setDesignPreview(null);
    setAddress('');
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    if (!size || !designFile || !method || !address) return alert('Please fill all fields');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('productId', selectedProduct._id);
    formData.append('size', size);
    formData.append('method', method);
    formData.append('design', designFile);
    formData.append('address', address);

    try {
      if (method === 'Card Payment') {
        const res = await axios.post('/api/orders/create-stripe-session', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
        return;
      }

      await axios.post('/api/orders/custom', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await axios.delete(`/api/cart/item/${selectedProduct._id}/${userId}`);
      alert('✅ Order placed');
      setShowModal(false);
      fetchCart();
      navigate('/orders');
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('❌ Order failed');
    }
  };

  useEffect(() => {
    if (!userId) {
      alert('⚠️ Please login to view cart.');
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [userId]);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <Row>
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <Col key={item._id} sm={12} md={6} lg={4} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Img
                    variant="top"
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text><strong>Price:</strong> ₹{product.price}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="danger" size="sm" onClick={() => handleRemove(product._id)}>
                        Remove
                      </Button>
                      <Button variant="success" size="sm" onClick={() => openBuyModal(product)}>
                        Buy Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🛒 Customize & Buy</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBuySubmit} encType="multipart/form-data">
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Select value={size} onChange={(e) => setSize(e.target.value)} required>
                <option value="">Select Size</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Design</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  const file = e.target.files[0];
                  setDesignFile(file);
                  if (file) setDesignPreview(URL.createObjectURL(file));
                }}
              />
            </Form.Group>

            {selectedProduct && (
              <div className="mb-3 text-center">
                <p className="mb-1 fw-semibold">Mockup Preview</p>
                <div className="mockup-container">
                  <img
                    src={selectedProduct.image || 'https://via.placeholder.com/200?text=No+Image'}
                    alt="Product"
                    className="mockup-product"
                  />
                  {designPreview && (
                    <img
                      src={designPreview}
                      alt="Design"
                      className="mockup-design"
                    />
                  )}
                </div>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Delivery Method</Form.Label>
              <Form.Select value={method} onChange={(e) => setMethod(e.target.value)} required>
                <option>Home Delivery</option>
                <option>Card Payment</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Order</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Cart;

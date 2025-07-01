import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './Products.css';

const stripePromise = loadStripe('pk_test_51RflLWRnB0shCfGSAQM4e9kS3pDD8w4DqSMyRrea4jOtuVkho5UuDOukJM2NecCgLRZ48u17z09ArGrD5BFsJYTg00uSbHwuE3');

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [size, setSize] = useState('');
  const [method, setMethod] = useState('Home Delivery');
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!userId) {
      alert('⚠️ Please log in to add items to cart.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/cart', {
        userId,
        productId: product._id,
      });
      alert('✅ Product added to cart');
    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      alert('❌ Failed to add to cart');
    }
  };

  const openBuyModal = (product) => {
    if (!userId) {
      alert('⚠️ Please log in first.');
      navigate('/login');
      return;
    }

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

    if (method === 'Card Payment') {
      try {
        const res = await axios.post('/api/orders/create-stripe-session', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
      } catch (err) {
        console.error('❌ Stripe error:', err);
        alert('❌ Failed to proceed to payment');
      }
      return;
    }

    // Home Delivery
    try {
      await axios.post('/api/orders/custom', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Order placed');
      setShowModal(false);
      navigate('/orders');
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('❌ Order failed');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🛍 All Products</h2>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Img
                variant="top"
                src={product.image}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text><strong>₹{product.price}</strong></Card.Text>
                <Card.Text>{product.description}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                  <Button variant="primary" onClick={() => openBuyModal(product)}>
                    Buy Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Buy Now Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🛒 Customize & Buy</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBuySubmit} encType="multipart/form-data">
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              >
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
                    src={selectedProduct.image}
                    alt="Product"
                    className="mockup-product"
                  />
                  {designPreview && (
                    <img
                      src={designPreview}
                      alt="Design Overlay"
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
              <Form.Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              >
                <option>Home Delivery</option>
                <option>Card Payment</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Order
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Products;

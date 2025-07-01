import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Modal,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDesign, setPreviewDesign] = useState('');
  const [productImage, setProductImage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?._id) {
      alert('⚠️ Please login to view orders.');
      navigate('/login');
      return;
    }

    const checkStripeSuccessAndCreateOrder = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const status = queryParams.get('status');

      if (status === 'success') {
        const alreadyCreated = sessionStorage.getItem('stripeOrderCreated');
        if (!alreadyCreated) {
          const productId = queryParams.get('productId');
          const size = queryParams.get('size');
          const method = queryParams.get('method');
          const designUrl = queryParams.get('designUrl');
          const address = queryParams.get('address'); // ✅ Add this line

          if (productId && size && method && designUrl && address) {
            try {
              await axios.post('/api/orders/create-after-stripe', {
                userId: user._id,
                productId,
                size,
                method,
                designUrl,
                address, // ✅ Include address
              });
              sessionStorage.setItem('stripeOrderCreated', 'true');
              alert('✅ Order saved after payment!');
              // remove query params
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            } catch (err) {
              console.error('❌ Failed to save Stripe order:', err);
              alert('❌ Failed to save your order after payment.');
            }
          }
        }
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders/user/${user._id}`);
        console.log("📦 Orders fetched:", res.data); // ✅ Debug log
        setOrders(res.data);
      } catch (err) {
        console.error('❌ Error fetching orders:', err);
      }
    };

    checkStripeSuccessAndCreateOrder();
    fetchOrders();
  }, [user, navigate]);

  const openPreviewModal = (designUrl, productImg) => {
    setPreviewDesign(designUrl);
    setProductImage(productImg);
    setShowPreview(true);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">📦 My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        <Row>
          {orders.map((order) => (
            <Col key={order._id} sm={12} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src={order.product?.image}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{order.product?.name}</Card.Title>
                  <Card.Text><strong>Size:</strong> {order.size || 'N/A'}</Card.Text>
                  <Card.Text><strong>Delivery:</strong> {order.method || 'N/A'}</Card.Text>
                  <Card.Text>
                    <strong>Design:</strong>{' '}
                    {order.designUrl ? (
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => openPreviewModal(order.designUrl, order.product?.image)}
                      >
                        View
                      </Button>
                    ) : (
                      'N/A'
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Address:</strong> {order.address || 'N/A'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Status:</strong>{' '}
                    <Badge bg={order.status === 'Pending' ? 'warning' : 'success'}>
                      {order.status}
                    </Badge>
                  </Card.Text>
                  <Card.Text>
                    <strong>Ordered On:</strong>{' '}
                    {new Date(order.date).toLocaleString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 🔍 Mockup Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🖼 Mockup Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mockup-container">
            {productImage && (
              <img src={productImage} alt="T-shirt" className="mockup-product" />
            )}
            {previewDesign && (
              <img
                src={previewDesign}
                alt="Uploaded Design"
                className="mockup-design"
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;

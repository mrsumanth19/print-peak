import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [latestAddress, setLatestAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        fetchDashboardData(parsed._id);
      }
    } catch (err) {
      console.error('❌ Failed to parse user from localStorage:', err);
    }
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      const [ordersRes, cartRes] = await Promise.all([
        axios.get(`/api/orders/user/${userId}`),
        axios.get(`/api/cart/${userId}`),
      ]);

      const orders = ordersRes.data || [];
      const cartItems = cartRes.data || [];

      setOrderCount(orders.length);
      setCartCount(cartItems.length);

      if (orders.length > 0) {
        const latest = orders[orders.length - 1];
        setLatestAddress(latest.address || 'Not available');
      } else {
        setLatestAddress('No address available');
      }
    } catch (err) {
      console.error('❌ Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h3>⚠️ Please login to view your dashboard.</h3>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">👤 User Dashboard</h2>
      <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <Row className="mb-3">
          <Col xs={5}><strong>Name:</strong></Col>
          <Col>{user.name}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={5}><strong>Email:</strong></Col>
          <Col>{user.email}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={5}><strong>Role:</strong></Col>
          <Col>{user.isAdmin ? 'Admin' : 'Regular User'}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={5}><strong>Total Orders:</strong></Col>
          <Col>{orderCount}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={5}><strong>Cart Items:</strong></Col>
          <Col>{cartCount}</Col>
        </Row>
        <Row>
          <Col xs={5}><strong>Last Shipping Address:</strong></Col>
          <Col>{latestAddress}</Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Dashboard;

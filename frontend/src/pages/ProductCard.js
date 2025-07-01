import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ title, price, image, productId }) => {
  const navigate = useNavigate();

  // ✅ Safely parse user from localStorage
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  const handleAddToCart = async () => {
    if (!user || !user._id) {
      alert('⚠️ Please log in to add items to cart.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/cart/add', {
        userId: user._id,
        productId,
      });
      alert('✅ Product added to cart!');
    } catch (error) {
      console.error('❌ Error adding to cart:', error.response?.data || error.message);
      alert('❌ Failed to add product to cart.');
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        style={{ height: '200px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title className="fw-semibold">{title}</Card.Title>
        <Card.Text className="text-muted">{price}</Card.Text>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

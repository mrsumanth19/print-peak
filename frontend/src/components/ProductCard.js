import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ title, price, image }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/products');
  };

  const handleAddToCart = () => {
    alert('Please login to add to cart');
    navigate('/login');
  };

  return (
    <Card
      className="shadow-sm h-100"
      style={{ borderRadius: '1rem', cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      <Card.Img
        variant="top"
        src={image}
        style={{
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
          height: '250px',
          objectFit: 'cover',
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fw-bold" style={{ fontSize: '1.1rem' }}>
            {title}
          </Card.Title>
          <Card.Text className="text-muted">{price}</Card.Text>
        </div>
        <Button
          variant="primary"
          className="mt-2 fw-semibold rounded-pill"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            handleAddToCart();
          }}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

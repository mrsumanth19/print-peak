import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error('❌ Error fetching products:', err);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#F7F7F7', color: '#393E46' }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#EEEEEE', padding: '80px 0' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
                 <h1 className="fw-bold display-4">
          You <span style={{ color: '#000' }}>Dream It</span>,<br />
          <span style={{ color: '#d90429' }}>We Print It</span>
        </h1>
              <p className="lead mt-3 text-muted">
          Custom clothes printing made easy. Upload your designs, choose your style, and
          get them printed in premium quality.
        </p>
              <Link to="/products">
                <Button
                  size="lg"
                  className="fw-bold mt-4 px-4"
                  style={{
                    backgroundColor: '#393E46',
                    color: '#F7F7F7',
                    border: 'none',
                    borderRadius: '6px',
                  }}
                >
                  Explore Now
                </Button>
              </Link>
            </Col>
            <Col md={6}>
              <img
                src="https://www.appnova.com/wp-content/uploads/2024/10/An-Essential-Guide-to-Fashion-eCommerce-Top-Trends-Winning-Strategies-and-More1-1220x1220.jpg"
                alt="Fashion Model"
                className="img-fluid rounded"
                 style={{
    maxWidth: '50%',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Trending Products */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#393E46' }}>
          Trending Now
        </h2>
        <Row>
          {products.length === 0 ? (
            <p className="text-center" style={{ color: '#929AAB' }}>No trending products available.</p>
          ) : (
            products.map((product) => (
              <Col md={3} sm={6} xs={12} key={product._id} className="mb-4">
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    border: '1px solid #929AAB',
                  }}
                >
                  <ProductCard
                    title={product.name}
                    price={`₹${product.price}`}
                    image={product.image}
                    productId={product._id}
                  />
                </div>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Home;

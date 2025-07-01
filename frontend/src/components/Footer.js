import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer
      className="border-top py-4 mt-auto"
      style={{
        backgroundColor: '#EEEEEE',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      <Container className="text-center" style={{ color: '#393E46', fontWeight: '500' }}>
        <small>
          &copy; {new Date().getFullYear()}{' '}
          <span style={{ color: '#929AAB', fontWeight: '700' }}>PrintPeak</span>. All rights reserved.
        </small>
      </Container>
    </footer>
  );
};

export default Footer;

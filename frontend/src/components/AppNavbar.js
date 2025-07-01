import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();

  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch (err) {
      console.error('❌ Failed to parse user from localStorage:', err);
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{
        backgroundColor: '#F7F7F7',
        fontFamily: 'Outfit, sans-serif',
        borderBottom: '1px solid #EEEEEE',
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-3"
          style={{ color: '#393E46' }}
        >
          Print<span style={{ color: '#929AAB' }}>Peak</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              style={{ color: '#393E46' }}
              className="mx-2"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              style={{ color: '#393E46' }}
              className="mx-2"
            >
              Products
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  style={{ color: '#393E46' }}
                  className="mx-2"
                >
                  Cart
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/orders"
                  style={{ color: '#393E46' }}
                  className="mx-2"
                >
                  Orders
                </Nav.Link>
              </>
            )}

            {!user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/register"
                  style={{ color: '#393E46' }}
                  className="mx-2"
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login"
                  style={{ color: '#393E46' }}
                  className="mx-2"
                >
                  Login
                </Nav.Link>
              </>
            ) : (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center text-dark">
                    <i className="fas fa-user-circle me-2 fs-5" />
                    {user.name}
                  </span>
                }
                id="user-dropdown"
                menuVariant="light"
              >
                <NavDropdown.Item
                  as={Link}
                  to={user.isAdmin ? '/admin' : '/dashboard'}
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

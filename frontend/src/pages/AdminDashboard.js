import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Image,
  Tab,
  Tabs,
  Badge,
} from 'react-bootstrap';

const colors = {
  background: '#F7F7F7',
  cardBg: '#EEEEEE',
  textDark: '#393E46',
  textMuted: '#929AAB',
};

const AdminDashboard = () => {
  const [key, setKey] = useState('products');
  const [product, setProduct] = useState({ name: '', price: '', description: '', image: null, _id: null });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');
const handleDeleteAllProducts = async () => {
  if (!window.confirm('Are you sure you want to delete all products?')) return;
  await axios.delete('/api/admin/products', {
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchProducts();
};

const handleDeleteAllUsers = async () => {
  if (!window.confirm('Are you sure you want to delete all users?')) return;
  await axios.delete('/api/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchUsers();
};

const handleDeleteAllOrders = async () => {
  if (!window.confirm('Are you sure you want to delete all orders?')) return;
  await axios.delete('/api/admin/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchOrders();
};

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProduct({ ...product, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

 const handleProductSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('price', product.price);
  formData.append('description', product.description);

  if (product.image) {
    formData.append('image', product.image);
  }

  try {
    if (product._id) {
      // Edit mode
      await axios.put(`/api/products/${product._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Product updated!');
    } else {
      // Add mode
      if (!product.image) {
        alert('Please upload a product image!');
        return;
      }
      await axios.post('/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Product added!');
    }

    // Reset form
    setProduct({ name: '', price: '', description: '', image: null, _id: null });
    setPreview(null);
    fetchProducts();
  } catch (err) {
    console.error('❌ Product submit error:', err.response?.data || err.message);
    alert(`❌ ${err.response?.data?.error || 'Something went wrong'}`);
  }
};


  const handleEditProduct = (prod) => {
    setProduct({ ...prod, image: null });
    setPreview(prod.image);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    await axios.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleOrderStatusChange = async (id, status) => {
    await axios.put(`/api/admin/orders/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };

 const handleDeleteOrder = async (id) => {
  if (!window.confirm('Delete this order?')) return;
  await axios.delete(`/api/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchOrders();  // ← This is the last line
 };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  return (
    <Container fluid style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '2rem' }}>
      <h2 className="mb-4 text-center" style={{ color: colors.textDark }}>
        🛠 Admin Dashboard
      </h2>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
        fill
        justify
      >
        {/* PRODUCTS TAB */}
        <Tab eventKey="products" title="🛒 Products">
          
          <Card
            className="p-4 mb-4 shadow-sm"
            style={{ backgroundColor: colors.cardBg, color: colors.textDark }}
          >
            <Form onSubmit={handleProductSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleProductChange}
                      required
                      style={{ backgroundColor: '#fff', color: colors.textDark, borderColor: colors.textMuted }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="price">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleProductChange}
                      required
                      style={{ backgroundColor: '#fff', color: colors.textDark, borderColor: colors.textMuted }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                  required
                  style={{ backgroundColor: '#fff', color: colors.textDark, borderColor: colors.textMuted }}
                />
              </Form.Group>
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleProductChange}
                  style={{ borderColor: colors.textMuted }}
                />
              </Form.Group>
              {preview && (
                <div className="mb-3 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: '200px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                  />
                </div>
              )}
              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={uploading}
                  style={{ backgroundColor: colors.textDark, borderColor: colors.textDark }}
                >
                  {uploading ? 'Saving...' : product._id ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </Form>
          </Card>
<div className="d-flex justify-content-end mb-3">
  <Button variant="danger" onClick={handleDeleteAllProducts}>
    Delete All Products
  </Button>
</div>

          <h5 style={{ color: colors.textDark, marginBottom: '1rem' }}>All Products</h5>
          <Row xs={1} md={3} className="g-4">
            {products.map((prod) => (
              <Col key={prod._id}>
                <Card
                  style={{
                    backgroundColor: colors.cardBg,
                    color: colors.textDark,
                    height: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                  }}
                  className="d-flex flex-column"
                >
                  <div
                    style={{
                      height: '180px',
                      overflow: 'hidden',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={prod.image}
                      alt={prod.name}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column flex-grow-1">
                    <Card.Title>{prod.name}</Card.Title>
                    <Card.Text className="mb-2" style={{ flexGrow: 1 }}>
                      {prod.description.length > 80 ? prod.description.slice(0, 80) + '...' : prod.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong style={{ fontSize: '1.1rem' }}>₹{prod.price}</strong>
                      <div>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditProduct(prod)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(prod._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* USERS TAB */}
        <Tab eventKey="users" title="👥 Users">
          <h5 style={{ color: colors.textDark, marginBottom: '1rem' }}>All Registered Users</h5>
          <div className="d-flex justify-content-end mb-3">
  <Button variant="danger" onClick={handleDeleteAllUsers}>
    Delete All Users
  </Button>
</div>

          <Row xs={1} md={3} className="g-4">
            {users.map((u) => (
              <Col key={u._id}>
                <Card
                  style={{
                    backgroundColor: colors.cardBg,
                    color: colors.textDark,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    height: '100%',
                  }}
                  className="d-flex flex-column justify-content-between"
                >
                  <Card.Body>
                    <Card.Title>{u.name}</Card.Title>
                    <Card.Text>
                      <strong>Email: </strong>
                      <span style={{ color: colors.textMuted }}>{u.email}</span>
                    </Card.Text>
                    <Card.Text>
                      <strong>Admin: </strong>
                      {u.isAdmin ? (
                        <Badge bg="success">Yes</Badge>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 d-flex justify-content-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u.isAdmin}
                    >
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* ORDERS TAB */}
        <Tab eventKey="orders" title="📦 Orders">
  <h5 style={{ color: colors.textDark, marginBottom: '1rem' }}>All Orders</h5>
  <div className="d-flex justify-content-end mb-3">
    <Button variant="danger" onClick={handleDeleteAllOrders}>
      Delete All Orders
    </Button>
  </div>

  <Row xs={1} md={2} lg={3} className="g-4">
    {orders.map((order) => (
      <Col key={order._id}>
        <Card
          style={{
            backgroundColor: colors.cardBg,
            color: colors.textDark,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
  style={{
    position: 'relative',
    width: '100%',
    height: '300px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
  }}
>
  {/* Product Image */}
  <img
    src={order.product?.image}
    alt="T-shirt"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      opacity: 0.3,
      zIndex: 1,
    }}
  />

  {/* Very Small Centered Design */}
  {order.designUrl && (
    <img
      src={order.designUrl}
      alt="Design Overlay"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '80px',         // 👈 Very small width
        height: '80px',        // 👈 Very small height
        transform: 'translate(-50%, -50%)',
        objectFit: 'contain',
        zIndex: 2,
      }}
    />
  )}
</div>


          <Card.Body>
            <Card.Title>{order.product?.name}</Card.Title>
            <Card.Text><strong>Description:</strong> {order.product?.description}</Card.Text>
            <Card.Text><strong>Price:</strong> ₹{order.product?.price}</Card.Text>
            <Card.Text><strong>Size:</strong> {order.size}</Card.Text>
            <Card.Text><strong>Delivery:</strong> {order.method}</Card.Text>
            <Card.Text><strong>Address:</strong> {order.address}</Card.Text>
            <Card.Text><strong>User:</strong> {order.user?.name || 'N/A'}</Card.Text>
            <Card.Text><strong>Date:</strong> {new Date(order.date).toLocaleString()}</Card.Text>
            <Card.Text>
              <strong>Status:</strong>{' '}
              <Badge bg={order.status === 'Pending' ? 'warning' : order.status === 'Shipped' ? 'info' : order.status === 'Delivered' ? 'success' : 'secondary'}>
                {order.status}
              </Badge>
            </Card.Text>
          </Card.Body>

          <Card.Footer className="bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Select
                value={order.status}
                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                style={{
                  borderColor: colors.textMuted,
                  color: colors.textDark,
                  width: '70%',
                }}
              >
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </Form.Select>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteOrder(order._id)}
                style={{ marginLeft: '10px' }}
              >
                Delete
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    ))}
  </Row>
</Tab>

      </Tabs>
    </Container>
  );
};
export default AdminDashboard;

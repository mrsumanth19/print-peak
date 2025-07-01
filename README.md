# 🧢 PrintPeak – Custom Clothes Printing E-Commerce Platform

PrintPeak is a full-stack dynamic e-commerce web application for a **custom clothes printing business**. It allows users to browse apparel, upload custom designs, preview them on mockups, and place orders. Admins can manage products, view orders, and update statuses. This project was built using the **MERN stack**, integrated with **Cloudinary**, **Stripe**, and deployed on **Vercel + Render**.

## 🚀 Live Demo
**Frontend** (Vercel): _[Coming Soon]_  
**Backend** (Render): _[Coming Soon]_  

---

## 📌 Features

### 👤 User
- JWT-based Authentication (Register/Login)
- Browse products with variants (size, color, type)
- Upload designs (Cloudinary integration)
- Preview design mockups
- Add to Cart and Checkout
- Stripe Payment Integration
- Track orders & view order history
- Manage profile details

### 🛠️ Admin
- Dashboard to:
  - Add, Edit, Delete products
  - View all orders
  - Update order statuses

---

## 🛠 Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Router DOM

### Backend
- Node.js + Express.js
- MongoDB Atlas
- JWT Authentication
- Stripe API (for payment)
- Cloudinary (image upload)

---

## 📁 Folder Structure

```

print-peak/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── ...
├── server/               # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── .env
└── README.md

````

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mrsumanth19/print-peak.git
cd print-peak
````

### 2. Setup Backend (Express)

```bash
cd server
npm install
# Create .env file and add:
# MONGO_URI, CLOUDINARY_API_KEY, CLOUDINARY_SECRET, STRIPE_SECRET_KEY, JWT_SECRET
npm start
```

### 3. Setup Frontend (React)

```bash
cd ../client
npm install
npm run dev
```


## 🔐 Environment Variables

> ⚠️ For security reasons, the actual `.env` file is **not included** in the repository.  
To run the project locally, create a `.env` file in the `backend/` directory and use the format below:

```env
PORT=5000
MONGO_URI=mongodb+srv://yourMongoUser:yourMongoPassword@yourCluster.mongodb.net/printpeak?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=yourCloudName
CLOUDINARY_API_KEY=yourCloudinaryAPIKey
CLOUDINARY_API_SECRET=yourCloudinaryAPISecret
STRIPE_SECRET_KEY=yourStripeSecretKey
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=yourJWTSecretKey
Replace the placeholder values with your actual credentials.


## 🌐 Deployment

* **Frontend**: [Vercel](https://vercel.com/)
* **Backend**: [Render](https://render.com/)
* **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 📅 Development Roadmap

### Week 1:

* Setup frontend/backend boilerplate
* JWT Auth system
* Product model with variants

### Week 2:

* Product listing + detail pages
* Cloudinary upload & preview
* Cart & Checkout system

### Week 3:

* Stripe payment integration
* Admin dashboard (products/orders/status)

### Week 4:

* Order tracking, user profile, order history
* Final testing & deployment

---

## 👥 Contributors

- [@mrsumanth19](https://github.com/mrsumanth19) – Creator  
- [@mahe0420](https://github.com/mahe0420) – Contributor  


---

## 📄 License

MIT © [Sumanth M](https://github.com/mrsumanth19)

```


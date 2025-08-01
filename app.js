const express = require('express');
const itemRoutes = require('./Routes/itemRoutes');
const userRoutes = require('./Routes/userRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const favouriteRoutes = require('./Routes/favouriteRoutes');

const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // Replace with your frontend origin for better security
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/favourites', favouriteRoutes);
app.use(globalErrorHandler);




module.exports = app;
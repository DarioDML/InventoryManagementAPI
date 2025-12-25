const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for root documentation)
app.use(express.static(path.join(__dirname, '../public')));

// Routes placeholders
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const stockMovementRoutes = require('./routes/stockMovement.routes');
app.use('/api/stock-movements', stockMovementRoutes);

// Root endpoint serves the HTML documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

module.exports = app;

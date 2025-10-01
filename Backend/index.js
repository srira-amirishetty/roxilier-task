const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();


const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const adminRoutes = require('./routes/admin');
const ratingRoutes = require('./routes/rating');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

app.use('/auth', authRoutes);
app.use('/store', storeRoutes);
app.use('/admin', adminRoutes);
app.use('/rating', ratingRoutes);

// Error handling middleware

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
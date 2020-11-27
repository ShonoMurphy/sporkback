const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');

dotenv.config();

// Import Routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

// Middleware
app.use(express.json());

// Route Middleware
app.use('/posts', postsRoute);
app.use('/api/user', authRoute);

// Routes
app.get('/', (req,res) => {
    res.send('We are on home');
});


// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true }, 
    () => console.log('Connected to DB!')
);

// Listen
app.listen(3000, () => console.log('Server listening on port 3000'));
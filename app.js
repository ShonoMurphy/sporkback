const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

// Import Routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

// Middleware
app.use(cors())
app.use(express.json());

// Route Middleware
app.use('/api/posts', postsRoute);
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
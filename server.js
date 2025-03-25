const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyToken = require('./middleware/auth');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Allow requests from this specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow cookies if needed
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const authRouter = require('./routes/auth');
const propRouter = require('./routes/prop');
app.use('/auth', authRouter);
app.use('/property', verifyToken, propRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
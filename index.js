// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const cors = require('cors'); // Import the cors package
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for requests from the frontend
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json());

const CONNECTION_URL = process.env.CONNECTION_URL;
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// 613 by 470 => reception
// 926 by 113 => passage

// REMEMBER TO ADD PROTECTION TO NECESSARY ROUTES
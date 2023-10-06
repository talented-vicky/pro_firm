const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');


const { PORT, CONNECTION_URL } = require('./middleware/keys')
const app = express();

//
// Enable CORS for requests from the frontend
app.use(cors({ origin: 'http://localhost:5000' }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to Pro Firm Backend App",
    notification: "Everything is working fine, You should NOT be here though"
  })
})

// app.use('/api', adminRoutes);

// app.use('/api/auth', authRoutes);

// app.use('/api', apiRoutes)

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


// 613 by 470 => reception
// 926 by 113 => passage

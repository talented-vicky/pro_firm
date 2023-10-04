const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin')



require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

// Enable CORS for requests from the frontend
app.use(cors({ origin: 'http://localhost:5000' }));

app.use(bodyParser.json());


app.use('/api', adminRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', apiRoutes)

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


// 613 by 470 => reception
// 926 by 113 => passage


// --- fp3 and fp6 should have 30 days kini
// referrals for first 4 should be 0
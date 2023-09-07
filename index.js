// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
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


/*
-- a post request
when "refer now" button is clicked (ensure the user clicking on this button
is the same currrently logged in user) on the frontend, automatically 
generate a link that can be shared with others, the userId of the current
user should be saved and sent to backend too

add referral field to user model and update this when a user signs up

... to send
user to the register page on the website again, but I should pass the 
ID of the person the link belongs to to the backend

-- a post request
Then, I pass the data to the frontend to store in the user model
*/
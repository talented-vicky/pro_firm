const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization; // Get token from headers
  

  // console.log('tokenvalue', tokenValue)

  if (!token) {
    console.log('token missing')
    return res.status(401).json({ message: 'Authorization token missing' });
  } else if (token) {

    const tokenValue = token.split(' ')[1]
    jwt.verify(tokenValue, 'your-secret-key', (error, decoded) => {
      
      if (error) {
        console.log('fake token', tokenValue)
        return res.status(401).json({ message: 'Token validation failed' });
      }
  
      // Token is valid, attach decoded payload to request
      req.userId = decoded.userId;
      next();
    });
  }

  
};

module.exports = verifyToken;

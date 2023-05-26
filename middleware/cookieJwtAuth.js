const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

exports.cookieJwtAuth = (req, res, next) => {
  const { token } = req.cookies;
  try {
    const user = jwt.verify(token,secretKey); // 검증
    req.user = user;
      next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/');
  }
};
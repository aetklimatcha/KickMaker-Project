const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

exports.cookieJwtAuth = (req, res, next) => {
  const { token } = req.cookies;
  try {
    const user = jwt.verify(token,secretKey); // 검증
    req.user_id = user;
      next();
  } catch (err) {
    res.clearCookie('token');
    console.log("cookie 없는데요?");
    req.user_id = null;
      next();
    //res.redirect('/test');
  }
};
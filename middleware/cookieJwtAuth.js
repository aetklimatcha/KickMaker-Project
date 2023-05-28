const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

exports.cookieJwtAuth = (req, res, next) => {
  const { usertoken } = req.cookies;
  const { matchtoken } = req.cookies;
  try {
    const user = jwt.verify(usertoken,secretKey); // 검증
    const match = jwt.verify(matchtoken,secretKey); // 검증
    req.user_id = user;
    req.match = match;
    console.log(req.user_id);
    console.log(req.match);
      next();
  } catch (err) {
    res.clearCookie('token');
    console.log("cookie 없는데요?");
    req.user_id = null;
      next();
  }
};
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

exports.cookieJwtAuth = (req, res, next) => {
  const { usertoken } = req.cookies;
  const { findMatchestoken } = req.cookies;
  const { myMatchtoken } = req.cookies;

  try {
    //로그인 유저 토큰
    if (req.cookies.usertoken) {
      const user = jwt.verify(usertoken,secretKey); // 검증
      req.user_id = user;
    }
    //검색된 매치 토큰
    if(req.cookies.findMatchestoken) {
      const findMatches = jwt.verify(findMatchestoken,secretKey); // 검증
      req.findMatches = findMatches;
    }
    //내가 입력한 매치 정보 토큰
    if(req.cookies.myMatchtoken) {
      const myMatch = jwt.verify(myMatchtoken,secretKey); // 검증
      req.myMatch = myMatch;
    }
      next();
  } catch (err) {
    res.clearCookie('token');
    console.log("cookie 없는데요?");
    req.user_id = null;
      next();
  }
};
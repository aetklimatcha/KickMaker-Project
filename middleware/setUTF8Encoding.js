// Custom middleware to set UTF-8 encoding for all responses
const setUTF8Encoding = (req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
};

exports.setUTF8Encoding = setUTF8Encoding;
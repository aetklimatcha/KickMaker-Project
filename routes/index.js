const router = require("express").Router();
var path = require("path");

router.get('/', (request, response) => {
    //response.sendFile(__dirname, '..','pages','index.html');
    //response.sendFile('C:/Users/201810519/Desktop/prac/capstone/pages/index.html');
    response.sendFile(path.join(__dirname + '/../pages/index.html'));
});

router.get('/about', (request, response) => {
    response.send('test about');
});

module.exports = router;
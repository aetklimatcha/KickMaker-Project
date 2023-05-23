var express = require('express');
var app = express();
var port = 3000;
var http = require('http').createServer(app);
var path = require('path');
var qs = require('querystring');
var fs = require('fs')
const request = require('http');
const response = require('express');
const req = require('express/lib/request.js');
const routes = require("./routes/index.js");
//var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
// var compression = require('compression')
const loginController = require('./controllers/loginController.js');
const registerController = require('./controllers/registerController.js');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//정적파일 서비스하는 모듈? (css 안됐을때 씀)
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//router 폴더 연결

app.use(routes)


//304 발생 해결
// app.set("etag", false);
// app.disable('etag');
// const options = { etag : false };


// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
/*
// 회원가입, 로그인 핸들 라우터 
app.post('/api/register',registerController.register);
app.post('/api/login',loginController.login);

app.get('/api/register', function(req, res) { 
    res.sendFile('register.html', {  root : 'user' });

});
app.get('/api/login', function(req, res) { 
    res.sendFile('login.html', {  root : 'user' });
});

*/

// 로그인을 위한 쿠키 사용하기
var cookieParser = require('cookie-parser');
app.use(cookieParser());

  
// 서버
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

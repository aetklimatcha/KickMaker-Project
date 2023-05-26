var express = require('express');
var app = express();
var port = 3000;
var http = require('http').createServer(app);
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
const request = require('http');
const response = require('express');
const req = require('express/lib/request.js');
const routes = require("./routes/index.js");
var bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

//var sanitizeHtml = require('sanitize-html');
// var compression = require('compression')
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//정적파일 서비스하는 모듈? (css 안됐을때 씀)
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//router 폴더 연결

app.use(routes);


//304 발생 해결
// app.set("etag", false);
// app.disable('etag');
// const options = { etag : false };



// 서버
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

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
//var sanitizeHtml = require('sanitize-html');
//var bodyParser = require('body-parser');
// var compression = require('compression')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//정적파일 서비스하는 모듈? (css 안됐을때 씀)
app.use(express.static(__dirname));

//MYSQL CONNETCION
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mycapstonedb.cnoou4raevzv.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: "capstone123",
    database: "KICKMATCH"
});

//MYSQL 커넥션 확인 (Team 테이블 출력)
connection.connect(function (err) {
    if (err) {
        throw err; // 접속에 실패하면 에러를 throw 합니다.
    } else {
        // 접속시 쿼리를 보냅니다.
        connection.query("SELECT * FROM Team", function (err, rows, fields) {
           // console.log(rows); // 결과를 출력합니다!!!
        });
    }
});

//router 폴더 연결
const routes = require("./routes/index.js");
app.use(routes)


//304 발생 해결
// app.set("etag", false);
// app.disable('etag');
// const options = { etag : false };

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

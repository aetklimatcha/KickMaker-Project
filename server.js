var express = require('express')
var app = express()
var path = require('path');
var qs = require('querystring');
var fs = require('fs')
//var sanitizeHtml = require('sanitize-html');
//var bodyParser = require('body-parser');
// var compression = require('compression')

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mycapstonedb.cnoou4raevzv.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: "capstone123",
    database: "KICKMATCH"
});

connection.connect(function (err) {
    if (err) {
        throw err; // 접속에 실패하면 에러를 throw 합니다.
    } else {
        // 접속시 쿼리를 보냅니다.
        connection.query("SELECT * FROM Team", function (err, rows, fields) {
            console.log(rows); // 결과를 출력합니다!!!
        });
    }
});


var port = 3000
const { request } = require('http');
const { response } = require('express');
const req = require('express/lib/request.js');

app.get('', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/about', (request, response) => {
    response.send('test about');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

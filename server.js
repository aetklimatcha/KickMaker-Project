var express = require('express')
var app = express()
var path = require('path');
var qs = require('querystring');
var fs = require('fs')
// var sanitizeHtml = require('sanitize-html');
// var bodyParser = require('body-parser');
// var compression = require('compression')

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
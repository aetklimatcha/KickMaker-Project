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
const routes = require("./routes/main.js");
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const multer = require('multer');

const { setUTF8Encoding } = require('./middleware/setUTF8Encoding');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



//정적파일 서비스하는 모듈? (css 안됐을때 씀
app.use(express.static(__dirname));
// app.use(express.static('public'));

//swagger
const { swaggerUi, specs } = require("./lib/swagger.js");
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./lib/swagger-output.json");
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(setUTF8Encoding);

//router 폴더 연결
app.use(cookieParser());
app.use(routes);

//304 발생 해결
// app.set("etag", false);
// app.disable('etag');
// const options = { etag : false };

// 서버
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});



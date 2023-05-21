const express = require("express");
const router = express.Router();
const path = require("path");
const req = require('http');
const res = require('express');

const main = require('../controllers/main');
const login = require('../controllers/login')
//url이 빈 상태로 넘어올 경우
router.get('/',main.mainview);

router.get('/demo',main.demoview);

router.get('/login_demo',login.loginview);

//url이 http://localhost:3000/test 인 경우
router.get('/test', (req, res) => {
    res.send('test about');
});

module.exports = router;

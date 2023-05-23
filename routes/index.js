const express = require("express");
const router = express.Router();
const path = require("path");
const req = require('http');
const res = require('express');
const connection = require('../config/mysql');
const main = require('../controllers/main');
const login = require('../controllers/login')
//url이 빈 상태로 넘어올 경우
router.get('/',main.mainview);

router.get('/demo',main.demoview);

router.get('/login_demo',login.loginview);

//ejs 파일들 연결 페이지
router.get('/test', main.testview);
router.get('/match_list', main.match_listview);
router.get('/match_making', main.match_makingview);
router.get('/noMatch', main.noMatchview);
router.get('/signin', main.signinview);
router.get('/signup', main.signupview);

router.post('/createteam', main.createteam);


module.exports = router;

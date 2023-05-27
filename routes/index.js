const express = require("express");
const router = express.Router();
const path = require("path");
const req = require('http');
const res = require('express');
const connection = require('../config/mysql');
const main = require('../controllers/main');
const login = require('../controllers/login')
const signup = require("../controllers/signup");
const match = require("../controllers/match");

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');

//url이 빈 상태로 넘어올 경우
router.get('/',main.mainview);

//ejs 파일들 연결 페이지

router.get('/match-list', main.match_listview);
router.get('/match-making', cookieJwtAuth,main.match_makingview);
router.get('/noMatch', main.noMatchview);
router.get('/signin', main.signinview)
router.get('/signup', main.signupview);
router.get('/team-info',cookieJwtAuth, main.team_infoview);

router.post('/createteam', main.createteam);
router.post('/login',login.login_process);
router.post('/logout',login.logout);
router.post('/signup', signup.signup);
router.post('/match-making', cookieJwtAuth,match.match_making);
//규빈 테스트용 페이지

router.get('/test',cookieJwtAuth,main.testsview);
router.post('/test', cookieJwtAuth,main.testview);

module.exports = router;

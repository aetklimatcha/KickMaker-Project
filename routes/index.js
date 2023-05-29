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
router.get('/', cookieJwtAuth,main.mainview);

//ejs 파일들 연결 페이지

router.get('/match-list',cookieJwtAuth, main.match_listview);
router.get('/match-making', cookieJwtAuth,main.match_makingview);
router.get('/noMatch',cookieJwtAuth, main.noMatchview);
router.get('/matched', cookieJwtAuth,main.matchedview);
router.get('/signin',cookieJwtAuth, main.signinview)
router.get('/signup',cookieJwtAuth, main.signupview);
router.get('/complete',cookieJwtAuth, main.completeview);

router.post('/createteam', main.createteam);
router.post('/login',login.login_process);
router.post('/logout',login.logout);
router.post('/signup', signup.signup);
router.post('/match-making', cookieJwtAuth,match.match_making);
router.post('/complete', cookieJwtAuth,match.insertMatch);
//규빈 테스트용 페이지

router.get('/test',cookieJwtAuth,main.testsview);
router.post('/test', cookieJwtAuth,main.testview);

module.exports = router;

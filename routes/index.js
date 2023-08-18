const express = require("express");
const router = express.Router();
var url = require('url');
const path = require("path");
const req = require('http');
const res = require('express');
const connection = require('../config/mysql');
const main = require('../controllers/main');
const login = require('../controllers/login');
const signup = require("../controllers/signup");
const match = require("../controllers/match");
const review = require("../controllers/review");

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');
const { header } = require('../middleware/header');



//ejs 파일들 연결 페이지
router.get('/', cookieJwtAuth,header,main.mainview);
router.get('/match/:id', cookieJwtAuth,header,main.matchview);
router.get('/match-list',cookieJwtAuth,header, main.match_listview);
router.get('/match-making', cookieJwtAuth,header,main.match_makingview);
router.get('/noMatch',cookieJwtAuth,header, main.noMatchview);
router.get('/matched', cookieJwtAuth,header,main.matchedview);
router.get('/signin',cookieJwtAuth,header, main.signinview)
router.get('/signup',cookieJwtAuth,header, main.signupview);
router.get('/confirm-place',cookieJwtAuth,header, main.confirm_placeview);
router.get('/my-match', cookieJwtAuth,header,main.my_matchview);
router.get('/team-info', cookieJwtAuth,header,main.team_infoview);
router.get('/edit-team', cookieJwtAuth,header,main.edit_teamview);
router.get('/edit-match', cookieJwtAuth,header,main.edit_matchview);
//후기 작성
router.get('/team-review/:pageId', cookieJwtAuth,header,main.team_reviewview);
//등록한 경기 정보
router.get('/registered-match', cookieJwtAuth,header,main.registered_matchview);
router.get('/requested-match', cookieJwtAuth,header,main.requested_matchview);

//test page
router.get('/maptest', cookieJwtAuth,header,main.maptestview);
router.post('/upload',main.upload);


router.post('/tomain', cookieJwtAuth,header,main.tomain);
router.post('/login',login.login_process);
router.post('/logout',login.logout);
router.post('/signup', uploadMiddleware,signup.signup);
router.post('/edit-team', cookieJwtAuth,header, uploadMiddleware, login.edit_team);
router.post('/team-review/:pageId', cookieJwtAuth,header,review.team_review);
router.post('/match-making', cookieJwtAuth,header,match.match_making);
router.post('/request', cookieJwtAuth,header,match.match_request);
router.post('/confirm-place', cookieJwtAuth,header,match.insertMatch);
router.post('/match-accept', cookieJwtAuth,header,match.match_accept);
router.post('/match-reject', cookieJwtAuth,header,match.match_reject);
router.post('/cancel-match', cookieJwtAuth,header,match.cancel_match);


module.exports = router;

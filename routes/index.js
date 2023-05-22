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

//ejs 파일들 연결 페이지
router.get('/test', main.testview);
router.get('/match_list', main.match_listview);
router.get('/match_making', main.match_makingview);
router.get('/noMatch', main.noMatchview);
router.get('/signin', main.signinview);
router.get('/signup', main.signupview);

router.post('/createteam', main.createteam);
/*
// 로그인, 회원가입 핸들러
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register')
    })

router.post('/register',(req,res)=>{
})
router.post('/login',(req,res,next)=>{
  })

// 로그아웃
router.get('/logout',(req,res)=>{
 })
*/
module.exports = router;

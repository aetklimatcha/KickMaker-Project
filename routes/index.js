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

const express = require("express");
const router = express.Router();
const path = require("path");
const req = require('http');
const res = require('express');

//url이 빈 상태로 넘어올 경우
router.get('/', (req, res) => {
    //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
    //index.ejs 렌더링 및 변수 ejs에 넘기기
    res.render(path.join(__dirname + '/../views/main.ejs'),{
        title : "TestTemplate"
    });
}, (req, res) => {
    throw new Error('에러 발생');
});

//url이 http://localhost:3000/test 인 경우
router.get('/test', (req, res) => {
    res.send('test about');
});

// 로그인 핸들러
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register')
    })

// 회원가입
router.post('/register',(req,res)=>{
})
router.post('/login',(req,res,next)=>{
  })

// 로그아웃
router.get('/logout',(req,res)=>{
 })

module.exports = router;
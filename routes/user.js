const express = require("express");
const router = express.Router();
const path = require("path");
const req = require('http');
const res = require('express');
const controller = require('../controllers/login');

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
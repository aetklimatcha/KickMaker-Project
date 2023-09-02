require("dotenv").config({ path: "./config/.env" });

const path = require("path");

const team = require("../models/Team");
const match = require("../models/Match");

const weather = require("../modules/getWeather");
const stadium = require("../modules/getStadium");
const { log } = require("console");


module.exports = {

    mainview: async (req, res) => {
        const isLogin = !!req.user_id;

        try {
            const recentmatch = await new Promise((resolve) => {
                match.getrecentmatch(resolve);
            });

            res.render(path.join(__dirname + '/../views/main.ejs'), {
                isLogin: isLogin,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                recentmatch: recentmatch
            });

        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

    signinview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/signin.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
        //로그인 실패시!!!!
        if (req.query.value == 'fail') {
            console.log("login failed");
        };
    },

    signupview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/signup.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,

        });
    },

    login_process : (req, res) => {
        team.getLoginTeam(req.body.id,req.body.password,function( result ) {
            if(result==null){
                login_fail();
            } else {
                payload = result.user_id;
                login_success();
            }
        });        
        //실패시 실패알람코드 추가필요
        function login_fail () {   
            res.write("<script>alert('로그인에 실패하였습니다.')</script>");
            res.write("<script>window.location=\"/signin\"</script>");
            res.end();
        }

        function login_success () {
            token = jwt.sign(payload,secretKey,options);  
            res.cookie('usertoken',token)
            res.redirect('/')
        }
    },

    logout : (req, res) => {
        res.cookie('usertoken', null, {
            maxAge: 0,
        });
        res.redirect('/')
    },

    signup : (req, res) => {
        if(req.file.filename == null) 
            req.file.filename = 'default.jpg';
        model.insertsignup(req.body.id, req.body.password, req.body.teamname, req.body.represent_name, req.body.hp, req.file.filename,function( result ) {
            res.redirect('/')
        });  
    },

    // test 페이지
    maptestview: async (req, res) => {
        try {

            var day = req.body.day;
            var time = req.body.time;
            var x = 37.65316703684802;
            var y = 127.04835428199415;

            const result = await stadium('서초구'); // stadium 함수의 결과를 기다립니다


            const gameweather = day ? await weather.weatherAPI(day, time, x, y) : null; // weatherAPI 함수의 결과를 기다립니다.

            res.render(path.join(__dirname + '/../views/maptest.ejs'), {
                x: x,
                y: y,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                MAP_KEY: process.env.MAP_KEY,
                weather: gameweather,
                stadiumResult: result, // 결과 배열을 전달합니다.
            });
        } catch (error) {
            console.error(error); // 에러 처리
        }
    },

    upload: async (req, res) => {
        console.log(req.body);

        const result = await stadium('서초구');
        var day = req.body.day;
        var time = req.body.time;
        var x = 37.65316703684802;
        var y = 127.04835428199415;
        const gameweather = day ? await weather.weatherAPI(day, time, x, y) : null; // weatherAPI 함수의 결과를 기다립니다.

        res.json(gameweather);

    },

    tomain: (req, res) => {
        res.cookie('findMatchestoken', null, {
            maxAge: 0,
        });
        res.cookie('myMatchtoken', null, {
            maxAge: 0,
        });
        res.redirect('/')
    },
}
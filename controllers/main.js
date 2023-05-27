const path = require("path");
const model = require("../models/Team");
require('dotenv').config();

module.exports = {

    mainview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/main.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    demoview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/login_demo.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    testview : (req, res) => {
        if(req.user.length) {
            console.log(req.user);
        } else {
            console.log("없당");
        }
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getOneTeam(3,function( result ) {
            res.render(path.join(__dirname + '/../views/test.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    match_listview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/match_list.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    match_makingview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/match_making.ejs'), {
                title: "testtitle",
                Team: result
            });
        });
    },

    noMatchview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/noMatch.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    signinview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getOneTeam(req.user, function( result ) {
            res.render(path.join(__dirname + '/../views/test.ejs'), {
                Team: result
            });
        });
    },

    signupview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/signup.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    testsview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getOneTeam(req.user, function( result ) {
            res.render(path.join(__dirname + '/../views/test.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });
    },

    createteam : (req, res) => {
        // const key = process.env;
        // let token = "";
        // token = jwt.sign(
        //     {
        //         type: "JWT",
                
        //     }
        // )
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.insertTeamtest(req.body.id,req.body.pass,function( result ) {
            console.log(req.body);
            console.log(result);
            //res.send({id:result});
        });    
        res.redirect('/login_demo')
    }


}
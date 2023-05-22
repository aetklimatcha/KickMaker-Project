const path = require("path");
const model = require("../models/model");

module.exports = {

    mainview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/main.ejs'), {
                title: "testtitle",
                Team: result
            });
            console.log(result);
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
            console.log(result);
        });
    },

    testview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/test.ejs'), {
                title: "testtitle",
                Team: result
            });
            console.log(result);
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
            console.log(result);
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
            console.log(result);
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
            console.log(result);
        });
    },

    signinview : (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/signin.ejs'), {
                title: "testtitle",
                Team: result
            });
            console.log(result);
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
            console.log(result);
        });
    }


}
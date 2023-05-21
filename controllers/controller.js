const path = require("path");
const model = require("../models/model");

exports.mainview = (req, res) => {
    //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
    //index.ejs 렌더링 및 변수 ejs에 넘기기
    model.getAllTeam(function( result ) {
        res.render(path.join(__dirname + '/../views/main.ejs'), {
            title: "testtitle",
            Team: result
        });
        console.log(result);
    });

    model.getOneTeam(2, function( result ) {
        res.render(path.join(__dirname + '/../views/main.ejs'), {
            Teamone: result
        });
    });

};
const path = require("path");
const model = require("../models/model");

exports.mainview = (req, res) => {
    console.log('ans:'+model.getTeam(1));
    //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
    //index.ejs 렌더링 및 변수 ejs에 넘기기
    res.render(path.join(__dirname + '/../views/main.ejs'), {
        title: "TestTemplate",
        Team: model.getTeam(1)
    });
}, (req, res) => {
    throw new Error('에러 발생');
};
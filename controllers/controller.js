const path = require("path");
const model = require("../models/model");

exports.mainview = (req, res) => {
    //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
    //index.ejs 렌더링 및 변수 ejs에 넘기기
    model.getTeam(function( result ) {
        res.render(path.join(__dirname + '/../views/main.ejs'), {
            title: "testtitle",
            Team: result
        });
        console.log(result);
    });

    // res.render(path.join(__dirname + '/../views/main.ejs'), {
    //     title: "TestTemplate",
    //     Team: model.getTeam((error, result)=>{
    //         if (error) {
    //             res.status(500).send('Internal Server Error');
    //         } else {
    //             res.send(result);
    //         }    
    //     })
    // });
};
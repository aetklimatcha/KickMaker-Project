const path = require("path");
const team = require("../models/Team");
const review = require("../models/TeamReview");
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

module.exports= {
    loginview : (req, res) => {
        team.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/signin.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
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
            var string = 'fail';
            console.log("login 실패 at login.js")
            res.redirect('/signin/?value='+string);
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
    
    edit_team : async (req, res) => {
        try {
    // {
    // id: 'gangdong',
    // password: '2222',
    // teamname: 'FC강동',
    // represent_name: '허이구',
    // hp: '010-2222-2222'
    // }

        if (req.file.filename != null) {
            console.log(1)
            var new_image = req.file.filename;
            var old_image;
            const result = await new Promise((resolve)=>{
                team.getOneTeam(req.user_id, resolve);
            });

            // team.getOneTeam(req.user_id, function(result){
            //     old_image = result.logo_image;
            // });
            
            old_image = result.logo_image;
        }

        console.log(new_image);
        console.log(old_image);

        res.redirect('/edit-team');

        // team.updateTeam(req.body, req.user_id,function( result ) {
        //     console.log(new_image);
        //     console.log(old_image);
        //     res.cookie('usertoken', null, {
        //         maxAge: 0,
        //     });
        //     res.redirect('/');
        // });
        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },


    team_review : (req, res) => {

        var result = new Object();

        // team에다가 +3 +1 +0 반영하기, 매너점수 반영하기 
        // { result: '승리', manner_rate: '나쁨' }
        switch (req.body.result) {
            case '승리':
                result.winpoint = 3;
                result.result = `win = win+1 `
                break;
            case '무승부':
                result.winpoint = 1;
                result.result = `draw = draw+1 `
                break;
            case '패배':
                result.winpoint = 0;
                result.result = `lose = lose+1 `
                break;
        } 

        switch (req.body.manner_rate) {
            case '매우 좋음':
                result.mannerpoint = 2;
                break;
            case '좋음':
                result.mannerpoint = 1;
                break;
            case '보통':
                result.mannerpoint = 0;
                break;
            case '나쁨':
                result.mannerpoint = -1;
                break;
            case '매우 나쁨':
                result.mannerpoint = -2;
                break;
        }
        console.log(req.body);
        console.log(result);

        team.updateAfterMatch(result, req.user_id, function(back) {
            review.insertTeamReview(req.params.pageId, req.user_id, req.body.result, req.body.manner_rate, function( result ) {
                res.redirect('/my-match');
            });  
        });
    },
}

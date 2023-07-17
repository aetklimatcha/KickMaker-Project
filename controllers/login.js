const path = require("path");
const model = require("../models/Team");
const review = require("../models/TeamReview");
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

module.exports= {
    loginview : (req, res) => {
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/signin.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });  
    },

    login_process : (req, res) => {
        model.getLoginTeam(req.body.id,req.body.password,function( result ) {
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
            res.redirect('/signin/?value='+string);
        }

        function login_success () {
            token = jwt.sign(payload,secretKey,options);  
            console.log(token);
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
    
    edit_team :(req, res) => {
        // {
        //   id: 'dobong3344',
        //   password: '11123',
        //   teamname: 'daf',
        //   represent_name: 'zzz',
        //   hp: '123',
        //   profile_pic: ''
        // }

        console.log(req.body);
        model.updateTeam(req.body, req.user_id,function( result ) {
            res.cookie('usertoken', null, {
                maxAge: 0,
            });
            res.redirect('/');
        });  
    },
    team_review : (req, res) => {

        review.insertTeamReview(req.params.pageId,req.user_id,req.body.result,req.body.manner_rate, function( result ) {
            res.redirect('/my-match');
        });  
    },
}

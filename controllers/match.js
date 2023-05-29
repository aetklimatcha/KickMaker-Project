const path = require("path");
const model = require("../models/Match");
const findMatch = require("../modules/findMatch");
const { match } = require("assert");
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;
require('dotenv').config();

module.exports = {

    match_making : (req, res) => {
        
        var match_place = req.body.district;       
        var gameDate = req.body.gameDate;
        var match_time_start = req.body.gameStartTime;
        var match_time_end = req.body.gameEndTime;



        var info = {
            place:match_place,
            date:gameDate,
            starttime:match_time_start,
            endtime:match_time_end
        };

        findMatch.findMatch(info, (matchData, matchAvailability)=>{
            //results : 경기 가능 팀들의 {id,가능장소,겹치는시간}
            //matchAvailability : 경기할 팀 여부 true: 있음, false: 없음

            console.log(info);
            console.log(JSON.parse(JSON.stringify(matchData)));
            //매치가 없는 경우
            if (matchAvailability==false) {
                //payload = JSON.parse(JSON.stringify(info));
                payload = JSON.stringify(info);
                token = jwt.sign(payload,secretKey,options);
                res.cookie('myMatchtoken',token);
                res.redirect('/noMatch');
            //매치가 있는 경우
            } else if (matchAvailability==true) {
                //payload = JSON.parse(JSON.stringify(matchData));
                payload = JSON.stringify(matchData);
                token = jwt.sign(payload,secretKey,options);
                res.cookie('findMatchestoken',token);
                res.redirect('/');
            }
        });
    },

    noMatch : (req,res) => {

        var currentDate = new Date();
        var created = currentDate.toISOString().replace('T', ' ').substr(0, 19);
        //nomatch 페이지에서 등록하기 누를 경우 실행할 것
        model.insertMatch(req.user_id, gameDate,match_place, created,match_time_start,match_time_end,function( result ) { 

        });  

    }
}
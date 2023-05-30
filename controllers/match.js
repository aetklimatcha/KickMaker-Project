const path = require("path");
const match = require("../models/Match");
const notif = require("../models/Notification");
const findMatch = require("../modules/findMatch");
//const { match } = require("assert");
const jwt = require('jsonwebtoken');
const { create } = require("domain");
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
            //매치가 없는 경우
            if (matchAvailability==false) {
                //payload = JSON.parse(JSON.stringify(info));
                payload = JSON.stringify(info);
                token = jwt.sign(payload,secretKey,options);
                res.cookie('myMatchtoken',token);
                res.redirect('/noMatch');
                console.log("매치없음");

            //매치가 있는 경우
            } else if (matchAvailability==true) {
                //payload = JSON.parse(JSON.stringify(matchData));
                // console.log(matchData);
                payload = JSON.stringify(matchData);
                token = jwt.sign(payload,secretKey,options);
                res.cookie('findMatchestoken',token);
                res.redirect('/matched');
                console.log("매치있음");
            }
        });
    },

    insertMatch : (req,res) => {
        console.log("이거요");
        console.log(req.myMatch);
        var home_userid = req.user_id;
        var match_date = req.myMatch.date;
        var match_place = req.myMatch.place;
        var match_time_start = req.myMatch.starttime;
        var match_time_end = req.myMatch.endtime;

        const now = new Date(); // 현재 시간
        const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 utc로 변환한 밀리세컨드값
        const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간은 UTC보다 9시간 빠름(9시간의 밀리세컨드 표현)
        const koreaNow = new Date(utcNow + koreaTimeDiff); // utc로 변환된 값을 한국 시간으로 변환시키기 위해 9시간(밀리세컨드)를 더함
        const created = koreaNow.toISOString().replace('T', ' ').substr(0, 19);

        
        match.insertMatch(home_userid, match_date, match_place, match_time_start, match_time_end, created, function (result) {
            res.redirect('/complete');
        });
    },

    match_request : (req,res) => {
        request_userid = req.user_id;
        console.log("넘어오는것");
        console.log(req.body);
        //밑에 매개변수 넘겨줄것
        
        notif.insertNotification(match_id, receive_userid, request_userid, request_teamname, "요청", function(notiID){
            console.log("알림등록"+notiID);
            res.redirect('/');
        });
    },
    
}
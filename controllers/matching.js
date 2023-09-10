require("dotenv").config({ path: "./config/.env" });

const path = require("path");

const team = require("../models/Team");
const match = require("../models/Match");
const notif = require("../models/Notification");
const stadium = require("../modules/getStadium");
const findMatch = require("../modules/findMatch");

const jwt = require('jsonwebtoken');
const dayjs = require("dayjs");
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

module.exports = {

    match_listview: async (req, res) => {
        try {

            var allNomatches = await new Promise((resolve) => {
                match.getAllnoMatch(req.user_id, resolve)
            });

            var homeUserIdArray = []
            allNomatches.forEach(match => {
                homeUserIdArray.push(match.home_userid);
                const value = dayjs(match.match_date).format("YYYY-MM-DD");
                match.match_date = value;
            })

            const hometeaminfo = await new Promise((resolve) => {
                team.getQueryTeam(homeUserIdArray, resolve);
            });

            const homeTeamPromises = allNomatches.map(async match => {
                var foundTeam = hometeaminfo.find(team => team.user_id == match.home_userid);
                match.hometeamInfo = foundTeam;
            });


            await Promise.all(homeTeamPromises);

            console.log(allNomatches)
            res.render(path.join(__dirname + '/../views/match_list.ejs'), {
                loginTeam: req.header.loginresult,
                Matches: allNomatches,
                notifications: req.header.notifications,
            });

        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    match_makingview: async (req, res) => {
        try {
            if (req.user_id == null) {
                res.redirect('/signin')
            } else {
                res.render(path.join(__dirname + '/../views/match_making.ejs'), {
                    loginTeam: req.header.loginresult,
                    notifications: req.header.notifications,
                });
            }
        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    match_making: (req, res) => {
        try {
            var match_place = req.body.district;
            var gameDate = req.body.gameDate;
            var gameTime = req.body.gameTime;

            //매치메이킹 정보와 신청자의 정보 조합
            team.getOneTeam(req.user_id, (user) => {
                var info = {
                    user_id: req.user_id,
                    win_score: user.win_score,
                    manner_score: user.manner_score,
                    place: match_place,
                    date: gameDate,
                    time: gameTime
                };

                findMatch.findMatch(info, (matchData, matchAvailability) => {
                    //results : 경기 가능 팀들의 {id,가능장소,겹치는시간}
                    //matchAvailability : 경기할 팀 여부 true: 있음, false: 없음

                    //매치가 없는 경우
                    //등록하려던 정보 담아 토큰으로 넘김
                    if (matchAvailability == false) {
                        //payload = JSON.parse(JSON.stringify(info));
                        payload = JSON.stringify(info);
                        token = jwt.sign(payload, secretKey, options);
                        res.cookie('myMatchtoken', token);

                        res.redirect('/matching/noMatch');
                        console.log("매치없음 at findmatch at match.js");

                        //매치가 있는 경우
                        //찾은 매치 정보들 담아 토큰으로 넘김 (수정 필요!! 토큰 크기 과다)
                    } else if (matchAvailability == true) {
                        //payload = JSON.parse(JSON.stringify(matchData));
                        // console.log(matchData);
                        payload = JSON.stringify(matchData);
                        token = jwt.sign(payload, secretKey, options);
                        res.cookie('findMatchestoken', token);
                        res.redirect('/matching/matched');
                        console.log("매치있음 at findmatch at match.js");
                    }
                });
            })
        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    noMatchview: async (req, res) => {
        try {
            res.render(path.join(__dirname + '/../views/noMatch.ejs'), {
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
            });
        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    matchedview: async (req, res) => {
        try {
            result = req.findMatches;
            res.render(path.join(__dirname + '/../views/matched.ejs'), {
                loginTeam: req.header.loginresult,
                findTeams: result,
                notifications: req.header.notifications,
            });
        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    confirm_placeview: async (req, res) => {
        try {
            result = req.myMatch;

            //기본값 서초구로 설정해놨음!!!!!!!!!!

            const stadiums = await stadium(result.place); // stadium 함수의 결과를 기다립니다.

            if (req.query.nx != undefined) {
                nx = req.query.nx;
                ny = req.query.ny;
            }

            res.render(path.join(__dirname + '/../views/confirm_place.ejs'), {
                loginTeam: req.header.loginresult,
                myMatch: result,
                notifications: req.header.notifications,
                MAP_KEY: process.env.MAP_KEY,
                stadium: stadiums,
            });

        } catch (error) {
            console.error(error);
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    insertMatch: (req, res) => {
        try {
            var home_userid = req.user_id;
            var match_date = req.myMatch.date;
            var match_place = req.myMatch.place;
            var match_time = req.myMatch.time;

            var stadium = req.body.stadium;
            var nx = req.body.nx;
            var ny = req.body.ny;

            match.insertMatch(home_userid, match_date, match_place, match_time, stadium, nx, ny, function (result) {
                res.redirect('/game/registered-match');
            });
        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },

    match_request: (req, res) => {
        try {
            // {
            //   home_userid: '2',
            //   match_id: '16',
            //   match_date: '2023-05-18',
            //   match_place: '강동구,강북구',
            //   match_time: '12:14',
            //   teamname: 'FC강동'
            // }
            match_id = req.body.match_id;
            request_userid = req.user_id; //cookie에서 로그인 사용자
            receive_userid = req.body.home_userid;
            request_teamname = req.body.teamname;
            match_date = req.body.match_date
            match_time = req.body.match_time
            match_place = req.body.match_place //얘 하나일 때 배열로 넣기?


            //notif 테이블에다가 match_date부터 match_place, overlap_start도 넣어서 
            team.getOneTeam(request_userid, function (result) {
                request_teamname = result.teamname;
                notif.insertNotification(match_id, receive_userid, request_userid, request_teamname, "요청", match_date, match_time, match_place, function (notiID) {
                    res.redirect('/');
                });
            });
        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    },


}
require("dotenv").config({ path: "./config/.env" });

const path = require("path");
const axios = require('axios');

const team = require("../models/Team");
const match = require("../models/Match");
const notif = require("../models/Notification");
const review = require("../models/TeamReview");
const weather = require("../modules/getWeather");
const stadium = require("../modules/getStadium");
const { log } = require("console");


module.exports = {

    mainview: async (req, res) => {
        const isLogin = !!req.user_id;

        try {
            const recentmatch = await new Promise((resolve) => {
                match.getrecentmatch(resolve);
            });

            res.render(path.join(__dirname + '/../views/main.ejs'), {
                isLogin: isLogin,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                recentmatch: recentmatch
            });

        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

    matchview: async (req, res) => {
        try {
            const matchdata = await new Promise((resolve) => {
                match.getmatch_id(req.params.id, resolve);
            });

            const hometeam = await new Promise((resolve) => {
                team.getOneTeam(matchdata.home_userid, resolve);
            });

            const awayteam = await new Promise((resolve) => {
                team.getOneTeam(matchdata.away_userid, resolve);
            });

            res.render(path.join(__dirname + '/../views/match.ejs'), {
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                matchdata: matchdata,
                hometeam: hometeam,
                awayteam: awayteam,
            });
        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

    my_matchview: async (req, res) => {
        try {  

            const matches = await new Promise((resolve) => {
                match.getmymatch(req.user_id, resolve);
            });

            if (matches == null) throw 'error';

            //매치있는 경우 홈팀, 어웨이팀 정보 넣기, (날씨 정보 배열 넣기 예정)
            if (matches != null) {
                for (let i = 0; i < matches.length; i++) {
                    const homeTeam = await new Promise((resolve) => {
                        team.getOneTeam(matches[i].home_userid, resolve);
                    });
                    matches[i].home_teamname = homeTeam.teamname;

                    const awayTeam = await new Promise((resolve) => {
                        team.getOneTeam(matches[i].away_userid, resolve);
                    });
                    matches[i].away_teamname = awayTeam.teamname;

                    var day = matches[i].match_date.replace(/-/g, '');
                    var timeArray = matches[i].match_time.split(':')
                    var time = timeArray[0] + timeArray[1];
                    var x = matches[i].nx;
                    var y = matches[i].ny;

                    const gameweather = await weather.weatherAPI(day, time, y, x);

                    matches[i].weather = gameweather;
                }
            }
            console.log(matches);
            res.render(path.join(__dirname + '/../views/my_match.ejs'), {
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                Matches: matches,
            });
        } catch (error) {
            console.error(error);
            res.write("<script>alert('권한이 없습니다')</script>");
            res.write("<script>window.location=\"/\"</script>");
            // Handle error response
        }
    },

    match_listview: async (req, res) => {
        try {

            var allNomatches = await new Promise((resolve) => {
                match.getAllnoMatch(req.user_id ,resolve)
            });

            var homeUserIdArray = []
            allNomatches.forEach(match => {
                homeUserIdArray.push(match.home_userid);
            })

            // const homeTeamPromises = allNomatches.forEach(async match => {
            //     var hometeaminfo = await new Promise((resolve) => {
            //         team.getOneTeam(match.home_userid, resolve)
            //         console.log('ms')
            //     });
            //     match.hometeamInfo = hometeaminfo;
            //     console.log('for')
            // })

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
        }
    },

    match_makingview: async (req, res) => {
        if (req.user_id == null) {
            res.redirect('/signin')
        } else {
                    res.render(path.join(__dirname + '/../views/match_making.ejs'), {
                        loginTeam: req.header.loginresult,
                        notifications: req.header.notifications,
                    });
        }
    },

    noMatchview: async (req, res) => {

        res.render(path.join(__dirname + '/../views/noMatch.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
    },

    matchedview: async (req, res) => {
        result = req.findMatches;
        res.render(path.join(__dirname + '/../views/matched.ejs'), {
            loginTeam: req.header.loginresult,
            findTeams: result,
            notifications: req.header.notifications,
        });
    },

    confirm_placeview: async (req, res) => {
        try {
            result = req.myMatch;

            //기본값 서초구로 설정해놨음!!!!!!!!!!

            const stadiums = await stadium('서초구'); // stadium 함수의 결과를 기다립니다.

            var nx = 126.95518930412466;
            var ny = 37.602181608910584;

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
                nx: nx,
                ny: ny,
            });

        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

    team_infoview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/team_info.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
    },

    edit_teamview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/edit_team.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
    },

    team_reviewview: async (req, res) => {

        //1. pageId(match_id)로 조회, home과 away에 userid 있나 조회 후 없으면 '권한 없습니다' return
        const review_match_info = await new Promise((resolve) => {
            match.getmatch_id(req.params.pageId, resolve);
        });

        var review_info = await new Promise((resolve) => {
            review.getreview_matchid(req.params.pageId, resolve);
        });

        // const review_info = await new Promise((resolve) => {
        //     review.getreview_matchid(req.params.pageId, (result, secondArg) => {
        //         resolve({ result, secondArg });
        //     });
        // });


        var reviewWritten = false;

        for (var i = 0; i < review_info.length; i++) {
            if (req.user_id == review_info[i].user_id) {
                reviewWritten = true;
            }
        }


        if (review_match_info.home_userid != req.user_id && review_match_info.away_userid != req.user_id) {
            // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write("<script>alert('권한이 없습니다')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
            return;
        }


        //2. (match_id로) review 조회, 이미 있으면 작성했습니다 return, 
        else if (reviewWritten) {
            res.write("<script>alert('이미 리뷰를 작성하셨습니다.')</script>");
            res.write("<script>window.location=\"/team/my-match\"</script>");
            res.end();
            return;
        }

        else {
            var opponent_id = req.user_id == review_match_info.home_userid ? review_match_info.home_userid : review_match_info.away_userid;
            // console.log ('pageId:');
            // console.log (req.params.pageId);
            // console.log ('loginTeam:');
            // console.log (req.header.loginresult);
            // console.log ('notifications:');
            // console.log (req.header.loginresult);
            // console.log ('Match:');
            // console.log (review_match_info);
            // console.log ('opponent_id:');
            // console.log (opponent_id);

            res.render(path.join(__dirname + '/../views/team_review.ejs'), {
                pageId: req.params.pageId,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                Match: review_match_info,
                opponent_id: opponent_id,
            })
        }
    },

    edit_matchview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/edit_match.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
    },

    signinview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/signin.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
        //로그인 실패시!!!!
        if (req.query.value == 'fail') {
            console.log("login failed");
        };
    },

    signupview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/signup.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
            
        });
    },

    requested_matchview: async (req, res) => {

        var notifications = await new Promise((resolve) => {
            notif.getnotif_userid(req.user_id, resolve);
        });

        // let count = 0;
        const updatedNotifications = []; // 수정된 notifications를 저장할 배열
        let counter = 0; // 완료된 비동기 작업의 수를 추적하는 카운터 변수

        notifications.forEach(function (notification, i) {
            match.getmatch_id(notification.match_id, function (OG) {
                const date = new Date(OG.match_date);
                //const formattedDate = date.toISOString().split("T")[0];
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                const updatedNotification = {
                    notif_id: notification.notif_id,
                    requesttype: notification.requesttype,
                    match_id: notification.match_id,
                    date: formattedDate,
                    time: notification.match_time,
                    RQuserid: notification.request_userid,
                    RQteamname: notification.request_teamname,
                    place: notification.match_place,
                };
                updatedNotifications[i] = updatedNotification;
                counter++;

                if (counter === notifications.length) {
                    console.log(updatedNotifications)
                    // 모든 비동기 작업이 완료되었을 때 렌더링 및 응답 처리를 수행
                    res.render(path.join(__dirname + '/../views/requested_match.ejs'), {
                        loginTeam: req.header.loginresult,
                        notifications: req.header.notifications,
                        matchinfo: updatedNotifications,
                    });
                }
            });
        });
    },

    registered_matchview: async (req, res) => {
        const result = await new Promise((resolve) => {
            match.gethome_id(req.user_id, resolve);
        });
        res.render(path.join(__dirname + '/../views/registered_match.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
            Matches: result,
        });
    },

    // test 페이지
    maptestview: async (req, res) => {
        try {

            var day = req.body.day;
            var time = req.body.time;
            var x = 37.65316703684802;
            var y = 127.04835428199415;

            const result = await stadium('서초구'); // stadium 함수의 결과를 기다립니다


            const gameweather = day ? await weather.weatherAPI(day, time, x, y) : null; // weatherAPI 함수의 결과를 기다립니다.

            res.render(path.join(__dirname + '/../views/maptest.ejs'), {
                x: x,
                y: y,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                MAP_KEY: process.env.MAP_KEY,
                weather: gameweather,
                stadiumResult: result, // 결과 배열을 전달합니다.
            });
        } catch (error) {
            console.error(error); // 에러 처리
        }
    },

    upload: async (req, res) => {
        console.log(req.body);

        const result = await stadium('서초구');
        var day = req.body.day;
        var time = req.body.time;
        var x = 37.65316703684802;
        var y = 127.04835428199415;
        const gameweather = day ? await weather.weatherAPI(day, time, x, y) : null; // weatherAPI 함수의 결과를 기다립니다.

        res.json(gameweather);

    },

    tomain: (req, res) => {
        res.cookie('findMatchestoken', null, {
            maxAge: 0,
        });
        res.cookie('myMatchtoken', null, {
            maxAge: 0,
        });
        res.redirect('/')
    },
}
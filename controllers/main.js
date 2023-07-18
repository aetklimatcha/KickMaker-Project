require("dotenv").config({ path: "./config/.env" });

const path = require("path");
const model = require("../models/Team");
const match = require("../models/Match");
const notif = require("../models/Notification");

const weather = require("../modules/getWeather");

module.exports = {

    mainview: (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        if (req.user_id) {
            isLogin = true;
        } else if (!req.user_id) {
            isLogin = false;
        }
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/main.ejs'), {
                    isLogin: isLogin,
                    loginTeam: loginresult,
                    notifications: notifications
                });
            });
        });
    },

    matchview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                match.getmatch_id(req.params.id, function (matchdata) {
                    model.getOneTeam(matchdata.home_userid, function (hometeam) {
                        model.getOneTeam(matchdata.away_userid, function (awayteam) {

                            res.render(path.join(__dirname + '/../views/match.ejs'), {
                                loginTeam: loginresult,
                                notifications: notifications,
                                matchdata: matchdata,
                                hometeam: hometeam,
                                awayteam: awayteam,
                            });
                        })
                    });
                });
            });
        });
    },

    my_match2view: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                match.getmymatch(req.user_id, function (matches) {

                    if (matches != null) {
                        for (var i = 0; i < matches.length; i++) {
                            matches[i].home_teamname = model.getOneTeam(matches[i].home_userid, function (team) { team.teamname })
                            matches[i].away_teamname = model.getOneTeam(matches[i].away_userid, function (team) { team.teamname })
                        }
                    }
                    res.render(path.join(__dirname + '/../views/my_match.ejs'), {
                        loginTeam: loginresult,
                        notifications: notifications,
                        Matches: matches,
                    });
                });
            });
        });
    },

    my_matchview: async (req, res) => {
        try {
            const notifications = await new Promise((resolve) => {
                notif.getnotif_userid(req.user_id, resolve);
            });

            const loginresult = await new Promise((resolve) => {
                model.getOneTeam(req.user_id, resolve);
            });

            const matches = await new Promise((resolve) => {
                match.getmymatch(req.user_id, resolve);
            });

            if (matches != null) {
                for (let i = 0; i < matches.length; i++) {
                    const homeTeam = await new Promise((resolve) => {
                        model.getOneTeam(matches[i].home_userid, resolve);
                    });
                    matches[i].home_teamname = homeTeam.teamname;

                    const awayTeam = await new Promise((resolve) => {
                        model.getOneTeam(matches[i].away_userid, resolve);
                    });
                    matches[i].away_teamname = awayTeam.teamname;
                }
            }
            res.render(path.join(__dirname + '/../views/my_match.ejs'), {
                loginTeam: loginresult,
                notifications: notifications,
                Matches: matches,
            });
        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },


    match_listview: (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                match.getAllMatch(function (result) {
                    res.render(path.join(__dirname + '/../views/match_list.ejs'), {
                        loginTeam: loginresult,
                        Team: result,
                        notifications: notifications,
                    });
                });
            });
        });
    },

    match_makingview: (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        if (req.user_id == null) {
            res.redirect('/signin')
        } else {
            notif.getnotif_userid(req.user_id, function (notifications) {
                model.getOneTeam(req.user_id, function (loginresult) {
                    res.render(path.join(__dirname + '/../views/match_making.ejs'), {
                        title: "testtitle",
                        loginTeam: loginresult,
                        notifications: notifications,
                    });
                });
            });
        }
    },

    noMatchview: (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                model.getAllTeam(function (result) {
                    res.render(path.join(__dirname + '/../views/noMatch.ejs'), {
                        loginTeam: loginresult,
                        Team: result,
                        notifications: notifications,
                    });
                });
            });
        });
    },

    matchedview: (req, res) => {

        result = req.findMatches;
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/matched.ejs'), {
                    loginTeam: loginresult,
                    findTeams: result,
                    notifications: notifications,
                });
            });
        });
    },

    confirm_placeview: (req, res) => {
        result = req.myMatch;
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/confirm_place.ejs'), {
                    loginTeam: loginresult,
                    myMatch: result,
                    notifications: notifications,
                    MAP_KEY: process.env.MAP_KEY,
                });
            });
        });
    },

    team_infoview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/team_info.ejs'), {
                    loginTeam: loginresult,
                    notifications: notifications,
                });
            });
        });
    },

    edit_teamview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/edit_team.ejs'), {
                    loginTeam: loginresult,
                    notifications: notifications,
                });
            });
        });
    },

    team_reviewview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/team_review.ejs'), {
                    pageId: req.params.pageId,
                    loginTeam: loginresult,
                    notifications: notifications,
                });
            });
        });
    },

    edit_matchview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/edit_match.ejs'), {
                    loginTeam: loginresult,
                    notifications: notifications,
                });
            });
        });
    },


    signinview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/signin.ejs'), {
                    loginTeam: loginresult,
                    notifications: notifications,
                });
                //로그인 실패시!!!!
                if (req.query.value == 'fail') {
                    console.log("login failed");
                };
            });
        });
    },

    signupview: (req, res) => {
        //상대경로 사용할 것 (팀원들 각자 디렉토리 다르니 절대경로 안돼)
        //index.ejs 렌더링 및 변수 ejs에 넘기기
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                model.getAllTeam(function (result) {
                    res.render(path.join(__dirname + '/../views/signup.ejs'), {
                        loginTeam: loginresult,
                        Team: result,
                        notifications: notifications,
                    });
                });
            });
        });
    },

    requested_matchview: (req, res) => {
        model.getOneTeam(req.user_id, function (loginresult) {
            notif.getnotif_userid(req.user_id, function (notifications) {
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
                            RQplace: notification.match_place,
                            RQstart: notification.overlap_start,
                            //RQend : ,
                            OGplace: OG.match_place,
                            OGstart: OG.match_time_start,
                            OGend: OG.match_time_end,
                        };
                        updatedNotifications[i] = updatedNotification;
                        counter++;

                        if (counter === notifications.length) {
                            console.log(updatedNotifications)
                            // 모든 비동기 작업이 완료되었을 때 렌더링 및 응답 처리를 수행
                            res.render(path.join(__dirname + '/../views/requested_match.ejs'), {
                                loginTeam: loginresult,
                                notifications: notifications,
                                matchinfo: updatedNotifications,
                            });
                        }
                    });
                });
            });
        });
    },

    registered_matchview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                match.gethome_id(req.user_id, function (result) {
                    res.render(path.join(__dirname + '/../views/registered_match.ejs'), {
                        loginTeam: loginresult,
                        notifications: notifications,
                        Matches: result,
                    });
                });
            });
        });
    },

    // // test 페이지
    // maptestview: (req, res) => {
    //     notif.getnotif_userid(req.user_id, function (notifications) {
    //         model.getOneTeam(req.user_id, function (loginresult) {
    //             var day = '20230715'
    //             var time = '1530'
    //             var x = 37;
    //             var y = 127;
    //             var gameweather = weather.weatherAPI(day, time, x, y);

    //             res.render(path.join(__dirname + '/../views/maptest.ejs'), {
    //                 loginTeam: loginresult,
    //                 notifications: notifications,
    //                 MAP_KEY: process.env.MAP_KEY,
    //                 weather: gameweather,
    //             });
    //         });
    //     });
    // },

    // test 페이지
    maptestview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                var day = '20230716'
                var time = '1530'
                var x = 37.65316703684802;
                var y = 127.04835428199415;
                weather.weatherAPI(day, time, x, y)
                    .then(gameweather => {
                        res.render(path.join(__dirname + '/../views/maptest.ejs'), {
                            x: x,
                            y: y,
                            loginTeam: loginresult,
                            notifications: notifications,
                            MAP_KEY: process.env.MAP_KEY,
                            weather: gameweather,
                        });
                    })
                    .catch(error => {
                        // 에러 처리 로직
                    });

            });
        });
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
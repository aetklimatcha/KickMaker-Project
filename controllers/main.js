const path = require("path");
const model = require("../models/Team");
const match = require("../models/Match");
const notif = require("../models/Notification");

require('dotenv').config();

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
        console.log(req.query.id)
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                match.getmatch_id(req.query.id, function (matchdata) {
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
                    //console.log(result);
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

    completeview: (req, res) => {
        result = req.myMatch;
        console.log(result);
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                res.render(path.join(__dirname + '/../views/complete.ejs'), {
                    loginTeam: loginresult,
                    myMatch: result,
                    notifications: notifications,
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

    my_matchview: (req, res) => {
        notif.getnotif_userid(req.user_id, function (notifications) {
            model.getOneTeam(req.user_id, function (loginresult) {
                match.getmymatch(req.user_id, function (matches) {
                    res.render(path.join(__dirname + '/../views/my_match.ejs'), {
                        loginTeam: loginresult,
                        notifications: notifications,
                        matches: matches,
                    });
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
                    //console.log(result);
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
                            notif_id : notification.notif_id,
                            requesttype : notification.requesttype,
                            match_id : notification.match_id,
                            date: formattedDate,
                            RQuserid : notification.request_userid,
                            RQteamname : notification.request_teamname,
                            RQplace : notification.match_place,
                            RQstart : notification.overlap_start,
                            //RQend : ,
                            OGplace: OG.match_place,
                            OGstart: OG.match_time_start,
                            OGend: OG.match_time_end,
                        };
                        updatedNotifications[i] = updatedNotification;
                        counter++;

                        if (counter === notifications.length) {
                            // 모든 비동기 작업이 완료되었을 때 렌더링 및 응답 처리를 수행
                            res.render(path.join(__dirname + '/../views/requested_match.ejs'), {
                                loginTeam: loginresult,
                                notifications: notifications, 
                                matchinfo : updatedNotifications,
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
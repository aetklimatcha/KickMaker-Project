require("dotenv").config({ path: "./config/.env" });

const path = require("path");

const team = require("../models/Team");
const match = require("../models/Match");
const notif = require("../models/Notification");
const review = require("../models/TeamReview");
const weather = require("../modules/getWeather");
const { log } = require("console");


module.exports = {
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

    requested_matchview: async (req, res) => {
        try {
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
                        // 모든 비동기 작업이 완료되었을 때 렌더링 및 응답 처리를 수행
                        res.render(path.join(__dirname + '/../views/requested_match.ejs'), {
                            loginTeam: req.header.loginresult,
                            notifications: req.header.notifications,
                            matchinfo: updatedNotifications,
                        });
                    }
                });
            });
        } catch (err) {
            console.log('requested match 에러');
            console.log(err);
            res.write("<script>alert('/requested match에서 에러 발생')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
            return;
        }
    },

    edit_matchview: async (req, res) => {

        const edit_match_info = await new Promise((resolve) => {
            match.getmatch_id(req.params.pageId, resolve);
        });
        if (edit_match_info.home_userid != req.user_id) {
            // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write("<script>alert('권한이 없습니다')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
            return;
        }

        res.render(path.join(__dirname + '/../views/edit_match.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
            Match: edit_match_info
        });
    },

    edit_match: async (req, res) => {
        try {
            data = req.body;

            data.match_id = req.params.pageId;

            match.updateMatch(req.body, function (result) {
                res.redirect('/game/registered-match');
            });
        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

    reviewview: async (req, res) => {
        const messageCrypt = require('../modules/messageCrypt');
        const queryId = messageCrypt.decryptString(req.query.id);

        //1. pageId(match_id)로 조회, home과 away에 userid 있나 조회 후 없으면 '권한 없습니다' return
        const review_match_info = await new Promise((resolve) => {
            match.getmatch_id(req.params.pageId, resolve);
        });

        var review_info = await new Promise((resolve) => {
            review.getreview_matchid(req.params.pageId, resolve);
        });

        var reviewWritten = false;

        for (var i = 0; i < review_info.length; i++) {
            if (req.user_id == review_info[i].user_id) {
                reviewWritten = true;
            }
        }

        //0. 로그인 하지 않았을 때
        if (req.user_id == null) {
            const originalUrl = req._parsedOriginalUrl.path;
            res.redirect(`/signin?redirection=${originalUrl}`)
        }
        //1. 자신의 qr로 들어온 것이 아닐때
        else if (queryId != req.user_id) {
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
            var opponent_id = (req.user_id == review_match_info.home_userid) ? review_match_info.away_userid : review_match_info.home_userid;
        
            var matchTeams = await new Promise((resolve) => {
                team.getTwoTeam( opponent_id,req.user_id, resolve);
            });

            // 로그인 유저팀과, 상대팀 구분
            var userTeam = matchTeams.find(team => team.user_id == req.user_id);
            var opponentTeam = matchTeams.find(team => team.user_id != req.user_id);

            //Match로 한번에 넘기기 위해서 담음
            review_match_info.userTeam = userTeam;
            review_match_info.opponentTeam = opponentTeam;

            //홈인지 어웨이인지 여부
            const isHomeTeam = (req.user_id == review_match_info.home_userid) ? 'home' : 'away';

            res.render(path.join(__dirname + '/../views/review.ejs'), {
                pageId: req.params.pageId,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                Match: review_match_info,
                isHomeTeam: isHomeTeam
            })
        }
    },

    review: async (req, res) => {
        try {

            const elo = require('../modules/elo');

            // 홈 팀이 경기결과를 입력한 때
            if (req.body.winner) {
                //무승부인 경우
                if (req.body.winner == '무승부') {

                    //표기상 win, lose지만 상관없음!
                    const winnerId = req.user_id;
                    const loserId = req.body.opponent_id;

                    //얘 때문에 함수명, 변수 바꾸는 거 좋을듯
                    const matchTeamscore = await new Promise((resolve) => {
                        team.teamWinLose(winnerId, loserId, resolve);
                    });

                    const newScore = elo.changeScore(matchTeamscore[0].win_score, matchTeamscore[1].win_score, 0.5);
                    var changedScore = Math.abs(newScore[0] - matchTeamscore[0].win_score);

                    var draw = await new Promise((resolve) => {
                        const matchData = {
                            winnerId: req.body.winner,
                            loserId: loserId,
                            winnerScore: newScore[0],
                            loserScore: newScore[1],
                        }
                        //Team 테이블에 반영
                        team.updateResult(matchData, resolve)
                    });


                    //승패가 갈린경우
                } else {
                    const winnerId = req.body.winner;
                    const loserId = (req.user_id == req.body.winner) ? req.body.opponent_id : req.user_id;

                    const matchTeamscore = await new Promise((resolve) => {
                        team.teamWinLose(winnerId, loserId, resolve);
                    });

                    //team에서 score가져오기
                    const newScore = elo.changeScore(matchTeamscore[0].win_score, matchTeamscore[1].win_score, 1)
                    var changedScore = Math.abs(newScore[0] - matchTeamscore[0].win_score);

                    var back = await new Promise((resolve) => {
                        const matchData = {
                            winnerId: req.body.winner,
                            loserId: loserId,
                            winnerScore: newScore[0],
                            loserScore: newScore[1],
                        }
                        //Team 테이블에 반영
                        team.updateResult(matchData, resolve)
                    });
                }
            }
            //매너 반영
            var manner = ` manner_score = manner_score ${req.body.manner_rate} `;

            // //opponent에게 매너정보 담기
            var back2 = await new Promise((resolve) => {
                team.updateManner(manner, req.body.opponent_id, resolve)
            });

            if (req.body.isHomeTeam == 'home') {
                if (req.body.winner == '무승부')
                    var winner = -1;
                else 
                    var winner = req.body.result;
                var reviewQuery = ` winner=${winner}, changedScore=${changedScore}, home_userid=${req.user_id}, away_received_manner=${req.body.manner_rate} `

            } else if (req.body.isHomeTeam == 'away') {
                var reviewQuery = ` away_userid=${req.user_id}, home_received_manner=${req.body.manner_rate} `
            }

            var results = await new Promise((resolve) => {
                review.updateTeamReview(reviewQuery, resolve)
                res.redirect('/game/my-match');
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    review_resultview: async (req, res) => {
        try {

            const review_match_info = await new Promise((resolve) => {
                review.getreview_matchid(req.params.pageId, resolve);
            });

            if (review_match_info.kind == "not_found") {
                res.write("<script>alert('오류 발생 (리뷰가 작성되지 않음)')</script>");
                res.write("<script>window.location=\"/game/my-match\"</script>");
                res.end();
                return;
            }

            const result = await new Promise((resolve) => {
                team.getTwoTeam(review_match_info.home_userid, review_match_info.away_userid, resolve);
            });

            var MatchResult = review_match_info;
            
            if (result[0].user_id == review_match_info.winner) {
                MatchResult.winner = result[0];
                MatchResult.loser = result[1];
            } else {
                MatchResult.winner = result[1];
                MatchResult.loser = result[0];
            }

            res.render(path.join(__dirname + '/../views/review_result.ejs'), {
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                matchResult: MatchResult
            });

        } catch (err) {
            console.log('에러');
            console.log(err);
            res.write("<script>window.location=\"/\"</script>");
            res.end();
            return;
        }
    },

    match_accept: async (req, res) => {
        try {
            // {
            //   notif_id: '6',
            //   date: '2023-08-31',
            //   match_id: '97',
            //   RQuserid: '15',
            //   time: '13:00',
            //   place: '강남구'
            // }
            const data = req.body;

            const updateMatchResult = await new Promise((resolve) => {
                match.updateMatch_accept(data, resolve);
            });


            //비동기 처리 만들것!
            //이번 경기하는 두 팀 가져오기 (순서는 user_id 순서!)
            const matchTeams = await new Promise((resolve) => {
                team.TeamAndMatchForSMS(data.match_id, resolve);
            });

            if (matchTeams.home_userid == req.user_id)
                var loginteamname = matchTeams.home_teamname;
            else if (matchTeams.away_userid == req.user_id)
                var loginteamname = matchTeams.away_teamname;

            console.log('슙')
            console.log(matchTeams)
            console.log(loginteamname)

            var matchTeamObj = {
                home : {
                    teamname: matchTeams.home_teamname,
                    opponent_id : matchTeams.away_userid,
                    hp : matchTeams.home_hp.replace(/-/g, '')
                },
                away : {
                    teamname: matchTeams.away_teamname,
                    opponent_id :matchTeams.home_userid,
                    hp : matchTeams.away_hp.replace(/-/g, ''),
                }
            }

            var matchTime = new Date(data.date+' '+data.time);
            matchTime.setMinutes(matchTime.getMinutes() + 60);

            //메시지 전송 스케줄러 등록
            const messageScheduler = require("../modules/messageScheduler");
            messageScheduler.messageReservation(data.match_id, matchTeamObj, matchTime);

            var results = await new Promise((resolve) => {
                review.insertTeamReview(data.match_id, resolve)
                res.redirect('/game/my-match');
            });
            //noti 삭제, 삽입. 매치에 반영
            const delNotifResult = await new Promise((resolve) => {
                notif.DeleteNotification_matchid(data.match_id, resolve);
            });
            const notiID = await new Promise((resolve) => {
                notif.insertNotification(data.match_id, data.RQuserid, req.user_id, loginteamname, "수락", data.date, data.time, data.place, resolve);
            });


        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

    match_reject : (req,res) => {
        //여기서 할 일 
        //noti 알림 삭제
    
    // [
    // {
    //  notif_id: 10,
    //  match_id: 16,
    //  date: '2023-05-18',
    //  RQuserid : 1,
    //  RQteamname: 'FC도봉',
    //  RQplace: '강동구',
    //  RQstart: '16:14',
    //  OGplace: '강동구,강북구',
    //  OGstart: '12:14:00',
    //  OGend: '16:16:00'
    // }
    // ]

        notif.DeleteNotification(req.body.notif_id, function () {
            res.redirect('/game/requested-match');
        });
    },

    cancel_match: (req, res) => {
        //로그인 사용자와 검증필요? 혹은 이중검증?
        var data = req.body;
        //메시지 전송 스케줄러 등록

        const messageScheduler = require("../modules/messageScheduler");
        messageScheduler.cancelReservation(data.match_id);

        // match.DeleteMatch(req.body.match_id, function (result) {
        //     console.log('at cancel_match : ' + result)
        //     res.redirect('/');
        // })
    },

}
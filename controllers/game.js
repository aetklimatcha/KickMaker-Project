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

    team_reviewview: async (req, res) => {
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
            res.redirect('/signin')
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
            const isHomeTeam = (req.user_id == review_match_info.home_userid) ? true : false;

            res.render(path.join(__dirname + '/../views/team_review.ejs'), {
                pageId: req.params.pageId,
                loginTeam: req.header.loginresult,
                notifications: req.header.notifications,
                Match: review_match_info,
                isHomeTeam: isHomeTeam
            })
        }
    },

    team_review: async (req, res) => {

        var result = new Object();
        var manner = new Object();

        //matchresult 앞이 이기면 1, 뒤가 이기면 0
        // teamAscore = elo.changeScore(teamAscore, teamBscore, matchresult)

        // team에다가 승점 반영하기, 매너점수 반영하기 
        // { result: '승리', manner_rate: '나쁨' }
        switch (req.body.result) {
            //
            case '승리':
                bonusPoints = elo.changeScore(a, b, 1);
                console.log(bonusPoints);
                result.result = `totalMatches = totalMatches+1, win_score = ${bonusPoints[0]}, win = win+1 `
                break;
            case '무승부':
                bonusPoints = elo.changeScore(a, b, 0.5);
                console.log(bonusPoints);
                result.result = `totalMatches = totalMatches+1, win_score = ${bonusPoints[0]}, draw = draw+1 `
                break;
            case '패배':
                bonusPoints = elo.changeScore(a, b, 0);
                console.log(bonusPoints);
                result.result = `totalMatches = totalMatches+1, win_score = ${bonusPoints[0]}, lose = lose+1 `
                break;
        }

        switch (req.body.manner_rate) {
            case '매우 좋음':
                manner.result = `manner_score = manner_score + 2 `;
                break;
            case '좋음':
                manner.result = `manner_score = manner_score + 1 `;
                break;
            case '보통':
                manner.result = `manner_score = manner_score + 0 `;
                break;
            case '나쁨':
                manner.result = `manner_score = manner_score - 1 `;
                break;
            case '매우 나쁨':
                manner.result = `manner_score = manner_score - 2 `;
                break;
        }
        
        // //opponent에게 매너정보 담기
        // var back2 = await new Promise((resolve) => {
        //     team.updateAfterMatch(manner, req.body.opponent_id, resolve)
        // });

        // //user에게 결과 정보 담기
        // var back = await new Promise((resolve) => {
        //     console.log(result)
        //     team.updateAfterMatch(result, req.user_id, resolve)
        // });

        // var results = await new Promise((resolve) => {
        //     teamreview.insertTeamReview(req.params.pageId, req.user_id, req.body.result, req.body.manner_rate, resolve)
        //     res.redirect('/game/my-match');
        // });

        // review.insertTeamReview(req.params.pageId, req.user_id, req.body.result, req.body.manner_rate, function (result) {
        //     res.redirect('/my-match');
        // });
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

            //비동기 처리 만들것!
            //이번 경기하는 두 팀 가져오기 (순서는 user_id 순서!)
            const matchTeams = await new Promise((resolve) => {
                team.TeamAndMatchForSMS(data.match_id, resolve);
            });
            
            if (matchTeams.home_userid == req.user_id)
                var loginteamname = matchTeams.home_teamname;
            else if (matchTeams.away_userid == req.user_id)
                var loginteamname = matchTeams.away_teamname;

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
            matchTime.setMinutes(matchTime.getMinutes() - 60);

            //메시지 전송 스케줄러 등록
            const messageScheduler = require("../modules/messageScheduler");
            messageScheduler.messageReservation(data.match_id, matchTeamObj, matchTime);
            console.log(matchTime)
            res.redirect('/game/requested-match');

            //noti 삭제, 삽입. 매치에 반영
            const delNotifResult = await new Promise((resolve) => {
                notif.DeleteNotification_matchid(data.match_id, resolve);
            });
            const notiID = await new Promise((resolve) => {
                notif.insertNotification(data.match_id, data.RQuserid, req.user_id, loginteamname, "수락", data.date, data.time, data.place, resolve);
                res.redirect('/');
            });
            const updateMatchResult = await new Promise((resolve) => {
                match.updateMatch_accept(data, resolve);
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
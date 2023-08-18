const team = require("../models/Team")
// const match = require("../models/Match");
const notif = require("../models/Notification");
const match = require("../models/Match");
const teamreview = require("../models/TeamReview");
const elo = require("../modules/elo");

module.exports = {
    team_review: async (req, res) => {

        var result = new Object();
        var manner = new Object();

        //matchresult 앞이 이기면 1, 뒤가 이기면 0
        // teamAscore = elo.changeScore(teamAscore, teamBscore, matchresult)

        // team에다가 승점 반영하기, 매너점수 반영하기 
        // { result: '승리', manner_rate: '나쁨' }
        a = 1500
        b = 1400
        switch (req.body.result) {
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
        //req.params.pageId로 상대 정보 가져오고, 그 아이디에 

        var back2 = await new Promise((resolve) => {
            team.updateAfterMatch(manner, req.body.opponent_id, resolve)
        });

        var back = await new Promise((resolve) => {
            console.log(result)
            team.updateAfterMatch(result, req.user_id, resolve)
        });

        var results = await new Promise((resolve) => {
            teamreview.insertTeamReview(req.params.pageId, req.user_id, req.body.result, req.body.manner_rate, resolve)
            res.redirect('/my-match');
        });

        // review.insertTeamReview(req.params.pageId, req.user_id, req.body.result, req.body.manner_rate, function (result) {
        //     res.redirect('/my-match');
        // });
    },
}
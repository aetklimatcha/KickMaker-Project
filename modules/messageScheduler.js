const mysql = require("../config/mysql");
const schedule = require('node-schedule');
const genQRcode = require('./genQRcode');
const sendMessage = require('./sendMessage');
const messageCrypt = require('./messageCrypt');

module.exports = {

    messageReservation: function (matchId, matchTeamObj, matchTime) {
        try {
            console.log('넘어옴')
            console.log(matchId)
            console.log(matchTeamObj)
            console.log(matchTime)

            // 넘어온 2개의 팀 객체에 user_id를 암호화하여 key로 삽입
            for (const team in matchTeamObj) {
                let opponent_id = matchTeamObj[team].opponent_id;
                let encryptedData = messageCrypt.encryptNumber(opponent_id);
                matchTeamObj[team].key = encryptedData;
            }
            
            schedule.scheduleJob(matchId.toString(), matchTime, async function () {
                for (const team in matchTeamObj) {
                    console.log(team);
                    let opponent_id = matchTeamObj[team].opponent_id;
                    let teamhp = matchTeamObj[team].hp;
                    let teamname = matchTeamObj[team].teamname;
                    //전송되는것
                    let teamkey = matchTeamObj[team].key;
                    let url = `http://localhost:3000/game/review/${matchId}?id=${teamkey}`
                    var QR = await genQRcode(matchId, opponent_id, url);
                    var SM = await sendMessage(matchId,teamname, teamhp, opponent_id);
                    console.log('스케줄러 실행 완료');
                }
            })

        }
        catch (err) {
            console.log('에러 at messagescheduler');
            console.log(err)
        }
    },


    // 예약이 취소되었다면 아래 함수를 호출하여 해당 스케줄을 취소
    cancelReservation: function (name) {
        try {
            var name = name.toString()
            schedule.cancelJob(name);
            console.log('Reservation cancelled');
        } catch (err) {
            console.log('에러 at messagescheduler 취소');
            console.log(err)
        }
    }

}
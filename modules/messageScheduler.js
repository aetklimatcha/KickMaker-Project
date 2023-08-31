const mysql = require("../config/mysql");
const schedule = require('node-schedule');
const genQRcode = require('./genQRcode');
const sendMessage = require('./sendMessage');

module.exports = {

    // 숫자를 간단한 문자열로 암호화하는 함수
    encryptNumber: function (number) {
        const mapping = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const numberString = number.toString();
        let encryptedString = '';

        for (let i = 0; i < numberString.length; i++) {
            const digit = parseInt(numberString[i], 10);
            encryptedString += mapping[digit];
        }

        return encryptedString;
    },

    // 간단한 문자열을 숫자로 복호화하는 함수
    decryptString: function (encryptedString) {
        const mapping = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9 };
        let decryptedNumber = '';

        for (let i = 0; i < encryptedString.length; i++) {
            const char = encryptedString[i];
            decryptedNumber += mapping[char];
        }

        return parseInt(decryptedNumber, 10);
    },

    messageReservation: function (matchId, matchTeamObj, matchTime) {
        try {
            // 넘어온 2개의 팀 객체에 user_id를 암호화하여 key로 삽입
            for (const team in matchTeamObj) {
                let teamid = matchTeamObj[team].id;
                //상대팀거 보내는거로 바꿔!(hp, 암호url 다!)
                let encryptedData = this.encryptNumber(teamid);
                matchTeamObj[team].key = encryptedData;
            }

            schedule.scheduleJob(matchId.toString(), matchTime, async function () {
                for (const team in matchTeamObj) {
                    let teamid = matchTeamObj[team].id;
                    let teamhp = matchTeamObj[team].opponent_hp;
                    //전송되는것
                    let teamkey = matchTeamObj[team].key;
                    let url = `http://localhost:3000/game/team-review/${matchId}?id=${teamkey}`
                    var QR = await genQRcode(teamid, url);
                    var SM = await sendMessage(teamhp, teamid);
                    console.log('스케줄러 실행 완료');
                }
            })
            console.log(matchTeamObj);

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
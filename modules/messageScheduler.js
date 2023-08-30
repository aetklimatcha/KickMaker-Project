const mysql = require("../config/mysql");
const schedule = require('node-schedule');

function messageReservation() {
    try {
        const querystring = `Select match_date, match_time from Matches where match_id = 86;`;
        function getq() {
            return new Promise((resolve, reject) => {
                mysql.query(querystring, function (error, result) {
                    if (error) throw error;
                    resolve(result);
                })
            })
        }

        getq().then((resul) => {
            console.log(resul);
            date = resul[0].match_date + ' ' + resul[0].match_time;
            console.log(date);
            date2 = new Date(date);
            console.log(date2)
            date2.setMinutes(date2.getMinutes() - 60);
            console.log(date2)

            const scheduledTask = schedule.scheduleJob(date2, function () {
                console.log('Scheduled task executed');
                // 예약 여부 확인 및 알림 전송 코드 작성
            });

        })
    }
    catch (err) {
        console.log('에러');
    }
}


// 예약이 취소되었다면 아래 함수를 호출하여 해당 스케줄을 취소
function cancelReservation() {
    scheduledTask.cancel();
    console.log('Reservation cancelled');
}
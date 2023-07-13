require("dotenv").config({ path: __dirname+"/../config/.env" });
const getTime = require("../modules/getTime")

weather_key = process.env.WEATHER_KEY;
//발표시각이 02시10분이므로 03시 00분에 base_date 갱신
base_date = getTime.getTime() >= '0300' ? getTime.getDate() : getTime.getDate()-1;

function checkpageNo(gamedate, gametime) {
    //오늘 경기일 경우
    if ((gamedate - getTime.getDate()) == 0) {
        if (gametime < '0300') {//예보 발표 전 시각일 경우 : 전날 발표한 오늘 날짜의 예보 확인
            return 2;

        } else if (gametime >= '0300') { //예보 발표 이후 시각일 경우 : 오늘 발표한 오늘 날짜의 예보 확인
            return 1;
        }
    } else if ((gamedate - getTime.getDate()) == 1) {
        return 2;
    } else if ((gamedate - getTime.getDate()) == 2) {
        return 3;
    }
}

function createRequestUrl (pageNo, nx, ny) {
    return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${weather_key}&numOfRows=290&pageNo=${pageNo}&base_date=${base_date}&base_time=0200&nx=${nx}&ny=${ny}&dataType=JSON`
}

function createComment (gamedate, gametime, json) {
    date = gamedate;
    time =  gametime.endsWith('30') ? gametime.slice(0,2) +'00' : gametime;
    var weatherObj = {};
    try {
        route = json.response.body.items.item;

        //console.log(route);
        for (var i=0; i<route.length; i++) {
            if (route[i].fcstTime == time) {
                category = route[i].category;
                weatherObj[category] = route[i].fcstValue;
            }
        }
        console.log(weatherObj);

    } catch (err) {
        console.log(err);
        return "죄송합니다만 오늘은 날씨가 오락가락해서 예보가 어렵네요. 관리자에게 물어보세요."
    }
}

const http = require('http');

module.exports = {

    weatherAPI: (gamedate, gametime, nx, ny) => {
        return new Promise((resolve, reject) => {

            pageNo = checkpageNo(gamedate, gametime);
            const url = createRequestUrl(pageNo, nx, ny);
            http.get(url, (res) => {
                var json = "";
                res.on("data", (chunk) => {
                    json += chunk;
                });

                res.on("end", () => {
                    resolve(createComment(gamedate, gametime, JSON.parse(json)));
                });
            });
        });
    }
}

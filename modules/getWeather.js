require("dotenv").config({ path: __dirname+"/../config/.env" });
const http = require('http');
const getTime = require("../modules/getTime")
const latLngToGrid = require("../modules/latLngToGrid")

const weather_key = process.env.WEATHER_KEY;


function checkpageNo(gamedate) {
    switch(gamedate - getTime.getDate()){
        //오늘인 경우
        case 0:
            return 1;
        //내일인 경우
        case 1:
            return 2;
        //모레인 경우
        case 2:
            return 3;
        //그 이상인 경우
        default:
            return -1;
    }
}

function createUrl (pageNo, nx, ny) {
    const base_date = getTime.getDate()-1

    return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${weather_key}&numOfRows=290&pageNo=${pageNo}&base_date=${base_date}&base_time=2300&nx=${nx}&ny=${ny}&dataType=JSON`
}

function extractWeatherInfoByDateTime (gametime, json) {
    var time =  gametime.endsWith('30') ? gametime.slice(0,2) +'00' : gametime;
    const weatherType = ['TMP', 'POP', 'PCP', 'fcstDate', 'fcstTime']
    // TMP : 1시간 기온
    // POP : 강수확률
    // PCP : 1시간 강수량
    // fcstDate : 예측일자
    // fcstTime : 예측시간 
    var weatherObj = {};
    try {
        const route = json.response.body.items.item;
        for (var i=0; i<route.length; i++) {
            if (route[i].fcstTime == time) {

                weatherObj.fcstDate = route[i].fcstDate;
                weatherObj.fcstTime = route[i].fcstTime;

                const category = route[i].category;
                if (weatherType.includes(category))
                    weatherObj[category] = route[i].fcstValue;
            }
        }
        return weatherObj;

    } catch (err) {
        return -1;
    }
}

module.exports = {

    weatherAPI: (gamedate, gametime, inputx, inputy) => {
        const nx = latLngToGrid(inputx, inputy).x;
        const ny = latLngToGrid(inputx, inputy).y;
        const pageNo = checkpageNo(gamedate, gametime);
        const url = createUrl(pageNo, nx, ny);
        return new Promise((resolve, reject) => {

            if (pageNo == -1)
                resolve('DateOverError');   //3일 이후의 날씨 요구시 발생 에러 (DateOverError)

            http.get(url, (res) => {
                let json = "";

                res.on("data", (chunk) => {
                    json += chunk;
                });

                res.on("end", () => {
                    const result = extractWeatherInfoByDateTime(gametime, JSON.parse(json));
                    resolve(result == -1 ? 'ApiError' : result);
                });
            });
        });
    }
}

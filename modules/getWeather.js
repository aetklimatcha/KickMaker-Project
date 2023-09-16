require("dotenv").config({ path: __dirname + "/../config/.env" });
const http = require('http');
const getTime = require("../modules/getTime")
const latLngToGrid = require("../modules/latLngToGrid")

const weather_key = process.env.WEATHER_KEY;


function checkpageNo(gamedate) {
    switch (gamedate - getTime.getDate()) {
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

function determineAppropriateForecastAPI(gamedate) {
    const daysUntilMatch = gamedate - getTime.getDate();
    if (daysUntilMatch < 0 || daysUntilMatch > 10)
        return -1;
    else if (daysUntilMatch < 3)
        return 'shortTerm';
    else if (daysUntilMatch <= 10)
        return 'midTerm';
}

function createUrl(type, gamedate, nx, ny) {
    if (type == 'shortTerm') {
        const pageNo = checkpageNo(gamedate);
        const base_date = getTime.getDate() - 1;
        return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${weather_key}&numOfRows=290&pageNo=${pageNo}&base_date=${base_date}&base_time=2300&nx=${nx}&ny=${ny}&dataType=JSON`

    } else if (type == 'midTerm') {
        const currentTime = getTime.getTime();
        const currentDate = getTime.getDate();
        var tmFc = '';

        if (currentTime < '0601')
            tmFc = tmFc + (currentDate - 1) + '1800'
        else if (currentTime < '1801')
            tmFc = tmFc + currentDate + '0600'
        else
            tmFc = tmFc + currentDate + '1800'
        return `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${weather_key}&numOfRows=10&pageNo=1&regId=11B00000&tmFc=${tmFc}&dataType=JSON`
    }
}

function extractWeatherInfoByDateTime(type, gamedate, gametime, json) {
    if (type == 'shortTerm') { // 단기예보
        var time = gametime.endsWith('30') ? gametime.slice(0, 2) + '00' : gametime;
        const weatherTypes = ['TMP', 'POP', 'PCP', 'fcstDate', 'fcstTime']
        // TMP : 1시간 기온
        // POP : 강수확률
        // PCP : 1시간 강수량
        // fcstDate : 예측일자
        // fcstTime : 예측시간 
        var weatherObj = {};
        try {
            const route = json.response.body.items.item;
            for (var i = 0; i < route.length; i++) {
                if (route[i].fcstTime == time) {
                    weatherObj.baseDate = route[i].baseDate;
                    weatherObj.fcstDate = route[i].fcstDate;
                    weatherObj.fcstTime = route[i].fcstTime;

                    const category = route[i].category;
                    if (weatherTypes.includes(category))
                        weatherObj[category] = route[i].fcstValue;
                }
            }
            return weatherObj;

        } catch (err) {
            return -1;
        }
    } else if (type == 'midTerm') { // 중기예보
        const currentTime = getTime.getTime();
        const currentDate = getTime.getDate();

        var daysUntilMatch = gamedate - currentDate;
        daysUntilMatch = (currentTime < '0601') ? daysUntilMatch + 1 : daysUntilMatch;

        var weatherObj = {
            POP: '',
            INFO: ''
        };

        if (daysUntilMatch >= 8) {
            weatherObj.POP = 'rnSt' + daysUntilMatch;
            weatherObj.INFO = 'wf' + daysUntilMatch;
        }
        else if (gametime < '1200') {
            weatherObj.POP = 'rnSt' + daysUntilMatch + 'Am';
            weatherObj.INFO = 'wf' + daysUntilMatch + 'Am';
        } else if (gametime < '2400') {
            weatherObj.POP = 'rnSt' + daysUntilMatch + 'Pm';
            weatherObj.INFO = 'wf' + daysUntilMatch + 'Pm';
        }

        try {
            const route = json.response.body.items.item[0];
            for (var type in weatherObj) {
                weatherObj[type] = route[weatherObj[type]];
            }
            return weatherObj;

        } catch (err) {
            console.log(err);
            return -1;
        }
    }
}

module.exports = {

    weatherAPI: (gamedate, gametime, inputx, inputy) => {
        console.log(gamedate, gametime, inputx, inputy);
        const nx = latLngToGrid(inputx, inputy).x;
        const ny = latLngToGrid(inputx, inputy).y;
        const selectedAPI = determineAppropriateForecastAPI(gamedate, gametime);
        const url = createUrl(selectedAPI, gamedate, nx, ny);
        return new Promise((resolve, reject) => {
            if (selectedAPI == -1)
                resolve('DateOverError');   //3일 이후의 날씨 요구시 발생 에러 (DateOverError)
            else {
                http.get(url, (res) => {
                    let json = "";

                    res.on("data", (chunk) => {
                        json += chunk;
                    });

                    res.on("end", () => {
                        try {
                            parsedData = JSON.parse(json);
                        } catch (err) {
                            resolve('ApiError');
                        }
                        const result = extractWeatherInfoByDateTime(selectedAPI, gamedate, gametime, parsedData);
                        resolve(result == -1 ? 'ApiError' : result);
                    });
                });
            }
        });
    }
}

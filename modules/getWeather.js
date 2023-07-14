require("dotenv").config({ path: __dirname+"/../config/.env" });
const getTime = require("../modules/getTime")
const latLngToGrid = require("../modules/latLngToGrid")

weather_key = process.env.WEATHER_KEY;
//발표시각이 02시10분이므로 03시 00분에 base_date 갱신
base_date = getTime.getTime() >= '0300' ? getTime.getDate() : getTime.getDate()-1;

function checkpageNo(gamedate, gametime) {
    switch(gamedate - getTime.getDate()){
        //오늘인 경우
        case 0:
            return (gametime < '0300') ? 2 : 1;
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

function createRequestUrl (pageNo, nx, ny) {
    return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${weather_key}&numOfRows=290&pageNo=${pageNo}&base_date=${base_date}&base_time=0200&nx=${nx}&ny=${ny}&dataType=JSON`
}

function createComment (gamedate, gametime, json) {
    date = gamedate;
    time =  gametime.endsWith('30') ? gametime.slice(0,2) +'00' : gametime;
    weatherType = ['TMP', 'POP', 'PCP', 'fcstDate', 'fcstTime']
    var weatherObj = {};
    try {
        route = json.response.body.items.item;
        for (var i=0; i<route.length; i++) {
            if (route[i].fcstTime == time) {

                weatherObj.fcstDate = route[0].fcstDate;
                weatherObj.fcstTime = route[0].fcstTime;

                category = route[i].category;
                if (weatherType.includes(category)) //기온, 강수확률, 강수량
                    weatherObj[category] = route[i].fcstValue;
            }
        }
        return weatherObj;

    } catch (err) {
        console.log("at getWeather"+ err);
        return -1;
    }
}

const http = require('http');

module.exports = {

    weatherAPI: (gamedate, gametime, inputx, inputy) => {
        nx = latLngToGrid(inputx, inputy).x;
        ny = latLngToGrid(inputx, inputy).y;
        console.log(nx,ny);
        return new Promise((resolve, reject) => {

            pageNo = checkpageNo(gamedate, gametime);

            if (pageNo==-1)
                resolve('DateOverError');   //3일 이후의 날씨 요구시 발생 에러 (DateOverError)

            const url = createRequestUrl(pageNo, nx, ny);
            http.get(url, (res) => {
                var json = "";

                res.on("data", (chunk) => {
                    json += chunk;
                });

                res.on("end", () => {
                    var result = createComment(gamedate, gametime, JSON.parse(json));
                    resolve(result==-1 ? 'ApiError' : result);
                    //resolve(result);   //정상 객체 전송
                });
            });
        });
    }
}

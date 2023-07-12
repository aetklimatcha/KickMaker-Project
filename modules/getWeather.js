require("dotenv").config({ path: __dirname+"/../config/.env" });
const getTime = require("../modules/getTime")

weather_key = process.env.WEATHER_KEY;
base_date = getTime.getDate();
pageNo = 1;
//한 시간마다 : +1 
//하루마다 : +24

function createRequestUrl (nx, ny) {
    return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${weather_key}&numOfRows=12&pageNo=${pageNo}&base_date=${base_date}&base_time=0500&nx=${nx}&ny=${ny}&dataType=JSON`
}

createComment = (json) => {
    try {
        let data = json.response.body.items.item;
        console.log("\ncreateComment: ", data.length);
        let info = {}
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            switch (item.category) {
                case "SKY":
                    let cloudy = parseInt(item.fcstValue);
                    if (cloudy > 8) {
                        info.sky = '흐림';
                    } else if (cloudy > 5) {
                        info.sky = '구름많음';
                    } else {
                        info.sky = '맑음';
                    }
                    break;
                case "TMN":
                    info.morning = item.fcstValue;
                    break;
                case "TMX":
                    info.highest = item.fcstValue;
                    break;
                default:
                    break;
            }
        }

        let r = this.address + " 지역의 오늘 날씨는 " + info.sky
            + (info.morning ? (". 아침 최저기온은 " + info.morning + (info.highest ? "도이고 " : "도입니다.")) : '')
            + (info.highest ? (" 낮 최고기온은 " + info.highest + "도까지 오르겠습니다.") : '');
        return r;
    } catch (err) {
        console.log(err);
        return "죄송합니다만 오늘은 날씨가 오락가락해서 예보가 어렵네요. 관리자에게 물어보세요."
    }
}

//https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=umsE3iTK2pGcWuE46c3JlnT%2BHmV%2FwdEvblRuK7HF0tkHuNR4cYU%2B60JEbdvyqi%2FV8fHV2wq3N6fEJcNOnuBswA%3D%3D&numOfRows=10&pageNo=1&base_date=20230711&base_time=0500&nx=55&ny=127&dataType=JSON



//Weather API of Korea Meteorlogical Administration 
const http = require('http');

module.exports = {

    kick : () => {
        console.log("work");
    },

    weatherAPI : () => {
        return new Promise((resolve, reject) => {
                const url = this.createRequestUrl(55, 127);
                console.log("weatherAPI() ", url);
                http.get(url, (res) => {
                    var json = "";
                    res.on("data", (chunk) => {
                        json += chunk;
                        console.log(json);
                    });

                    // res.on("end", () => {
                    //     resolve(this.createComment(JSON.parse(json)));
                    // });
                });
        });
    }
}

console.log("weahter key is "+weather_key)
const url = createRequestUrl(55, 127);
console.log("weatherAPI() ", url);
http.get(url, (res) => {
    var json = "";
    res.on("data", (chunk) => {
        json += chunk;
        console.log(json);
    });
})


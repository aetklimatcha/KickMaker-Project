require("dotenv").config({ path: "./config/.env" });
const getTime = require("../modules/getTime")

weather_key = process.env.WEATHER_KEY;
base_date = getTime.getKRTime();

module.exports = {
    get: () => {
        url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${weather_key}&numOfRows=10&pageNo=1&base_date=${base_date}&base_time=0500&nx=55&ny=127&dataType=JSON`
    }
}

//https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=umsE3iTK2pGcWuE46c3JlnT%2BHmV%2FwdEvblRuK7HF0tkHuNR4cYU%2B60JEbdvyqi%2FV8fHV2wq3N6fEJcNOnuBswA%3D%3D&numOfRows=10&pageNo=1&base_date=20230711&base_time=0500&nx=55&ny=127&dataType=JSON
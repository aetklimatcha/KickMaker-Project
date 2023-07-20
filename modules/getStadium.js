require("dotenv").config({ path: __dirname + "/../config/.env" });
const axios = require('axios');
const http = require('http');

stadium_key = process.env.STADIUM_KEY;
// STADIUM_KEY=6f5152534578787a34387652696373


function createComment(json, location) {
    var result = [];
    var route = json.ListPublicReservationSport.row;

    var cnt = 0;

    for (var i = 0; i < route.length; i++) {
        if ((route[i].SVCSTATNM === '접수중' || route[i].SVCSTATNM === '안내중') && route[i].AREANM === location) {
            const newObj = {
                name: route[i].PLACENM,
                type: route[i].MINCLASSNM,
                nx: route[i].X,
                ny: route[i].Y,
                url: route[i].SVCURL,
                tel: route[i].TELNO
            };
    
            // result 배열에 같은 name을 가진 객체가 있는지 확인
            if (result.some(item => item.name === newObj.name)) {
                continue;
            }

            // let isDuplicate = false;
            // for (var j = 0; j < result.length; j++) {
            //     if (result[j].name === newObj.name) {
            //         isDuplicate = true;
            //         break;
            //     }
            // }
    
            result[cnt] = newObj;
            cnt++;
        }
    }
    

    // console.log(json.ListPublicReservationSport.row[0]) 
        // 실행시
    // {
    //     GUBUN: '자체',
    //     SVCID: 'S210401100008601453',
    //     MAXCLASSNM: '체육시설',
    //     MINCLASSNM: '축구장',
    //     SVCSTATNM: '접수중',
    //     SVCNM: '○ [평일] (주간) 마포 난지천 인조잔디축구장',
    //     PAYATNM: '유료',
    //     PLACENM: '서울특별시 산악문화체험센터>난지천인조잔디축구장',
    //     USETGTINFO: ' 제한없음',
    //     SVCURL: 'https://yeyak.seoul.go.kr/web/reservation/selectReservView.do?rsv_svc_id=S210401100008601453',
    //     X: '126.88390026512282',
    //     Y: '37.574238294219086',
    //     SVCOPNBGNDT: '2022-01-01 00:00:00.0',
    //     SVCOPNENDDT: '2023-12-31 00:00:00.0',
    //     RCPTBGNDT: '2023-06-26 12:00:00.0',
    //     RCPTENDDT: '2023-08-30 11:08:00.0',
    //     AREANM: '마포구',
    //     IMGURL: 'https://yeyak.seoul.go.kr/web/common/file/FileDown.do?file_id=1617239932085QQ2HH7Q6BFUUKKLU129S2081E',
    //     DTLCONT: '1. 공공시설 예약~~~~
    //     TELNO: '02-3153-9874',
    //     V_MIN: '06:00',
    //     V_MAX: '20:00',
    //     REVSTDDAYNM: '이용일',
    //     REVSTDDAY: '1'
    //   }


    return result;
}

function getStadium(location) {
    const url1 = `http://openAPI.seoul.go.kr:8088/${stadium_key}/json/ListPublicReservationSport/1/538/축구장`;
    const url2 = `http://openAPI.seoul.go.kr:8088/${stadium_key}/json/ListPublicReservationSport/1/538/다목적경기장`;

    // 두 개의 GET 요청을 Promise.all로 동시에 처리
    return Promise.all([
        axios.get(url1).then(response => createComment(response.data, location)),
        axios.get(url2).then(response => createComment(response.data, location))
    ])
    .then(([soccer_result, util_result]) => {
        // 두 결과 배열을 합치기
        const result = [...soccer_result, ...util_result];
        return result;
    })
    .catch(error => {
        console.error('데이터 가져오기 오류:', error);
        throw new Error('ApiError');
    });
}

module.exports = getStadium;
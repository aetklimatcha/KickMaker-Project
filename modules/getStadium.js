// //인증키 값 : 6f5152534578787a34387652696373

// var request = require('request');

// var url = 'http://openapi.seoul.go.kr:8088/sample/xml/ListPublicReservationSport/1/5/';

// request({
// 	url: url,
// 	method: 'GET'
// }, function (error, response, body) {
// 	//console.log('Status', response.statusCode);
// 	//console.log('Headers', JSON.stringify(response.headers));
// 	//console.log('Reponse received', body);
// });

var request = require('request');

var apiKey = '6f5152534578787a34387652696373'; // 인증키 값
var url1 = `http://openAPI.seoul.go.kr:8088/${apiKey}/xml/ListPublicReservationSport/1/10/축구장`;
var url2 = `http://openAPI.seoul.go.kr:8088/${apiKey}/xml/ListPublicReservationSport/1/10/다목적경기장`;

request({
    url: url1,
    method: 'GET'
}, function (error, response, body) {
    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Status:', response.statusCode);
    console.log('Body:', body);

    // 원하는 동작을 추가로 구현할 수 있습니다.
    // 예를 들어, 응답 본문을 JSON으로 파싱하여 특정 데이터에 접근할 수도 있습니다.
    // var data = JSON.parse(body);
    // console.log('Data:', data);
});


const http = require('http');

function checkpageNo(PLACENM) {
    return -1; // 예시로 -1을 반환하도록 설정하였습니다.
}

function createRequestUrl(PLACENM, x, y) {
    return ''; // 예시로 빈 문자열을 반환하도록 설정하였습니다.
}

function createComment(PLACENM, json) {
    return ''; // 예시로 빈 문자열을 반환하도록 설정하였습니다.
}

module.exports = {
    stadiumAPI: (PLACENM, x, y) => {
        nx = latLngToGrid(x, y).x;
        ny = latLngToGrid(x, y).y;
        return new Promise((resolve, reject) => {
            pageNo = checkpageNo(PLACENM);
            if (pageNo === -1)
                resolve('DateOverError'); //3일 이후의 날씨 요구시 발생 에러 (DateOverError)

            const url = createRequestUrl(PLACENM, x, y);
            http.get(url, (res) => {
                var json = "";
                res.on("data", (chunk) => {
                    json += chunk;
                });
                res.on("end", () => {
                    var result = createComment(PLACENM, JSON.parse(json));
                    console.log(result === -1 ? 'ApiError' : result);
                    //resolve(result);   //정상 객체 전송
                });
            });
        });
    }
};

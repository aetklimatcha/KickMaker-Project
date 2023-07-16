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

const http = require('http');
const fetch = require('node-fetch');

// 자바스크립트 코드 시작
function latLngToGrid(x, y) {
    // latLngToGrid 함수의 구현
    // 이 함수는 예시로 작성되었으며 실제 구현이 필요합니다.
}

// 자바스크립트 코드 계속 ...

const apiKey = '6f5152534578787a34387652696373'; // 인증키 값
const url1 = `http://openAPI.seoul.go.kr:8088/${apiKey}/xml/ListPublicReservationSport/1/10/축구장`;
const url2 = `http://openAPI.seoul.go.kr:8088/${apiKey}/xml/ListPublicReservationSport/1/10/다목적경기장`;

// http 모듈을 사용하여 GET 요청 보내기
http.get(url1, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', body);

        // 원하는 동작을 추가로 구현할 수 있습니다.
        // 예를 들어, 응답 본문을 파싱하여 특정 데이터에 접근할 수도 있습니다.
        // const data = new DOMParser().parseFromString(body, 'application/xml');
        // console.log('Data:', data);
    });
})
.on('error', (error) => {
    console.error('Error:', error);
});

// 기타 필요한 함수와 코드를 작성합니다.

// 자바스크립트 코드 끝

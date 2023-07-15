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

var url = 'http://openapi.seoul.go.kr:8088/sample/xml/ListPublicReservationSport/1/5/';
var apiKey = '6f5152534578787a34387652696373'; // 인증키 값

request({
    url: url + apiKey,
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



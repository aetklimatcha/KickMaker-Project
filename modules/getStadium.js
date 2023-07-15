//인증키 값 : 6f5152534578787a34387652696373

var request = require('request');

var url = 'http://openapi.seoul.go.kr:8088/sample/xml/ListPublicReservationSport/1/5/';

request({
	url: url,
	method: 'GET'
}, function (error, response, body) {
	//console.log('Status', response.statusCode);
	//console.log('Headers', JSON.stringify(response.headers));
	//console.log('Reponse received', body);
});


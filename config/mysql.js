const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mycapstonedb.cnoou4raevzv.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: "capstone123",
    database: "KICKMATCH"
});

//MYSQL 커넥션 확인 (Team 테이블 출력)
connection.connect(function (err) {
    if (err) {
        throw err; // 접속에 실패하면 에러를 throw 합니다.
    } else {
        // 접속시 쿼리를 보냅니다.
        console.log("DB connected!");
        //connection.query("SELECT * FROM Team", function (err, rows, fields) {
           // console.log(rows); // 결과를 출력합니다!!!});
    }
});

module.exports = connection;
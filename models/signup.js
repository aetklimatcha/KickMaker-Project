// 회원가입 :D

const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {


    //회원가입 시 Team에 회원 정보(아이디,비밀번호,팀이름,팀대표자명,연락처) 삽입
    insertsignup: function ( id, password, teamname, represent_name, hp, logo_image, callback ) {
        const querystring = `INSERT INTO Team ( id, password, teamname, represent_name, hp, logo_image) VALUES ( '${id}', '${password}', '${teamname}', '${represent_name}', '${hp}', '${logo_image}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertId);
        });
    },


/*
//회원가입 시 중복 체크 후 => 회원 정보(아이디,비밀번호,팀이름,팀대표자명,연락처) 삽입
insertsignup: function(request, response) {
    var id = request.body.id;
    var password = request.body.password;
    var password2 = request.body.password2;
    var teamname = request.body.username;
    var represent_name = request.body.represent_name;
    var hp = request.body.hp;

    console.log(id, password, teamname, represent_name, hp);
    if (id && password) {
        connection.query('SELECT * FROM Team WHERE id = ? AND password = ?', [id, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length <= 0 && password==password2) {
                mysql.query('INSERT INTO Team (id, password, teamname, represent_name, hp ) VALUES(?,?,?,?,?)', [id, password, teamname, represent_name, hp],
                function (error, data) {
                    if (error)
                    console.log(error);
                    else
                    console.log(data);
                });
                  response.send('<script type="text/javascript">alert("회원가입 완료 :D"); document.location.href="/";</script>');    
            } else if (password != password2) {                
                response.send('<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다 :c"); document.location.href="/signup";</script>');    
            }
            else {
                response.send('<script type="text/javascript">alert("이미 존재하는 아이디 입니다 :c"); document.location.href="/signup;</script>');    
            }            
            response.end();
        });
    } else {
        response.send('<script type="text/javascript">alert("모든 정보를 입력해주세요 :c"); document.location.href="/signup";</script>');    
        response.end();
    }
},

*/

    //login_demo - insert Team 테스트 코드
    insertTeamtest: function ( id, password, callback ) {
        const querystring = `INSERT INTO Team (id, password) VALUES ('${id}', '${password}');`;
        mysql.query(querystring, function (err, rows) {
            if ( err ) console.log("errorrr");
            //console.log(rows);
            callback(rows.insertId);
        });
    }

    }

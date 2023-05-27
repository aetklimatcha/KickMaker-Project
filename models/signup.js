// 회원가입 :D

const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {


    //회원가입 시 Team에 회원 정보(아이디,비밀번호,팀이름,팀대표자명,연락처,로고아이디) 삽입
    insertsignup: function ( id, password, teamname, represent_name, hp,  logo_id, callback ) {
        const querystring = `INSERT INTO Team ( user_id, password, teamname, represent_name, hp, logo_id ) VALUES ( '${id}', '${password}', '${teamname}', '${represent_name}', '${hp}', '${logo_id}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertId);
        });
    },

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

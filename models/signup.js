// 회원가입 :D

const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //signup 전체 조회
    getAllsignup : function (callback) {
        const querystring = `Select * from signup;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //user_id로 signup 조회
    getuser_id: function (logo_id, callback) {
        const querystring = `SELECT * FROM signup Where user_id= ${user_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                console.log("found signup: ", result[0]);
                callback(result[0]);
            }
            // 결과가 없을 시 
            result({kind: "not_found"}, null);
        })
    },

    //signup에 회원 정보(아이디,비밀번호,팀이름,팀대표자명,연락처,로고아이다) 삽입
    insertsignup: function ( user_id, password, teamname, represent_name, hp,  logo_id, callback ) {
        const querystring = `INSERT INTO signup ( user_id, password, teamname, represent_name, hp, logo_id ) VALUES ( '${user_id}', '${password}', '${teamname}', '${represent_name}', '${hp}', '${logo_id}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertId);
        });
    },

    //signup 정보 수정
    updatesignup: function (data, callback) {
        var querystring = `UPDATE signup SET user_id='${data.user_id}'`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    //signup 정보 삭제
    Deletesignup: function (id, callback) {
        mysql.query(`DELETE FROM signup WHERE user_id=${id}`, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
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

const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //TeamLogo 전체 조회
    getAllTeamLogo : function (callback) {
        const querystring = `Select * from TeamLogo;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //logo_id로 팀 로고 조회
    getlogo_id: function (logo_id, callback) {
        const querystring = `SELECT * FROM TeamLogo Where logo_id= ${logo_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                console.log("found TeamLogo: ", result[0]);
                callback(result[0]);
            }
            // 결과가 없을 시 
            result({kind: "not_found"}, null);
        })
    },

    //TeamLogo에 정보(팀아이디,사진url) 삽입
    insertTeamLogo: function ( user_id, url, callback ) {
        const querystring = `INSERT INTO TeamLogo ( user_id, url ) VALUES ( '${user_id}', '${url}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertTeamLogo);
        });
    },

    //TeamLogo 정보 수정
    updateTeamLogo: function (data, callback) {
        var querystring = `UPDATE TeamLogo SET user_id='${data.user_id}', url='${url}'`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    //TeamLogo 정보 삭제
    DeleteTeamLogo: function (id, callback) {
        mysql.query(`DELETE FROM TeamLogo WHERE logo_id=${id}`, (err, rows) => {
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

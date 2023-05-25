//아직 수정중 [김건태]

const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //Match 전체 조회
    getAllMatch : function (callback) {
        const querystring = `Select * from Match;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //match_id로 경기번호 조회
    getmatch_id: function (match_id, callback) {
        const querystring = `SELECT * FROM Match Where match_id= ${match_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                console.log("found Match: ", result[0]);
                callback(result[0]);
            }
            // 결과가 없을 시 
            result({kind: "not_found"}, null);
        })
    },

    //Match에 팀 삽입
    insertMatch: function ( home_userid, away_userid, match_time, match_place, created, updated, callback ) {
        const querystring = `INSERT INTO Team ( home_userid, away_userid, match_time, match_place, created, updated) VALUES ( '${home_userid}', '${away_userid}', '${match_time}', '${match_place}','${created}','${updated}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertId);
        });
    },

    //매치 정보 수정
    updateMatch: function (data, callback) {
        var querystring = `UPDATE Match SET match_time='${data.match_time}', match_place='${data.match_place}', updated='${data.updated}', WHERE match_id=${data.match_id}`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    //매치 정보 삭제
    DeleteMatch: function (id, callback) {
        mysql.query(`DELETE FROM Team WHERE match_id=${id}`, (err, rows) => {
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

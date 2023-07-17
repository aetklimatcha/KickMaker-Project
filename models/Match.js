const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //Match 전체 조회
    getAllMatch : function (callback) {
        const querystring = `Select * from Matches;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //match_id로 경기번호 조회
    getmatch_id: function (match_id, callback) {
        const querystring = `SELECT * FROM Matches Where match_id= ${match_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                console.log("조회"+match_id)
                callback(result[0]);
            } else if (result.length == 0){
                console.log("엥 이번호로 경기 조회 안돼"+match_id);
                callback(null);
            }
        })
    },

    //home_userid로 경기번호 조회
    gethome_id: function (home_userid, callback) {
        const querystring = `SELECT * FROM Matches Where home_userid= ${home_userid};`;
        mysql.query(querystring, function (error, result) {
            if (error) throw error;
            if (result.length) {
                callback(result);
            } else {
                callback("없음");
            }
        })
    },

    //home_userid로 경기번호 조회, '성립 경기만' (My match 전용)
    getmymatch: function (userid, callback) {
        const querystring = `SELECT * FROM Matches Where (home_userid= ${userid} OR away_userid= ${userid} )AND establishment='성립';`;
        mysql.query(querystring, function (error, result) {
            console.log(userid)
            if (error) throw error;
            if (result.length) {
                console.log("!")
                console.log(result);
                callback(result);
            } else {
                console.log("no")
                callback(null);
            }
        })
    },

    //Match 메이킹시에 매치 삽입
    insertMatch: function ( home_userid, match_date, match_place, match_time_start, match_time_end, created, callback ) {
        const querystring = `INSERT INTO Matches ( home_userid, match_date, match_place, match_time_start, match_time_end, created) VALUES ( '${home_userid}', '${match_date}','${match_place}','${match_time_start}','${match_time_end}','${created}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
        callback(rows.insertId);
        });
    },

    //매치 정보 수정
    updateMatch: function (data, callback) {
        var querystring = `UPDATE Matches SET match_time='${data.match_time}', match_place='${data.match_place}', updated='${data.updated}' WHERE match_id=${data.match_id}`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    // 경기 수락 시 매치 정보 수정
    updateMatch_accept: function (data, callback) {
        var querystring = `UPDATE Matches SET away_userid=${data.RQuserid}, match_time='${data.RQstart}', match_place='${data.RQplace}',establishment='성립' WHERE match_id=${data.match_id}`;
        mysql.query(querystring, (err, rows) => {
            if (err) throw err;

            callback(rows);
        })
    },

    //매치 정보 삭제
    DeleteMatch: function (id, callback) {
        mysql.query(`DELETE FROM Matches WHERE match_id=${id}`, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

}

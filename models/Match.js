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

    getAllnoMatch : function (userid, callback) {
        const querystring = `Select * from Matches where establishment = '미성립' AND home_userid != ${userid};`;
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
                callback(result[0]);
            } else if (result.length == 0){
                console.log("엥 이번호로 경기 조회 안돼 매치번호: "+match_id);
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
                callback(null);
            }
        })
    },

    getrecentmatch : function (callback) {
        const querystring = 
        `SELECT *
        FROM Matches
        ORDER BY match_id DESC
        LIMIT 5;`;
        mysql.query(querystring, function (error, result) {
            try {
                callback(result);
            } catch (error) {
                console.error(error);
                callback(null);
            }
        })
    },

    //home_userid로 경기번호 조회, '성립 경기만' (My match 전용)
    getmymatch: function (userid, callback) {
        // SELECT match_id, match_place,
        // DATE_FORMAT(match_date,'%Y%m%d') AS match_date, 
        // DATE_FORMAT(match_time,'%H%i') AS match_time,
        // establishment, stadium, home_userid, away_userid
        const querystring = 
        `SELECT *
        FROM Matches 
        Where (home_userid= ${userid} OR away_userid= ${userid} )AND establishment='성립';`;
        mysql.query(querystring, function (error, result) {
            console.log('at getmymatch '+ userid)
            // if (error) throw error;
            if (result) {
                // console.log("!")
                // console.log(result);
                callback(result);
            } else {
                console.log("no")
                callback(null);
            }
        })
    },

    //Match 메이킹시에 매치 삽입
    insertMatch: function ( home_userid, match_date, match_place, match_time, created, stadium, nx, ny, callback ) {
        const querystring = `INSERT INTO Matches ( home_userid, match_date, match_place, match_time, created, stadium, nx, ny) VALUES ( '${home_userid}', '${match_date}','${match_place}','${match_time}','${created}', '${stadium}', '${nx}' , '${ny}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
        callback(rows.insertId);
        });
    },

    //매치 정보 수정
    updateMatch: function (data, callback) {
        var querystring = `UPDATE Matches SET match_date = '${data.gameDate}', match_time='${data.gameTime}', match_place='${data.district}', updated= NOW() WHERE match_id=${data.match_id}`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );
            callback(rows);
        })
    },

    // 경기 수락 시 매치 정보 수정
    updateMatch_accept: function (data, callback) {
        var querystring = `UPDATE Matches SET away_userid=${data.RQuserid}, establishment='성립' WHERE match_id=${data.match_id}`;
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

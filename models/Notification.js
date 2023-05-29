const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //Notification 전체 조회
    getAllNotification : function (callback) {
        const querystring = `Select * from Notification;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //notif_id로 팀 로고 조회
    getnotif_id: function (notif_id, callback) {
        const querystring = `SELECT * FROM Notification Where notif_id= ${notif_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                console.log("found Notification: ", result[0]);
                callback(result[0]);
            }
            // 결과가 없을 시 
            result({kind: "not_found"}, null);
        })
    },

    //Notification에 정보(경기번호, 팀아이디, 경기장소) 삽입
    insertNotification: function ( match_id, userid, match_place ) {
        const querystring = `INSERT INTO Notification ( match_id, userid, match_place ) VALUES ( '${match_id}', '${userid}', '${match_place}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertNotification);
        });
    },

    //Notification 정보 수정
    updateNotification: function (data, callback) {
        var querystring = `UPDATE Notification SET match_id='${data.match_id}', userid='${data.userid}', match_place='${data.match_place}'`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    //Notification 정보 삭제
    DeleteNotification: function (id, callback) {
        mysql.query(`DELETE FROM Notification WHERE notif_id=${id}`, (err, rows) => {
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

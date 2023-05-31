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

    //notif_id로 팀 알림 조회
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

    //receive_userid로 팀 알림 조회
    getnotif_userid: function (receive_userid, callback) {
        if (receive_userid == undefined) {
            callback("0");
        } else {
            const querystring = `SELECT * FROM Notification Where receive_userid= ${receive_userid};`;
            mysql.query(querystring, function (error, result) {
                if (error) throw error;
                callback(result);
            })
        }
    },

    //Notification에 정보(경기번호, 팀아이디, 경기장소) 삽입
    insertNotification: function ( match_id, receive_userid, request_userid,request_teamname,requesttype,match_date,overlap_start ,match_place, callback ) {
        const querystring = `INSERT INTO Notification ( match_id, receive_userid, request_userid,request_teamname,requesttype,match_date,overlap_start ,match_place ) VALUES ( ${match_id}, ${receive_userid}, ${request_userid},'${request_teamname}','${requesttype}','${match_date}', '${overlap_start}','${match_place}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            callback("1");
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

    //Notification 정보 삭제
    DeleteNotification_matchid: function (match_id, callback) {
        mysql.query(`DELETE FROM Notification WHERE match_id=${match_id}`, (err, rows) => {
            if (err) throw err;
            callback(rows)
        })
    }


}

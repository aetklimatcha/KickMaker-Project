const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //TeamReview 전체 조회
    getAllTeamReview : function (callback) {
        const querystring = `Select * from TeamReview;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //review_id로 팀 로고 조회
    getreview_id: function (review_id, callback) {
        const querystring = `SELECT * FROM TeamReview Where review_id= ${review_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                callback(result[0]);
            }
            // 결과가 없을 시 
            callback({ kind: "not_found" });
        })
    },

    //review_id로 팀 로고 조회
    getreview_matchid: function (match_id, callback) {
        const querystring = `
            SELECT TeamReview.*,
            DATE_FORMAT(Matches.match_date, '%Y-%m-%d') as match_date, 
            Matches.stadium
            FROM TeamReview 
            INNER JOIN
            Matches ON TeamReview.match_id = Matches.match_id 
            Where TeamReview.match_id= ${match_id};`;
        mysql.query(querystring, function (error, result) {
            if (error) throw error;
            if (result.length) {
                callback(result[0]);
            }
    // 결과가 없을 시 
                callback({kind: "not_found"});
            })
        },

    //TeamReview에 정보(경기번호, 팀아이디, 경기결과, 매너평점) 삽입
    insertTeamReview: function ( match_id, callback ) {
        const querystring = `INSERT INTO TeamReview ( match_id ) VALUES ('${match_id}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err; 
        callback(rows);
        });
    },

    //TeamReview 정보 수정
    updateTeamReview: function (data, callback) {
        var querystring = `UPDATE TeamReview SET ${data};`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;

            callback(rows);
        })
    },

    //TeamReview 정보 삭제
    DeleteTeamReviewv: function (id, callback) {
        mysql.query(`DELETE FROM TeamReview WHERE review_id=${id}`, (err, rows) => {
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

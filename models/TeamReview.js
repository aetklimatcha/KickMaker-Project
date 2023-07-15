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
                console.log("found TeamReview: ", result[0]);
                callback(result[0]);
            }
            // 결과가 없을 시 
            result({kind: "not_found"}, null);
        })
    },

    //TeamReview에 정보(경기번호, 팀아이디, 경기결과, 매너평점) 삽입
    insertTeamReview: function ( match_id, user_id, result, manner_rate, callback ) {
        const querystring = `INSERT INTO TeamReview ( match_id, user_id, result, manner_rate ) VALUES ( '${match_id}', '${user_id}', '${result}', '${manner_rate}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertTeamReview);
        });
    },

    //TeamReview 정보 수정
    updateTeamReview: function (data, callback) {
        var querystring = `UPDATE TeamReview SET match_id='${data.match_id}', user_id='${data.userid}', result='${data.result}', manner_rate='${data.manner_rate}'`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

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

const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    //Team 전체 조회
    getAllTeam : function (callback) {
        const querystring = `Select * from Team;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    },

    //user_id로 단일 TEam 조회
    getOneTeam: function (user_id, callback) {
        const querystring = `SELECT * FROM Team Where user_id= ${user_id} limit 1;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                console.log("found2 team: ", result[0]);
                callback(result[0]);
            }
            // 결과가 없을 시 
            result({kind: "not_found"}, null);
        })
    },





    }


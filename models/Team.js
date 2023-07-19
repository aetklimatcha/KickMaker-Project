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
        if(user_id == null){
            callback(null);
        }else {
            const querystring = `SELECT * FROM Team Where user_id= ${user_id} limit 1;`;
            mysql.query(querystring, function (error, result) {
                if ( error ) throw error;
                if(result.length) {
                    callback(result[0]);
                } else {
                    // 결과가 없을 시 
                    callback(null);
                }
            })
        }
    },

        //id password로 단일 TEam 조회 (로그인)
    getLoginTeam: function (id,password, callback) {
        const querystring = `SELECT * FROM Team Where id= '${id}' and password = '${password}';`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            if(result.length) {
                callback(result[0]);
            }
            // 결과가 없을 시 
            else {
                callback(null);
            }
        })
    },

    //Team에 팀 삽입
    insertTeam: function ( id, password, teamname, represent_name, hp, callback ) {
        const querystring = `INSERT INTO Team ( id, password, teamname, represent_name, hp) VALUES ( '${id}', '${password}', '${teamname}', '${represent_name}','${hp}');`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows ); 
        callback(rows.insertId);
        });
    },

    //팀 정보 수정
    updateTeam: function (data, user_id, callback) {

        var querystring = `UPDATE Team SET id='${data.id}', password='${data.password}', teamname='${data.teamname}', represent_name='${data.represent_name}', hp='${data.hp}', logo_image='${data.logo_image}' WHERE user_id=${user_id}`;
        mysql.query(querystring, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    //팀 정보 삭제
    DeleteTeam: function (id, callback) {
        mysql.query(`DELETE FROM Team WHERE user_id=${id}`, (err, rows) => {
            if ( err ) throw err;
            console.log( rows );

            callback(rows);
        })
    },

    updateAfterMatch: function (data, user_id,callback) {

        var querystring = `UPDATE Team SET totalMatches = totalMatches+1,  WHERE user_id=${user_id}`;
        mysql.query(querystring, (err, rows) => {
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

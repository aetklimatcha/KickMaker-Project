const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    getTeam : function (callback) {
        const querystring = "Select * from Team";
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
        }
    }
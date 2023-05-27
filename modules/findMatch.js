const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    findMatch : function (matchid) {
        const querystring = `Select * from Matches;`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            callback(result);
        })
    }

}

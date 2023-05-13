const { response } = require("express");
const mysql = require("../config/mysql");

module.exports = {

    getTeam : function (param) {
        mysql.query("Select * from Team", function (err, result) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                return result;
            }
        })
    }

}
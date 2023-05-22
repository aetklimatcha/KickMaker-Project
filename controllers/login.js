const path = require("path");
const model = require("../models/model");

exports.loginview = (req, res) => {
    model.getAllTeam(function( result ) {
        res.render(path.join(__dirname + '/../views/login_demo.ejs'), {
            title: "testtitle",
            Team: result
        });
        console.log(result);
    });
};


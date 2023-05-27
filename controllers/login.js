const path = require("path");
const model = require("../models/Team");
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

module.exports= {
    loginview : (req, res) => {
        model.getAllTeam(function( result ) {
            res.render(path.join(__dirname + '/../views/signin.ejs'), {
                title: "testtitle",
                Team: result
            });
            //console.log(result);
        });  
    },

    login_process : (req, res) => {
        model.getLoginTeam(req.body.id,req.body.pass,function( result ) {
            console.log(result);
            payload = result.user_id;
            login_success();
        }); 
        
        function login_success () {
            token = jwt.sign(payload,secretKey,options);  
            console.log(token);
            res.cookie('token',token)
            res.redirect('/')
        }
    },

    logout : (req, res) => {
        res.cookie('token', null, {
            maxAge: 0,
        });
        res.redirect('/')
    } 
}

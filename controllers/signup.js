// 회원가입 :D
const path = require("path");
const model = require("../models/signup");


module.exports= {
    signup : (req, res) => {
        if(req.file.filename == null) 
            req.file.filename = 'default.jpg';
        model.insertsignup(req.body.id, req.body.password, req.body.teamname, req.body.represent_name, req.body.hp, req.file.filename,function( result ) {
            res.redirect('/')
        });  
    }
}

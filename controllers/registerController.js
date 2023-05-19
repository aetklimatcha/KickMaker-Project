// 회원가입

const connection = require('../config/mysql');

module.exports.register = function( req , res ){
    const today = new Date();
    const users = {
        'name'       : req.body.name,
        'email'      : req.body.email,
        'password'   : req.body.password,
        'created_at' : today,
        'updated_at' : today
    }

    connection.query('INSERT INTO users SET ?', users , function (error, results, fields) {
      if (error) {
        res.json({
            status  : false,
            message : "error"
        })
      } else {
          res.json({
            status  : true,
            data    : results,
            message : "회원가입 성공!"
        })
      }
    });
}
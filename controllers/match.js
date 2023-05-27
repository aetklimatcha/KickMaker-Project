const path = require("path");
const model = require("../models/Match");
require('dotenv').config();

module.exports = {

    match_making : (req, res) => {
        
        
        console.log(req.user_id);
        var match_place = req.body.district;
        
        var created = new Date();
        var match_time_start = req.body.gameStartTime;
        var match_time_end = req.body.gameEndTime;

        console.log(created);
        console.log(req.body.gameDay);
        console.log(match_time_start);
        console.log(match_time_end);

        model.insertMatch(req.user_id, match_place, created,match_time_start,match_time_end,function( result ) {
            res.redirect('/')
        });          
    }
}
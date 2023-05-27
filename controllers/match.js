const path = require("path");
const model = require("../models/Match");
require('dotenv').config();

module.exports = {

    match_making : (req, res) => {
        
        
        console.log(req.user_id);
        var match_place = req.body.district;
        var created = new Date();
        console.log(match_place);
        console.log(created);
        var match_time_start = req.body.gameStartTime;
        var match_time_end = req.body.gameEndTime;

        model.insertMatch(req.user_id, match_place, created,match_time_start,match_time_end,function( result ) {
            res.redirect('/')
        });          
    }
}
const path = require("path");
const model = require("../models/Match");
const findMatch = require("../modules/findMatch");
const { match } = require("assert");
require('dotenv').config();

module.exports = {

    match_making : (req, res) => {
        
        
        console.log(req.user_id);
        var match_place = req.body.district;
        
        var matchDay = req.body.gameDay;
        var match_time_start = req.body.gameStartTime;
        var match_time_end = req.body.gameEndTime;

        var currentDate = new Date();
        var created = currentDate.toISOString().replace('T', ' ').substr(0, 19);
        console.log(created);

        match_time_start = matchDay+" "+match_time_start;
        match_time_end = matchDay+" "+match_time_end;
        console.log(match_time_start);
        console.log(match_time_end);

        // model.insertMatch(req.user_id, match_place, created,match_time_start,match_time_end,function( result ) { 
        //     var matchStatus = findMatch.findMatch(result);
        //     if (matchStatus) {
        //         res.redirect('/')
        //     }else {

        //     }
        // });          
    }
}
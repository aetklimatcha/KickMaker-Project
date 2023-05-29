const { response } = require("express");
const mysql = require("../config/mysql");
const match = require("../controllers/match");

module.exports = {

    //input : insert된 user_id
    //output : 

    findMatch : function (info, callback) {

        // info = {
        //     place:match_place,
        //     date:gameDate,
        //     starttime:match_time_start,
        //     endtime:match_time_end
        // };

        const querystring = 
        `SELECT match_id, match_place, 
        DATE_FORMAT(match_date, '%Y-%m-%d') as match_date, 
        GREATEST(match_time_start, '${info.starttime}') AS overlap_start,
        LEAST(match_time_end, '${info.endtime}') AS overlap_end,
        home_userid
        FROM Matches
        WHERE match_date = '${info.date}'
        AND match_time_start <= '${info.endtime}'
        AND match_time_end >= '${info.starttime}';`;
        mysql.query(querystring, function (error, result) {
            if ( error ) throw error;
            var results = placeMatch(info.place, result);
            enterTeaminfo(results,(matchData)=>{
                matchAvailability = (results.length === 0) ? false : true;
                results = matchData;
                callback(results, matchAvailability);
            });
            
        })             
    }
}

// function enterTeaminfo(matchData, callback) {
//     for (let i = 0; i < matchData.length; i++) {
//         user_id = matchData[i].home_userid;
//         console.log(user_id);
//         const querystring = `SELECT teamname FROM Team Where user_id= ${user_id} limit 1;`;
//         mysql.query(querystring, function (error, result) {
//             if (result.length) {
//                 matchData[i].teamname = result[0].teamname;
//             }
//             console.log('함수중');
//         })
//     }
//     callback(matchData);
// }

function enterTeaminfo(matchData, callback) {
    let count = 0; // 완료된 콜백 함수 수를 추적하기 위한 변수
    if (matchData.length===0) {
        callback(matchData);
    }
    for (let i = 0; i < matchData.length; i++) {
        user_id = matchData[i].home_userid;
        console.log(user_id);
        const querystring = `SELECT teamname FROM Team WHERE user_id = ${user_id} LIMIT 1;`;
        mysql.query(querystring, function (error, result) {
            if (result.length) {
                matchData[i].teamname = result[0].teamname;
            }
            count++; // 콜백 함수 완료 카운트 증가
            if (count === matchData.length) {
                // 모든 콜백 함수가 완료되었을 때 callback 호출
                callback(matchData);
            }
        });
    }
}




//기존에 있던 array 배열의 장소에서, user_place의 장소와 겹치는 부분을 찾아서 반환해라! 아니면 없다고 보내라! 
function placeMatch (user_place, matchData) {
    if (typeof(user_place)=='string') {
        sepnum = 1;
        var user_place = [user_place];
    } else {
        sepnum = user_place.length;
    }
    var venue = new Array();
    var delnum = [];
    for (var i =0; i < matchData.length; i++) {
        venue[i] = matchData[i].match_place.split(',');
    }
    for (var i = 0; i < venue.length; i++) {
        var temp = [];
        var del = true;
        for(var j =0; j < sepnum; j++) {
            //venue[i]에 user_place값이 있는경우
            if(venue[i].includes(user_place[j])) {
                //해당 venue의 match_place값을 일치하는 user_place값들로만 수정
                var num = venue[i].indexOf(user_place[j]);
                temp.push(venue[i][num]);
                del = false;                     
            }
            //venue[i]에 user_place값이 없는경우 
            else { 
            }
        }
        if(del == false) {
            matchData[i].match_place = temp;
        } else if (del == true) {
            delnum.push(i);
        }
    }
    //뒤에서부터 자름
    for(var i = delnum.length-1; i>=0; i--) {
        matchData.splice(delnum[i],1);
    }
    return matchData;
}
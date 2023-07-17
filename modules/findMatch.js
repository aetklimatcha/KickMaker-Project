const { response } = require("express");
const mysql = require("../config/mysql");
const match = require("../controllers/match");
const rebatch = require("./rebatch");

module.exports = {

    //input : insert된 user_id
    //output : 

    findMatch : function (info, callback) {

        //info = 홈페이지에서 넘어온 data (내가 찾는 중)
        

        // var info = {
        //     user_id: req.user_id,
        //     win_score : user.win_score,
        //     manner_score : user.manner_score,
        //     place:match_place,
        //     date:gameDate,
        //     time:match_time
        // };

        // const querystring = 
        // `SELECT match_id, match_place, 
        // DATE_FORMAT(match_date, '%Y-%m-%d') as match_date, 
        // TIME_FORMAT(GREATEST(match_time_start, '${info.starttime}'),'%H:%i') AS overlap_start,
        // TIME_FORMAT(LEAST(match_time_end, '${info.endtime}'),'%H:%i') AS overlap_end,
        // home_userid, establishment
        // FROM Matches
        // WHERE match_date = '${info.date}'
        // AND match_time_start <= '${info.endtime}'
        // AND match_time_end >= '${info.starttime}';`

        const querystring = 
        `SELECT match_id, match_place, 
        DATE_FORMAT(match_date, '%Y-%m-%d') as match_date, 
        TIME_FORMAT('${info.time}','%H:%i') as match_time,
        home_userid, establishment
        FROM Matches
        WHERE match_date = '${info.date}'
        AND match_time = '${info.time}';`

        mysql.query(querystring, function (error, result) {
            console.log('info at findmatch')
            console.log(info);
            console.log('시간찾기 at findmatch')
            console.log(result);
            if ( error ) throw error;
            var results = idplaceMatch(info.user_id,info.place, result);
            enterTeaminfo(results,(matchData)=>{
                matchAvailability = (results.length === 0) ? false : true;
                results = matchData;

                //rebatch : 승률과 매너 가까운 순 나열
                rebatch.rebatch(info, results, (final)=>{
                    callback(final, matchAvailability);
                });               
            });
            
        })             
    }
}

function enterTeaminfo(matchData, callback) {
    let count = 0; // 완료된 콜백 함수 수를 추적하기 위한 변수
    if (matchData.length===0) {
        callback(matchData);
    }
    for (let i = 0; i < matchData.length; i++) {
        user_id = matchData[i].home_userid;
        const querystring = `SELECT teamname, win_score, manner_score FROM Team WHERE user_id = ${user_id} LIMIT 1;`;
        mysql.query(querystring, function (error, result) {
            if (result.length) {
                matchData[i].teamname = result[0].teamname;
                matchData[i].win_score = result[0].win_score;
                matchData[i].manner_score = result[0].manner_score;
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
function idplaceMatch (user_id, user_place, matchData) {
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
            if (user_id == matchData[i].home_userid){ 
                del = true;
            }
            if (matchData[i].establishment == '성립'){ 
                del = true;
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
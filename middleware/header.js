const team = require("../models/Team");
const match = require("../models/Match");
const notif = require("../models/Notification");

exports.header = async (req, res, next) => {
    try {
        const isLogin = !!req.user_id;

        if (isLogin) {

            const headerData = await new Promise((resolve) => {
                team.getNotifAndTeamInfo(req.user_id, resolve);
            });


            var notifArray = []
            headerData.forEach(element => {
                const notifications = {
                    notif_id: element.notif_id,
                    match_id: element.match_id,
                    receive_userid: element.receive_userid,
                    request_userid: element.request_userid,
                    request_teamname: element.request_teamname,
                    requesttype: element.requesttype,
                    match_date: element.match_date,
                    match_time: element.match_time,
                    match_place: element.match_place,
                }
                notifArray.push(notifications)
            });

            const userData = headerData[0];
            const loginresult = {
                user_id: userData.user_id,
                id: userData.id,
                password: userData.password,
                teamname: userData.teamname,
                represent_name: userData.represent_name,
                hp: userData.hp,
                win_score: userData.win_score,
                manner_score: userData.manner_score,
                logo_id: userData.logo_id,
                totalMatches: userData.totalMatches,
                win: userData.win,
                draw: userData.draw,
                lose: userData.lose,
                logo_image: userData.logo_image
            }

            req.header = {
                notifications: notifArray,
                loginresult: loginresult
            }

        } else if (!isLogin) {
            req.header = {
                notifications: null,
                loginresult: null
            }
        }

        next();
    } catch (err) {

        next();
    }
};
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

            const notifications = {
                notif_id: headerData.notif_id,
                match_id: headerData.match_id,
                receive_userid: headerData.receive_userid,
                request_userid: headerData.request_userid,
                request_teamname: headerData.request_teamname,
                requesttype: headerData.requesttype,
                match_date: headerData.match_date,
                match_time: headerData.match_time,
                match_place: headerData.match_place,
            }

            const loginresult = {
                user_id: headerData.user_id,
                id: headerData.id,
                password: headerData.password,
                teamname: headerData.teamname,
                represent_name: headerData.represent_name,
                hp: headerData.hp,
                win_score: headerData.win_score,
                manner_score: headerData.manner_score,
                logo_id: headerData.logo_id,
                totalMatches: headerData.totalMatches,
                win: headerData.win,
                draw: headerData.draw,
                lose: headerData.lose,
                logo_image: headerData.logo_image
            }

            req.header = {
                notifications: notifications,
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
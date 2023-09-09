require("dotenv").config({ path: "./config/.env" });

const path = require("path");

const notif = require("../models/Notification");

const { log } = require("console");

const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;

module.exports = {

    check: async (req, res) => {
        try {
            const recentmatch = await new Promise((resolve) => {
                notif.DeleteNotification(notif_id, resolve);
                res.redirect('/game/my-match');
            });

        } catch (error) {
            console.error(error);
            // Handle error response
            res.write("<script>alert('에러가 발생하였습니다.')</script>");
            res.write("<script>window.location=\"/\"</script>");
            res.end();
        }
    }

}
require("dotenv").config({ path: "./config/.env" });

const path = require("path");

const team = require("../models/Team");


module.exports = {

    team_infoview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/team_info.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
    },

    edit_teamview: async (req, res) => {
        res.render(path.join(__dirname + '/../views/edit_team.ejs'), {
            loginTeam: req.header.loginresult,
            notifications: req.header.notifications,
        });
    },

    edit_team: async (req, res) => {
        try {
            // {
            // id: 'gangdong',
            // password: '2222',
            // teamname: 'FC강동',
            // represent_name: '허이구',
            // hp: '010-2222-2222'
            // }

            const result = await new Promise((resolve) => {
                team.getOneTeam(req.user_id, resolve);
            });

            //파일이 있는 경우
            if (req.file.filename != null) {
                var new_image = req.file.filename;
                var old_image = result.logo_image;

                if (old_image != 'default.jpg') {
                    console.log(old_image);
                    fs.unlink(`../files/${old_image}`, err => {
                        if (err.code == 'ENOENT') {
                            console.log("파일 삭제 Error 발생");
                        }
                    });
                }
                req.body.logo_image = new_image;
            } else if (req.file.filename == null) {
                req.body.logo_image = old_image;
            }

            

            team.updateTeam(req.body, req.user_id, function (result) {
                console.log(req.body);
                res.cookie('usertoken', null, {
                    maxAge: 0,
                });
                res.redirect('/');
            });
        } catch (error) {
            console.error(error);
            // Handle error response
        }
    },

}
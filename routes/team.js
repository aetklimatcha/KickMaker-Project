const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const main = require('../controllers/main');
const login = require('../controllers/login');
const signup = require("../controllers/signup");

// team
router.get('/my-match', cookieJwtAuth,header,main.my_matchview);
router.get('/team-info', cookieJwtAuth,header,main.team_infoview);
router.get('/edit-team', cookieJwtAuth,header,main.edit_teamview);

router.post('/edit-team', cookieJwtAuth,header, uploadMiddleware, login.edit_team);

module.exports = router; 
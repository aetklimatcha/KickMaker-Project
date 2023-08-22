const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');

const main = require('../controllers/main');
const match = require("../controllers/match");

// matching

router.get('/match-list',cookieJwtAuth,header, main.match_listview);
router.get('/match-making', cookieJwtAuth,header,main.match_makingview);
router.get('/noMatch',cookieJwtAuth,header, main.noMatchview);
router.get('/matched', cookieJwtAuth,header,main.matchedview);
router.get('/confirm-place',cookieJwtAuth,header, main.confirm_placeview);

router.post('/match-making', cookieJwtAuth,header,match.match_making);
router.post('/request', cookieJwtAuth,header,match.match_request);
router.post('/confirm-place', cookieJwtAuth,header,match.insertMatch);

module.exports = router; 
const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');

const main = require('../controllers/main');
const match = require("../controllers/match");
const review = require("../controllers/review");

// match
router.get('/match/:id', cookieJwtAuth,header,main.matchview);
router.get('/registered-match', cookieJwtAuth,header,main.registered_matchview);
router.get('/requested-match', cookieJwtAuth,header,main.requested_matchview);
router.get('/edit-match', cookieJwtAuth,header,main.edit_matchview);
router.get('/team-review/:pageId', cookieJwtAuth,header,main.team_reviewview);

router.post('/team-review/:pageId', cookieJwtAuth,header,review.team_review);
router.post('/match-accept', cookieJwtAuth,header,match.match_accept);
router.post('/match-reject', cookieJwtAuth,header,match.match_reject);
router.post('/cancel-match', cookieJwtAuth,header,match.cancel_match);

module.exports = router; 
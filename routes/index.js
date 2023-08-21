const express = require("express");
const router = express.Router();

const main = require('../controllers/main');
const signup = require("../controllers/signup");
const login = require('../controllers/login');

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const team = require('./team');
const game = require('./game');
const matching = require('./matching');

//ejs 파일들 연결 페이지
/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: "메인 페이지 조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [메인]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "유저1" },
 *                            { "id": 2, "name": "유저2" },
 *                            { "id": 3, "name": "유저3" },
 *                          ]
 */
// main
router.get('/', cookieJwtAuth,header,main.mainview);
router.get('/signin',cookieJwtAuth,header, main.signinview)
router.get('/signup',cookieJwtAuth,header, main.signupview);

router.post('/login',login.login_process);
router.post('/logout',login.logout);
router.post('/signup', uploadMiddleware,signup.signup);
router.post('/tomain', cookieJwtAuth,header,main.tomain);

//test page
router.get('/maptest', cookieJwtAuth,header,main.maptestview);
router.post('/upload',main.upload);

router.use('/team', team);
router.use('/game', game);
router.use('/matching', matching);

module.exports = router;

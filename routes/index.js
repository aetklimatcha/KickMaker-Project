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

// main

/**
@swagger
 * /:
 *   get:
 *     summary: "메인 페이지 조회"
 *     description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *     tags: [Main]
 *     responses:
 *       "200":
 *         description: 헤더 , isLogin = 로그인 여부, recentMatch = 최근 등록 5개 매치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   isLogin:
 *                     type: boolean
 *                   loginTeam:
 *                     $ref: '#/components/schemas/Team'
 *                   notifications:
 *                     $ref: '#/components/schemas/Notification'
 *                   recentmatch:
 *                     example:
 *                         - match_id: 181
 *                           home_userid: 2
 *                           away_userid: 38
 *                           match_date: '2023-08-20'
 *                           match_time: '11:00:00'
 *                           match_place: 서초구
 *                           created: 2023-08-19T15:00:00.000Z
 *                           updated: null
 *                           establishment: 성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,
 *                           nx: 127.017
 *                           ny: 37.5256
 *                         - match_id: 180
 *                           home_userid: 2
 *                           away_userid: 38
 *                           match_date: '2023-08-10'
 *                           match_time: '23:00:00'
 *                           match_place: 강북구
 *                           created: 2023-07-29T15:00:00.000Z
 *                           updated: null
 *                           establishment: 성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,반포종합운동장,우면체육시설
 *                           nx: 127.017
 *                           ny: 37.5256
 *                         - match_id: 177
 *                           home_userid: 41
 *                           away_userid: null
 *                           match_date: '2023-07-26'
 *                           match_time: '11:00:00'
 *                           match_place: 서초구
 *                           created: 2023-07-20T15:00:00.000Z
 *                           updated: null
 *                           establishment: 미성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,반포종합운동장,우면체육시설
 *                           nx: 127.017
 *                           ny: 37.5256
 *                         - match_id: 173
 *                           home_userid: 6
 *                           away_userid: null
 *                           match_date: '2023-08-03'
 *                           match_time: '17:30:00'
 *                           match_place: 송파구
 *                           created: 2023-07-20T15:00:00.000Z
 *                           updated: null
 *                           establishment: 미성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,반포종합운동장,우면체육시설
 *                           nx: 126.992
 *                           ny: 37.473
 *                         - match_id: 169
 *                           home_userid: 38
 *                           away_userid: null
 *                           match_date: '2023-07-29'
 *                           match_time: '19:30:00'
 *                           match_place: 마포구
 *                           created: 2023-07-19T15:00:00.000Z
 *                           updated: null
 *                           establishment: 미성립
 *                           stadium: null
 *                           nx: null
 *                           ny: null
 */
router.get('/', cookieJwtAuth,header,main.mainview);
/**
 * @swagger
 * paths:
 *  /signin:
 *    get:
 *      summary: "로그인 페이지 조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Main]
 *      responses:
 *       "200":
 *         description: 헤더
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   loginTeam:
 *                     $ref: '#/components/schemas/Team'
 *                   notifications:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/signin',cookieJwtAuth,header, main.signinview)
/**
 * @swagger
 * paths:
 *  /signup:
 *    get:
 *      summary: "회원가입 페이지 조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Main]
 *      responses:
 *       "200":
 *         description: 헤더
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   loginTeam:
 *                     $ref: '#/components/schemas/Team'
 *                   notifications:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/signup',cookieJwtAuth,header, main.signupview);

/**
 * @swagger
 * paths:
 *  /login:
 *    post:
 *      summary: "로그인 정보 전송"
 *      description: "아이디, password 전송"
 *      tags: [Main]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           id: 
 *            type: string
 *           password: 
 *            type: string      
 *      responses:
 *       "200":
 *         description: 유저토큰 발급 , 메인페이지 리다이렉션
 *       "실패":
 *         description: "로그인에 실패하였습니다"
 */
router.post('/login',login.login_process);
/**
 * @swagger
 * paths:
 *  /logout:
 *    post:
 *      summary: "로그아웃"
 *      description: "유저토큰 해제"
 *      tags: [Main]
 *      responses:
 *       "200":
 *         description: 메인페이지 리다이렉션
 */
router.post('/logout',login.logout);
/**
 * @swagger
 * paths:
 *  /signup:
 *    post:
 *      summary: "회원가입 정보 전송"
 *      description: "아이디, password 전송"
 *      tags: [Main]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           id: 
 *            type: string
 *           password: 
 *            type: string 
 *           teamname: 
 *            type: string
 *           represent_name: 
 *            type: string     
 *           hp: 
 *            type: string  
 *      responses:
 *       "200":
 *         description: 메인페이지 리다이렉션
 */
router.post('/signup', uploadMiddleware,signup.signup);

/**
 * @swagger
 * paths:
 *  /tomain:
 *    post:
 *      summary: "메인페이지 이동"
 *      description: "유저토큰 제외 모든 토큰 (findMatchestoken, myMatchtoken)해제"
 *      tags: [Main]
 *      responses:
 *       "200":
 *         description: 메인페이지 리다이렉션
 */
router.post('/tomain', cookieJwtAuth,header,main.tomain);

//test page
router.get('/maptest', cookieJwtAuth,header,main.maptestview);
router.post('/upload',main.upload);

router.use('/team', team);
router.use('/game', game);
router.use('/matching', matching);

module.exports = router;

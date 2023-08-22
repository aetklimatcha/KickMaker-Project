const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const main = require('../controllers/main');
const login = require('../controllers/login');
const signup = require("../controllers/signup");

// team

/**
@swagger
 * paths:
 *  /my-match:
 *    get:
 *      summary: "진행 예정/종료된 경기 목록 조회"
 *      description: "진행 예정/종료된 경기 목록 조회"
 *      tags: [Team]
 *      responses:
 *       "200":
 *         description: 헤더 생략, Matches 배열 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   Matches:
 *                     example:
 *                       - match_id: 180
 *                         home_userid: 2
 *                         away_userid: 38
 *                         match_date: '2023-08-10'
 *                         match_time: '23:00:00'
 *                         match_place: 강북구
 *                         created: 2023-07-29T15:00:00.000Z
 *                         updated: null
 *                         establishment: 성립
 *                         stadium: 잠원한강공원>축구장,방배배수지체육공원,반포종합운동장,우면체육시설
 *                         nx: 127.017
 *                         ny: 37.5256
 *                         home_teamname: FC강동
 *                         away_teamname: teamname
 *                         weather: DateOverError
 *                       - match_id: 181
 *                         home_userid: 2
 *                         away_userid: 38
 *                         match_date: '2023-08-24'
 *                         match_time: '11:00:00'
 *                         match_place: 서초구
 *                         created: 2023-08-19T15:00:00.000Z
 *                         updated: null
 *                         establishment: 성립
 *                         stadium: 잠원한강공원>축구장,방배배수지체육공원,
 *                         nx: 127.017
 *                         ny: 37.5256
 *                         home_teamname: FC강동
 *                         away_teamname: teamname
 *                         weather:
 *                           baseDate: '20230821'
 *                           fcstDate: '20230824'
 *                           fcstTime: '1100'
 *                           TMP: '27'
 *                           POP: '60'
 *                           PCP: 1.0mm
 */
router.get('/my-match', cookieJwtAuth,header,main.my_matchview);

/**
 * @swagger
 * paths:
 *  /signup:
 *    get:
 *      summary: "팀 정보 페이지"
 *      description: "팀 정보 페이지"
 *      tags: [Team]
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
router.get('/team-info', cookieJwtAuth,header,main.team_infoview);
/**
 * @swagger
 * paths:
 *  /edit-team:
 *    get:
 *      summary: "팀 정보 편집 페이지"
 *      description: "팀 정보 편집 페이지"
 *      tags: [Team]
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
 *    post:
 *      summary: "팀 정보 편집 요청 전송"
 *      description: "팀 정보 편집 요청 전송"
 *      tags: [Team]
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
 *           represent_name: 
 *            type: string
 *           hp: 
 *            type: string  
 *           profil_pic:
 *            type: image
 *      responses:
 *       "200":
 *         description: 메인페이지 리다이렉션
 */
router.get('/edit-team', cookieJwtAuth,header,main.edit_teamview);
router.post('/edit-team', cookieJwtAuth,header, uploadMiddleware, login.edit_team);

module.exports = router; 
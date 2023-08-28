const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');

const main = require('../controllers/main');
const match = require("../controllers/match");

// matching

/**
@swagger
 * /matching/match-list:
 *   get:
 *     summary: "등록된 미성립 경기 목록 페이지 조회"
 *     description: "등록된 미성립 경기 목록 페이지 조회"
 *     tags: [Matching]
 *     responses:
 *       "200":
 *         description: 헤더생략 , Matches = 미성립 전체 경기 목록 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   Matches:
 *                     example:
 *                         - match_id: 181
 *                           home_userid: 2
 *                           away_userid: 38
 *                           match_date: '2023-08-20'
 *                           match_time: '11:00:00'
 *                           match_place: 서초구
 *                           created: 2023-08-19T15:00:00.000Z
 *                           updated: null
 *                           establishment: 미성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,
 *                           nx: 127.017
 *                           ny: 37.5256
 */
router.get('/match-list',cookieJwtAuth,header, main.match_listview);

/**
 * @swagger
 * paths:
 *  /matching/match-making:
 *    get:
 *      summary: "경기 정보 작성 페이지"
 *      description: "경기 정보 작성 페이지"
 *      tags: [Matching]
 *      responses:
 *       "200":
 *         description: 헤더 생략
 *       "로그인x":
 *         description: /signin 리다이렉션
 *    post:
 *      summary: "작성 경기 정보 전송"
 *      description: "작성 경기 정보 전송"
 *      tags: [Matching]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           district: 
 *            type: string
 *           gameDate: 
 *            type: string      
 *           gameTime: 
 *            type: string
 *         examples:
 *          userExample:
 *              value: {
 *                  district: 도봉구,    
 *                  gameDate: 2023-08-10,
  *                 gameTime: 9:30
 *                     } 
 *      responses:
 *       "200":
 *         description: 찾은 매치 정보들 담아 findMatchestoken발급 /matched 리다이렉션
 *       "noMatch":
 *         description: 이전 제출 정보로 myMatchtoken발급 , /noMatch 리다이렉션
 */
router.get('/match-making', cookieJwtAuth,header,main.match_makingview);
router.post('/match-making', cookieJwtAuth,header,match.match_making);

/**
@swagger
 * /matching/noMatch:
 *   get:
 *     summary: "매칭 할 수 있는 팀 없는 경우 페이지 조회"
 *     description: "매칭 할 수 있는 팀 없는 경우 페이지 조회"
 *     tags: [Matching]
 *     responses:
 *       "200":
 *         description: 헤더생략
 */
router.get('/noMatch',cookieJwtAuth,header, main.noMatchview);

/**
@swagger
 * /matching/matched:
 *   get:
 *     summary: "매칭된 경기 목록 페이지 조회"
 *     description: "매칭된 경기 목록 페이지 조회"
 *     tags: [Matching]
 *     responses:
 *       "200":
 *         description: 헤더생략 , findTeams = 매칭된 경기 목록 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   findTeams:
 *                     example:
 *                         - match_id: 163
 *                           match_place: ['서초구']
 *                           match_date: '2023-08-20'
 *                           match_time: '11:00:00'
 *                           home_userid: 2
 *                           establishment: 미성립
 *                           teamname: 'FC나나'
 *                           win_score: 930
 *                           manner_score: 61
 */
router.get('/matched', cookieJwtAuth,header,main.matchedview);

/**
@swagger
 * /matching/confirm-place:
 *   get:
 *     summary: "장소 선정 페이지 조회"
 *     description: "장소 선정 페이지 조회"
 *     tags: [Matching]
 *     responses:
 *       "200":
 *         description: 헤더 생략, MAP_KEY = kakaomap키, stadium = 해당 지역의 경기장 목록 배열, myMatch = 매치메이킹 입력 정보 배열
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   MAP_KEY:
 *                      type: string
 *                   myMatch:
 *                      example:
 *                           user_id: '2'
 *                           win_score: 1496
 *                           manner_score: 45
 *                           place: '강서구'
 *                           date: '2023-07-25'
 *                           time: '12:00'
 *                   stadium:
 *                     example:
 *                       - name: '우면체육시설'
 *                         type: '다목적경기장'
 *                         nx: '127.02146457355181'
 *                         ny: '37.46104631450814'
 *                         url: 'https://yeyak.seoul.go.kr/web/reservation/selectReservView.do?rsv_svc_id=S230710160923857891'
 *                         tel: '02-2155-6211'
 *                       - name: '반포종합운동장'
 *                         type: '축구장'
 *                         nx: '126.9942640531'
 *                         ny: '37.5005393518'
 *                         url: 'https://yeyak.seoul.go.kr/web/reservation/selectReservView.do?rsv_svc_id=S230718193506206249'
 *                         tel: '02-2155-6214'
 *   post:
 *      summary: "설정된 경기장 정보로 매치 등록"
 *      description: "설정된 경기장 정보로 매치 등록"
 *      tags: [Matching]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           stadium: 
 *            type: string
 *           nx: 
 *            type: float     
 *           ny: 
 *            type: float
 *         examples:
 *          userExample:
 *              value: {
 *                  stadium: '반포종합운동장',    
 *                  nx: 126.9942640531,
  *                 ny: 37.5005393518
 *                     } 
 *      responses:
 *       "200":
 *         description: /team/registered-match 리다이렉션
 */
router.get('/confirm-place',cookieJwtAuth,header, main.confirm_placeview);
router.post('/confirm-place', cookieJwtAuth,header,match.insertMatch);


/**
@swagger
 * /matching/request:
 *   post:
 *      summary: "해당 경기 등록 팀에게 경기 요청"
 *      description: "해당 경기 등록 팀에게 경기 요청"
 *      tags: [Matching]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           match_id: 
 *            type: integer
 *           home_userid: 
 *            type: integer     
 *           teamname: 
 *            type: string
 *           match_date: 
 *            type: string
 *           match_time: 
 *            type: string     
 *           match_place: 
 *            type: string
 *         examples:
 *          userExample:
 *              value: {
 *                       home_userid: '6',
 *                       match_id: '163',
 *                       match_date: '2023-07-25',
 *                       match_place: '강서구',
 *                       match_time: '13:30',
 *                       teamname: 'FC나나'
 *                     } 
 *      responses:
 *       "200":
 *         description: notification db에 요청 삽입, 메인 리다이렉션
 */
router.post('/request', cookieJwtAuth,header,match.match_request);


module.exports = router; 
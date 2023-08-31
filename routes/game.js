const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');

const main = require('../controllers/main');
const match = require("../controllers/match");
const review = require("../controllers/review");

// match

router.get('/match/:id', cookieJwtAuth,header,main.matchview);

/**
@swagger
 * /game/registered-match:
 *   get:
 *     summary: "등록한 경기 페이지 조회"
 *     description: "등록한 경기 페이지"
 *     tags: [Game]
 *     responses:
 *       "200":
 *         description: 헤더생략 , Matches = 내가 등록해 놓은 모든 매치 배열
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
 *                           establishment: 성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,
 *                           nx: 127.017
 *                           ny: 37.5256
 */
router.get('/registered-match', cookieJwtAuth,header,main.registered_matchview);

/**
@swagger
 * paths:
 *  /game/my-match:
 *    get:
 *      summary: "진행 예정/종료된 경기 목록 조회"
 *      description: "진행 예정/종료된 경기 목록 조회"
 *      tags: [Game]
 *      responses:
 *       "200":
 *         description: 헤더 생략, Matches 배열 반환
 *           <br><br> o 중기예보 통보문에서 구름의 양에 따라 하늘상태를 3단계(맑음, 구름많음, 흐림)으로 표현, 현상에 따라 비, 눈, 비/눈, 소나기 로 표현하고 있으며, 이를 종합하여 함께 사용하고 있음
 *           <br><br> -맑음
 *           <br><br> -구름많음, 구름많고 비, 구름많고 눈, 구름많고 비/눈, 구름많고 소나기
 *           <br><br> -흐림, 흐리고 비, 흐리고 눈, 흐리고 비/눈, 흐리고 소나기
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   Matches:
 *                     example:
 *             examples:
 *              단기예보(3일 이내 경기):
 *                  value:
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
 *              중기예보(10일 이내 경기):
 *                  value:
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
 *                           POP: '60'
 *                           INFO: '흐리고 비'
 *                          
 *              경기지났거나 먼경우(10일 이상):
 *                  value:
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
 */ 
router.get('/my-match', cookieJwtAuth,header,main.my_matchview);

/**
@swagger
 * /game/requested-match:
 *   get:
 *     summary: "요청받은 경기 목록 페이지 조회"
 *     description: "요청받은 경기 목록"
 *     tags: [Game]
 *     responses:
 *       "200":
 *         description: 헤더생략 , matchinfo = 내게 요청된 경기 정보들 배열
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   matchinfo:
 *             examples:
 *              userExample:
 *                  value:
 *                    - notif_id: 55
 *                      requesttype: '요청'
 *                      match_id: 125
 *                      date: '2023-06-28'
 *                      time: '10:00:00'
 *                      RQuserid: 6
 *                      RQteamname: 'FC나나'
 *                      place: '강동구'
 */
router.get('/requested-match', cookieJwtAuth,header,main.requested_matchview);

/**
 * @swagger
 * paths:
 *  /game/edit-match/:pageId:
 *    get:
 *      summary: "매치 정보 편집 페이지"
 *      description: "매치 정보 편집 페이지"
 *      tags: [Game]
 *      responses:
 *       "200":
 *         description: 헤더 생략
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   Match:
 *                      example: 
 *                           {
 *                           match_id: 165,
 *                           home_userid: 2,
 *                           away_userid: null,
 *                           match_date: '2023-07-05',
 *                           match_time: '06:00:00',
 *                           match_place: '성동구',
 *                           created: 2023-07-18T15:00:00.000Z,
 *                           updated: null,
 *                           establishment: '미성립',
 *                           stadium: '어딘가운동장',
 *                           nx: null,
 *                           ny: null
 *                           }                     
 */
router.get('/edit-match/:pageId', cookieJwtAuth,header,main.edit_matchview);

/**
 * @swagger
 * paths:
 *  /game/team-review/:pageId?id={id}:
 *    get:
 *      summary: "리뷰 작성 페이지"
 *      description: "리뷰 작성 페이지"
 *      tags: [Game]
 *      parameters:
 *          - name: pageId
 *            description: matchid를 받음
 *            required: true
 *            schema:
 *              type: integer
 *          - name: Id
 *            description: qr로 전송된 암호화된 user_id를 받음 (알파벳 대칭)
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       "200":
 *         description: 헤더 제외, Match = pageId의 매치 정보
 *                      <br><br> http://localhost:3000/game/team-review/125?id=C 와 같은 링크로 접속 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   pageId:
 *                      type: integer
 *                   Match:
 *                     example:
 *                           match_id: 86
 *                           home_userid: 9
 *                           away_userid: 2
 *                           match_date: '2023-08-20'
 *                           match_time: '11:00:00'
 *                           match_place: 서초구
 *                           created: 2023-08-19T15:00:00.000Z
 *                           updated: null
 *                           establishment: 성립
 *                           stadium: 잠원한강공원>축구장,방배배수지체육공원,
 *                           nx: 127.017
 *                           ny: 37.5256
 *                           userTeam: {
 *                               user_id: 2,
 *                               id: 'gangdong',
 *                               password: '2222',
 *                               teamname: 'FC강동',
 *                               represent_name: '허이구',
 *                               hp: '010-5289-1929',
 *                               win_score: 1496,
 *                               manner_score: 45,
 *                               totalMatches: 9,
 *                               win: 5,
 *                               draw: 2,
 *                               lose: 2,
 *                               logo_image: 'default.jpg'
 *                           }
 *                           opponentTeam: {
 *                               user_id: 3,
 *                               id: 'seocho',
 *                               password: '3333',
 *                               teamname: 'FC서초',
 *                               represent_name: '박삼',
 *                               hp: '010-5289-1939',
 *                               win_score: 1750,
 *                               manner_score: 20,
 *                               totalMatches: 0,
 *                               win: 0,
 *                               draw: 0,
 *                               lose: 0,
 *                               logo_image: 'default.jpg'
 *                           }
 *       "매치 외 사용자":
 *         description: 권한이 없습니다 팝업 후 메인 리다이렉션
 *       "기작성시":
 *         description: 이미 리뷰를 작성하셨습니다 팝업 후 /game/my-match 리다이렉션
 *    post:
 *      summary: "리뷰 작성 정보 전송"
 *      description: "리뷰 작성 정보 전송"
 *      tags: [Game]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           result: 
 *            type: string
 *           manner_rate: 
 *            type: string      
 *           opponent_id: 
 *            type: integer
 *         examples:
 *          userExample:
 *              value: {
 *                  result: '승리',    
 *                  manner_rate: '나쁨',
  *                 opponent_id: 6
 *                     } 
 *      responses:
 *       "200":
 *         description: /team/my-match 리다이렉션
 */
router.get('/team-review/:pageId', cookieJwtAuth,header,main.team_reviewview);
router.post('/team-review/:pageId', cookieJwtAuth,header,review.team_review);

/**
 * @swagger
 * paths:
 *  /game/match-accept:
 *    post:
 *      summary: "매치 요청 수락"
 *      description: "매치 요청 수락"
 *      tags: [Game]
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           notif_id: 
 *            type: integer
 *           date: 
 *            type: string      
 *           match_id: 
 *            type: integer
 *           RQuserid:
 *            type: integer
 *           time:
 *            type: string
 *           place:
 *            type: string
 *         examples:
 *          userExample:
 *              value: {
 *                  notif_id: 54,    
 *                  date: '2023-08-01',
 *                  match_id: 177,
 *                  RQuserid: 나쁨,
 *                  time: 10:00:00,
 *                  place: 강동구
 *                     } 
 *      responses:
 *       "200":
 *         description: 요청 notification삭제, 수락 notification 생성, Match에 away_userid, 메인 리다이렉션
 */
router.post('/match-accept', cookieJwtAuth,header,match.match_accept);

/**
 * @swagger
 * paths:
 *  /game/match-reject:
 *    post:
 *      summary: "매치 요청 거절"
 *      description: "매치 요청 거절"
 *      tags: [Game]
 *      requestBody:
 *       description: 
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           notif_id: 
 *            type: integer
 *         examples:
 *          userExample:
 *              value: {
 *                  notif_id: 54,    
 *                     } 
 *      responses:
 *       "200":
 *         description: 요청 notification삭제 /game/requested-match 리다이렉션
 */
router.post('/match-reject', cookieJwtAuth,header,match.match_reject);

/**
 * @swagger
 * paths:
 *  /game/cancel-match:
 *    post:
 *      summary: "매치 삭제"
 *      description: "매치 삭제"
 *      tags: [Game]
 *      requestBody:
 *       description: 
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           match_id: 
 *            type: integer
 *         examples:
 *          userExample:
 *              value: {
 *                  match_id: 54,    
 *                  home_userid: 2, 
 *                  away_userid: 3
 *                     } 
 *      responses:
 *       "200":
 *         description: 요청 매치 match db에서 삭제 / 리다이렉션
 */
router.post('/cancel-match', cookieJwtAuth,header,match.cancel_match);

module.exports = router; 
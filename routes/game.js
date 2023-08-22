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
 * /registered-match:
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
 * /requested-match:
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
 *  /edit-match:
 *    get:
 *      summary: "매치 정보 편집 페이지"
 *      description: "매치 정보 편집 페이지"
 *      tags: [Game]
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
router.get('/edit-match', cookieJwtAuth,header,main.edit_matchview);

/**
 * @swagger
 * paths:
 *  /team-review/:pageId:
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
 *      responses:
 *       "200":
 *         description: 헤더 제외, opponent_id = 상대방의 userid, Match = pageId의 매치 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   pageId:
 *                      type: integer
 *                   opponent_id:
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
 *  /match-accept:
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
 *  /match-reject:
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
 *  /cancel-match:
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
 *                     } 
 *      responses:
 *       "200":
 *         description: 요청 매치 match db에서 삭제 / 리다이렉션
 */
router.post('/cancel-match', cookieJwtAuth,header,match.cancel_match);

module.exports = router; 
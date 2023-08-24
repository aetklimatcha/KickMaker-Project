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
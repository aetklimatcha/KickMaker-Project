const express = require("express");
const router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const { header } = require('../middleware/header');

const notification = require('../controllers/notification');


/**
@swagger
 * /notification/check/:notifId:
 *   post:
 *      summary: "확인한 알림 처리"
 *      description: "확인한 알림 처리"
 *      tags: [Notification]
 *      parameters:
 *          - name: notifID
 *            description: 해당 배열의 notif_id 받음
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *       description: Created user object
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties: 
 *           notif_id: 
 *            type: integer
 *      responses:
 *       "200":
 *         description: notification db에 해당 noti 삭제
 */
router.post('/check/:matchId', cookieJwtAuth,header,notification.check);



module.exports = router; 
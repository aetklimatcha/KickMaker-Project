require("dotenv").config({ path: __dirname + "/../config/.env" });
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const CryptoJS = require("crypto-js");

const serviceId = process.env.MMS_ID;
const secretKey = process.env.NCP_SECERET_KEY;
const accessKey = process.env.NCP_ACCESS_KEY;
const my_number = process.env.MY_NUM;


function uploadfile(imagename) {
    return new Promise((resolve, reject) => {
    const imageFilePath = path.join(__dirname, '../files/QRcode', `${imagename}.jpg`);
    const imageBuffer = fs.readFileSync(imageFilePath);
    const base64Image = imageBuffer.toString('base64');

    const date = Date.now().toString();
    // url 관련 변수 선언
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/files`;
    const url2 = `/sms/v2/services/${serviceId}/files`;

    // signature 작성 : crypto-js 모듈을 이용하여 암호화
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);


    axios({
        method: method,
        url: url,
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
        data: {
            fileName: "qrcode.jpg",
            fileBody: base64Image
        }
    }).then(res => {
        console.log("파일첨부완료")
        console.log(res.data);
        receivedFileId = res.data.fileId
        resolve(receivedFileId);
    }).catch(err => {
        console.log("파일첨부실패")
        console.log(err);
        reject(err)
    })
})
}

async function sendMessage(receive_teamname, receive_hp, imagename) {
    try {
        const date = Date.now().toString();
        // url 관련 변수 선언
        const method = "POST";
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
        const url2 = `/sms/v2/services/${serviceId}/messages`;

        // signature 작성 : crypto-js 모듈을 이용하여 암호화
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);
        const hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);

        const receivedFileId = await uploadfile(imagename)
        const smsRes = await axios({
            method: method,
            url: url,
            headers: {
                "Content-type": "application/json; charset=utf-8",
                "x-ncp-apigw-timestamp": date,
                "x-ncp-iam-access-key": accessKey,
                "x-ncp-apigw-signature-v2": signature,
            },
            data: {
                type: "MMS",
                countryCode: "82",
                from: my_number,
                subject: "전송제목",
                content: `hey2`,
                messages: [{
                    to: `${receive_hp}`,
                    subject : `경기 결과 입력용 QR코드 입니다`,
                    content : `${receive_teamname}님! 상대팀 대표자에게 전송된 QR코드를 통해 리뷰페이지에 접속하여 경기 결과를 남겨주세요!`
                }],
                files: [
                    {
                        fileId: receivedFileId
                    }
                ],
            },
        }).then(res => {
            console.log('메시지 발송 성공')
            console.log(res.data);
            // {
            //     requestId: 'RSSA-1693235341251-7626-57663261-DBWDNKVl',
            //     requestTime: '2023-08-29T00:09:01.251',
            //     statusCode: '202',
            //     statusName: 'success'
            // }
        }).catch(err => {
            console.log('메시지 발송 단 에러')
            console.log(err);
        })
    } catch (err) {
        console.log('아예 메시지 발송 에러')
        console.log(err);
    }
}

module.exports = sendMessage;

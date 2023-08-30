const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');

async function genQRcode(id, data) {
    try {
        const generateQR = await QRCode.toDataURL(`${data}`);

        // Base64 디코드
        const imageDataBuffer = Buffer.from(generateQR.split(',')[1], 'base64'); // 'data:image/png;base64,' 부분 제거

        // 이미지 변환 및 저장 (JPEG로 변환)
        await sharp(imageDataBuffer)
            .jpeg()
            .toFile(`./files/QRcode/${id}.jpg`);

        console.log('JPEG 이미지로 변환 및 저장 완료');
    } catch (err) {
        console.error(err);
    }
}

module.exports = genQRcode;

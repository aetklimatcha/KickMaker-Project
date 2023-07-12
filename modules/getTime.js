// 1. 현재 시간(Locale)
const curr = new Date();

// 2. UTC 시간 계산
const utc =
    curr.getTime() +
    (curr.getTimezoneOffset() * 60 * 1000);

// 3. UTC to KST (UTC + 9시간)
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const kr_curr =
    new Date(utc + (KR_TIME_DIFF));

//kr_curr : Tue Jul 11 2023 22:45:40 GMT+0900 (대한민국 표준시)    


module.exports = {

    getDate: () => {
        const year = kr_curr.getFullYear();
        const month = (kr_curr.getMonth() + 1).toString().padStart(2, '0');
        const day = kr_curr.getDate().toString().padStart(2, '0');
        
        const nowdate = `${year}${month}${day}`;
        
        return nowdate;
    }

}

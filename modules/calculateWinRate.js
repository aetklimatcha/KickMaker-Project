// 필요한 모듈 가져오기
const mysql = require('mysql');

// Mysql 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',     // Mysql 호스트
  user: '사용자이름',    // Mysql 사용자 이름
  password: '비밀번호', // Mysql 비밀번호
  database: '데이터베이스이름' // 사용할 데이터베이스 이름
});

// Mysql 연결
connection.connect((err) => {
  if (err) {
    console.error('Mysql 연결 오류:', err);
    return;
  }
  console.log('Mysql에 성공적으로 연결되었습니다.');
});

// 데이터 가져와서 승률 계산하는 함수
function calculateWinRate() {
  const query = 'SELECT COUNT(*) AS totalMatches, SUM(CASE WHEN result = "win" THEN 1 ELSE 0 END) AS wins FROM matches';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('쿼리 실행 오류:', err);
      return;
    }

    const totalMatches = rows[0].totalMatches;
    const wins = rows[0].wins;
    const winRate = (wins / totalMatches) * 100;

    console.log('총 경기 수:', totalMatches);
    console.log('승리 수:', wins);
    console.log('승률:', winRate.toFixed(2) + '%');

    // Mysql 연결 종료
    connection.end();
  });
}

// 승률 계산 실행
calculateWinRate();

//위의 코드에서는 matches라는 테이블에서 경기 결과를 가져오고, result 열이 "win"인 경우를 승리로 간주합니다. totalMatches 변수에는 총 경기 수가 저장되고, wins 변수에는 승리 수가 저장됩니다. 이를 이용하여 승률을 계산하고 출력합니다.
//주의: 코드를 실행하기 전에 Mysql 서버에 연결할 수 있는 정확한 호스트, 사용자 이름, 비밀번호, 데이터베이스 이름을 제공해야 합니다. 또한, matches 테이블이 데이터베이스에 존재해야 하며, 필요에 따라 쿼리를 수정하여 데이터를 가져오십시오.
//이 코드는 승률 계산을 위한 기본적인 예시일 뿐이며, 실제 프로젝트에 맞게 수정해야 합니다.
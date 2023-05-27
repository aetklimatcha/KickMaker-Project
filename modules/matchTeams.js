// matchTeams.js 파일

// 팀 객체를 나타내는 클래스
class Team {
    constructor(name, winCount, gameCount) {
      this.name = name;
      this.winCount = winCount;
      this.gameCount = gameCount;
    }
  
    // 승률 계산 함수
    get winRate() {
      return this.winCount / this.gameCount;
    }
  }
  
  // 팀 목록 생성
  const teams = [
    new Team("팀A", 10, 15),
    new Team("팀B", 12, 18),
    new Team("팀C", 8, 14),
    new Team("팀D", 15, 22),
    new Team("팀E", 9, 16)
  ];
  
  // 팀을 승률 순으로 정렬하는 함수
  function sortTeamsByWinRate(teams) {
    return teams.sort((a, b) => b.winRate - a.winRate);
  }
  
  // 비슷한 승률을 가진 팀끼리 매칭하는 함수
  function matchTeams(teams) {
    const sortedTeams = sortTeamsByWinRate(teams);
    const matches = [];
  
    while (sortedTeams.length > 1) {
      const teamA = sortedTeams.shift();
      let closestWinRateDiff = Infinity;
      let closestTeamIndex = -1;
  
      // 가장 가까운 승률 차이를 가진 팀을 찾는다
      for (let i = 0; i < sortedTeams.length; i++) {
        const winRateDiff = Math.abs(teamA.winRate - sortedTeams[i].winRate);
        if (winRateDiff < closestWinRateDiff) {
          closestWinRateDiff = winRateDiff;
          closestTeamIndex = i;
        }
      }
  
      const teamB = sortedTeams.splice(closestTeamIndex, 1)[0];
      matches.push([teamA, teamB]);
    }
  
    // 남은 팀이 홀수일 경우, 마지막 팀은 bye 처리
    if (sortedTeams.length === 1) {
      matches.push([sortedTeams[0], null]);
    }
  
    return matches;
  }
  
  // 매칭 결과 출력
  const matches = matchTeams(teams);
  matches.forEach((match, index) => {
    const teamA = match[0];
    const teamB = match[1];
    console.log(`매치 ${index + 1}: ${teamA.name} vs ${teamB ? teamB.name : "Bye"}`);
  });

  
//이 코드는 Team 클래스를 사용하여 팀의 이름, 승리 횟수, 총 게임 횟수를 저장합니다. winRate 속성은 승률을 계산하는 getter입니다.
//sortTeamsByWinRate 함수는 팀 목록을 승률 순으로 정렬합니다.
//matchTeams 함수는 승률이 비슷한 팀을 매칭시킵니다. 이 함수는 먼저 sortTeamsByWinRate 함수를 사용하여 팀을 승률 순으로 정렬한 다음, 
//가장 승률 차이가 작은 팀을 찾아 매칭합니다. 만약 팀의 개수가 홀수인 경우에는 마지막 팀은 bye 처리됩니다.
//위의 예시 코드에서는 팀 목록 teams를 사용하여 매칭 결과를 출력하였습니다. 이 예시에서는 teams 배열에 5개의 팀이 포함되어 있으며, 
//각 팀의 승리 횟수와 총 게임 횟수를 기반으로 승률을 계산하여 매칭합니다. 이러한 팀 정보는 실제로는 데이터베이스나 외부 소스에서 가져오는 것이 일반적일 것입니다.

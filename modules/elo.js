const K = 32; // The K factor

//승률 계산
function calculateWinrate(team1Rating, team2Rating) {
    const expectedScore = 1 / (1 + Math.pow(10, (team2Rating - team1Rating) / 400));
    return expectedScore;
}

//반올림된 승률 반환
function getRoundsWinrate(playerRating, opponentRating){
    let expectedScore = calculateWinrate(playerRating, opponentRating);
    return Math.round(expectedScore*100);
}

//ELO UPDATE 
function updateElo(playerRating, opponentRating, result) {
    const expectedScore = calculateWinrate(playerRating, opponentRating);
    // Elo 점수 갱신 계산
    const newRating = playerRating + K * (result - expectedScore);
    return newRating;
}

function matchTeams(team1, team2) {
    const team1Rating = team1;
    const team2Rating = team2;
    const result = 0;
    const team1NewRating = updateElo(team1Rating, team2Rating, result);
    const team2NewRating = updateElo(team2Rating, team1Rating, !result);

    team1 = Math.round(team1NewRating);
    team2 = Math.round(team2NewRating);

    return [team1, team2]
}

module.exports.getWinrate = getRoundsWinrate;
module.exports.changeScore = matchTeams;
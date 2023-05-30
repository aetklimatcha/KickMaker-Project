
module.exports = {
    rebatch: (userinfo, matchedinfo, callback) => {
        matchedinfo.sort(function (a, b) {
            var win_scoreDiffA = Math.abs(a.win_score - userinfo.win_score); // a와 userinfo의 win_score 차이 계산
            var win_scoreDiffB = Math.abs(b.win_score - userinfo.win_score); // b와 userinfo의 win_score 차이 계산

            if (win_scoreDiffA !== win_scoreDiffB) {
                return win_scoreDiffA - win_scoreDiffB; // win_score 차이가 다르면 가장 가까운 차이를 가지는 팀 우선
            } else {
                return b.manner_score - a.manner_score; // win_score 차이가 같으면 manner_score를 비교하여 정렬
            }
        });
        callback(matchedinfo);
    }
}



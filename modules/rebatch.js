 
var userinfo ={
    winrate : 50,
    mannerrate : 60,
}

var matchedinfo = [
    {
        userid : 1,
        winrate : 2,
        mannerrate : 3
    },
    {
        userid : 2,
        winrate : 9,
        mannerrate : 10
    },
    {
        userid : 3,
        winrate : 9,
        mannerrate : 13
    },
    {
        userid : 4,
        winrate : 6,
        mannerrate : 6
    },
    {
        userid : 5,
        winrate : 100000,
        mannerrate : 300
    },
    {
        userid : 6,
        winrate : 50,
        mannerrate : 299
    },
    

]

matchedinfo.sort(function(a, b) {
    var winrateDiffA = Math.abs(a.winrate - userinfo.winrate); // a와 userinfo의 winrate 차이 계산
    var winrateDiffB = Math.abs(b.winrate - userinfo.winrate); // b와 userinfo의 winrate 차이 계산

    if (winrateDiffA !== winrateDiffB) {
        return winrateDiffA - winrateDiffB; // winrate 차이가 다르면 가장 가까운 차이를 가지는 팀 우선
    } else {
        return b.mannerrate - a.mannerrate; // winrate 차이가 같으면 mannerrate를 비교하여 정렬
    }
});

console.log(matchedinfo);


// matchedinfo.sort(function(a, b) {
//     if (a.winrate !== b.winrate) {
//         return b.winrate - a.winrate; // 정렬을 위해 winrate를 비교
//     } else {
//         return b.mannerrate - a.mannerrate; // winrate가 같으면 mannerrate를 비교
//     }
// });

//console.log(matchedinfo);


 
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
        winrate : 4,
        mannerrate : 13
    },
    {
        userid : 4,
        winrate : 6,
        mannerrate : 6
    },
    {
        userid : 4,
        winrate : 6,
        mannerrate : 9
    },

]

matchedinfo.sort(function(a, b) {
    if (a.winrate !== b.winrate) {
        return b.winrate - a.winrate; // 정렬을 위해 winrate를 비교
    } else {
        return b.mannerrate - a.mannerrate; // winrate가 같으면 mannerrate를 비교
    }
});

console.log(matchedinfo);


function test (a , b) {
    var txt = ''
    txt += a;
    if (b){
        txt += b;
    }

    return txt;
} 

console.log(test('go'));
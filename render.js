var express = require('express');
var app = express();

app.set('view engine','ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname));

app.get('/',function(req,res){
    //아래 경로 조정해서 띄울 ejs 설정!!!!!!!
    res.render(__dirname + '/views/noMatch.ejs');
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
});
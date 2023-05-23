var express = require('express');
var app = express();

app.set('view engine','ejs');
app.set('views', __dirname + '/views');

app.get('/',function(req,res){
    res.render(__dirname + '/views/register.ejs');
});

// 서버
app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
});
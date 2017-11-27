const express = require("express");
const session = require("express-session");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'stuffstuff'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    if(!req.session.gold)
    {
        req.session.gold = 0;
        req.session.history = [];
    }
    var data = {
        "gold": req.session.gold,
        "history": req.session.history,
    }
    req.session.num = Math.floor(Math.random() * 100);
    res.render('crime', data);
    res.end();
});
app.post('/farm', function (req, res)
{
    let earnings = Math.floor(Math.random() * 10) + 10;
    req.session.gold += earnings;
    if(req.session.history == "")
    {
        req.session.history.push(`Began with a simple steady income...yearned for more. Left home with ${earnings} gold.`);
    } else {
        req.session.history.push(`Returned to the old farm. Stole the crops, sold them at market, and made off with ${earnings} gold.`);
    }
    res.redirect('/');
    res.end();
})
app.post('/cave', function (req, res)
{
    let earnings = Math.floor(Math.random() * 5) + 5;
    req.session.gold += earnings;
    req.session.history.push(`Robbed cave explorers for ${earnings} gold.`);
    res.redirect('/');
    res.end();
})
app.post('/house', function (req, res)
{
    let earnings = Math.floor(Math.random() * 10) + 10;
    req.session.gold += earnings;
    req.session.history.push(`Found a house, more importantly found the ${earnings} gold within.`);
    res.redirect('/');
    res.end();
})
app.post('/casino', function (req, res)
{
    let earnings = Math.floor(Math.random() * 10) + 10;
    let odds = Math.random();
    if(odds > 0.5){
        req.session.gold += earnings;
        req.session.history.push(`Casino Heist! Made off with ${earnings} gold.`);
    }else{
        req.session.gold -= earnings;
        req.session.history.push(`The house wins again...Lost ${earnings}gold.`);
    }
    res.redirect('/');
    res.end();
})
app.post('/reset', function (req, res)
{
    req.session.gold = 0;
    req.session.history.length = 0;
    res.redirect('/');
})
app.listen(8000, function(){
    console.log("listening on port 8000");
})
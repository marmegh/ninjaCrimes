const express = require("express");
const session = require("express-session");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'stuffstuff'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    // if(!req.session.gold)
    // {
    //     req.session.gold = 0;
    //     req.session.history = [];
    // }
    // var data = {
    //     "gold": req.session.gold,
    //     "history": req.session.history,
    // }
    // req.session.num = Math.floor(Math.random() * 100);
    res.render('crime');
    res.end();
});
// app.post('/farm', function (req, res)
// {
//     let earnings = Math.floor(Math.random() * 10) + 10;
//     req.session.gold += earnings;
//     if(req.session.history == "")
//     {
//         req.session.history.push(`Began with a simple steady income...yearned for more. Left home with ${earnings} gold.`);
//     } else {
//         req.session.history.push(`Returned to the old farm. Stole the crops, sold them at market, and made off with ${earnings} gold.`);
//     }
//     res.redirect('/');
//     res.end();
// })
// app.post('/cave', function (req, res)
// {
//     let earnings = Math.floor(Math.random() * 5) + 5;
//     req.session.gold += earnings;
//     req.session.history.push(`Robbed cave explorers for ${earnings} gold.`);
//     res.redirect('/');
//     res.end();
// })
// app.post('/house', function (req, res)
// {
//     let earnings = Math.floor(Math.random() * 3) + 2;
//     req.session.gold += earnings;
//     req.session.history.push(`Found a house, more importantly found the ${earnings} gold within.`);
//     res.redirect('/');
//     res.end();
// })
// app.post('/casino', function (req, res)
// {
//     let earnings = Math.floor(Math.random() * 10) + 10;
//     let odds = Math.random();
//     if(odds > 0.5){
//         req.session.gold += earnings;
//         req.session.history.push(`Didn't get caught counting cards! Made off with ${earnings} gold.`);
//     }else{
//         req.session.gold -= earnings;
//         req.session.history.push(`The house wins again...Lost ${earnings}gold.`);
//     }
//     res.redirect('/');
//     res.end();
// })
app.post('/reset', function (req, res)
{
    res.redirect('/');
})
var server = app.listen(8000, function()
{
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket)
{
    var gold = 0;
    var monthNames = ["January", "February", "March", "April", "May", "June",    "July", "August", "September", "October", "November", "December"  ];
    var loot = 0;
    var date = new Date();
    let datetime = "- " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + " @ " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
    var hx = `And the thought occurred, maybe crime would be easier... ${datetime}`;
    console.log(datetime);
    data = {
        "gold": gold,
        "hx": hx,
        "loot": loot,
    }
    socket.emit('server_response', {data: data});
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    socket.on("farming", function(data){
        console.log("Farming is happening here");
        let loot = Math.floor(Math.random() * 5) + 5;
        date = new Date();
        let datetime = "- " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + " @ " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
        gold += loot;
        hx = `Returned to the old farm. Stole the crops, sold them at market, and made off with ${loot} gold. ${datetime}`;
        data = {
            "gold": gold,
            "hx": hx,
            "loot": loot,
        }
        socket.emit('server_response', {data: data});
    });
    socket.on("hood", function(data){
        console.log("I got in one little fight and my mom got scared.");
        let loot = Math.floor(Math.random() * 5) + 5;
        gold += loot;
        date = new Date();
        let datetime = "- " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + " @ " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
        gold += loot;
        hx = `Street hustle scored ${loot} gold. ${datetime}`;
        data = {
            "gold": gold,
            "hx": hx,
            "loot": loot,
        }
        socket.emit('server_response', {data: data});
    });
    socket.on("thug", function(data){
        console.log("Are those sirens?");
        let loot = Math.floor(Math.random() * 3) + 2;
        gold += loot;
        date = new Date();
        let datetime = "- " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + " @ " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
        gold += loot;
        hx = `Broke into a house, rummaged through a couch and found ${loot} gold. Then the sirens happened. ${datetime}`;
        data = {
            "gold": gold,
            "hx": hx,
            "loot": loot,
        }
        socket.emit('server_response', {data: data});
    });
    socket.on("risk", function(data){
        console.log("Oceans 11");
        let loot = Math.floor(Math.random() * 10) + 10;
        let odds = Math.random();
        date = new Date();
        let datetime = "- " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + " @ " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
        gold += loot;
        if(odds > 0.5){
            gold += loot;
            hx = `Went to the casino and despite being incredibly obvious you did not get caught counting cards! You won ${loot} gold ${datetime}`;
        }else{
            gold -= loot;
            hx = `The house always wins. You lost ${loot} gold ${datetime}`;
        }
        data = {
            "gold": gold,
            "hx": hx,
            "loot": loot,
        }
        socket.emit('server_response', {data: data});
    });
})
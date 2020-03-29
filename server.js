import express from "express";
const app = express();
var mysql = require('./dbcon.js');

const fs = require('fs');
const port = process.env.PORT || 4000;

app.use(express.static('public'));


const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'reading2020room@gmail.com',
        pass: 'pw1234pw'
    }
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);

function getRoom(res, mysql, context, id, complete){
  var sql = "SELECT title, reader, listener, UIUD, email, start_time FROM sessions WHERE UIUD = ?";
  var inserts = [id];
  console.log(inserts)
  mysql.pool.query(sql, inserts, function(error,results,fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
    }
    context.room = results[0];
    console.log(context);
    getText(context.room.title, context, complete);
  });
}

function getText(title, context, complete) {
  var storyFile = "public/txt/" + title.toUpperCase().replace(/ /g,'_') + ".txt"
  console.log(storyFile);
  fs.readFile(storyFile, 'utf8', function(err, data) {
    var storyText = [];
    var storyTitle = "";
    var nextLine = "";
    var lineStart = true;
    var punctuationEnd = /[:,.?!]/;
    var space = / /;
    var letter = /[A-Za-z]/;
    var openQuote = /[']/;
    var closeQuote = /[']/;
    var quote = false;

    var dataPos = 0;

    while(!data[dataPos].match(/\r/)) {
      storyTitle = storyTitle + data[dataPos];
      dataPos++;
    }
    data = data.replace(/\r\n/g,' ');

    for(var i=dataPos; i<Buffer.byteLength(data); i++) {
      if(lineStart) {
        if(!data[i].match(space)) {
          if(!data[i].match(openQuote)) {
            quote = false;
          } else{
            quote = true;
          }
          lineStart = false;
        }
        nextLine = nextLine + data[i];
      } else {
        if(quote && data[i].match(closeQuote) && !data[i+1].match(letter)) {
          lineStart = true;
        }
        if(!quote && data[i].match(punctuationEnd)) {
          lineStart = true;
        }
        nextLine = nextLine + data[i];
        if(lineStart) {
          storyText.push(nextLine);
          if(nextLine.includes("THE END.")) {
            i = Buffer.byteLength(data) + 1000;
          }
          nextLine = "";
        }
      }
    }

    context.title = storyTitle;
    context.text = storyText;
    console.log(context);
    complete()
  });
}

app.get('/', (req, res) => {
  var context = {};
  context.jsscripts = ["home.js"];
  res.render('home', context);

});

app.get('/schedule', (req, res) => {
  var context = {};
  context.jsscripts = ["fillForm.js"];
  res.render('schedule', context);
});

app.post('/schedule', function(req, res){
  var callbackCount = 0;
  var context = {};
  console.log("post request received");
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO sessions (UIUD, title, email, start_time, reader, listener) VALUES (?,?,?,?,?,?)";
  var inserts = [req.body.UIUDid, req.body.storyTitle, req.body.emailAddr, req.body.meetingTime, req.body.readId, req.body.listenId];
  console.log(inserts);
  var message = {
    from: "reading2020room@gmail.com",
    to: req.body.emailAddr,
    subject: "Reading Rooom Reservation",
    text: 'Hello, You have signed up for a reading session at '+req.body.meetingTime+'. If you are the listener, you may reach your room at: https://reading-room.herokuapp.com/listenerRoom/'+req.body.UIUDid+'  If you are the reader, you may reach your room at:  https://reading-room.herokuapp.com/readerRoom/'+req.body.UIUDid+'  Have a wonderful day! Best, The Reading Room Team',
    html: '<p>Hello,</p><br><p>You have signed up for a reading session at '+req.body.meetingTime+'.</p><p>If you are the listener, you may reach your room at:<br><br><a href="https://reading-room.herokuapp.com/listenerRoom/'+req.body.UIUDid+'">https://reading-room.herokuapp.com/listenerRoom/'+req.body.UIUDid+'</a><br><br>If you are the reader, you may reach your room at:<br><a href="https://reading-room.herokuapp.com/readerRoom/'+req.body.UIUDid+'">https://reading-room.herokuapp.com/readerRoom/'+req.body.UIUDid+'</a></p><br>Have a wonderful day!<br><br>Best,<br>The Reading Room Team'
  };
  console.log(message)
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
        console.log(context)
        getRoom(res, mysql, context, req.body.UIUDid, complete);
        function complete(){
          callbackCount++;
          if(callbackCount >= 1){
            transporter.sendMail(message, function (err, info) {
             if(err){console.log(err)}
             else{console.log(info);}
            });
            console.log(context);
            res.render('gotoRooms', context);
          }
        }
      }
    });
  });

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/library', (req, res) => {
  fs.readFile('public/txt/contents.txt', 'utf8', function(err, data) {
    var titles = data.split(/\n/);
    var books = []
    for (let i=0; i< (titles.length-1); i++) {
      books.push({title: titles[i], file: titles[i].replace(/ /g,'_')});
    }

    return res.render('library',{stories: books});
  });
});

app.get('/reset',function(req,res,next){
  console.log('reset')
  var context = {};
  var createString = "CREATE TABLE diagnostic(" +
  "id INT PRIMARY KEY AUTO_INCREMENT," +
  "text VARCHAR(255) NOT NULL)";
  mysql.pool.query('DROP TABLE IF EXISTS diagnostic', function(err){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(createString, function(err){
      if(err){
        next(err);
		return;
      }
	  mysql.pool.query('INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',function(err){
	    mysql.pool.query('SELECT * FROM diagnostic', function(err, rows, fields){
		  context.results = JSON.stringify(rows);
		  res.render('test',context);
		});
	  });
    });
  });
});

app.get('/:room_id', (req, res) => {
  var context = {}
  var storyFile = "public/txt/RAPUNZEL.txt"
  fs.readFile(storyFile, 'utf8', function(err, data) {
    var storyText = [];
    var storyTitle = "";
    var nextLine = "";
    var lineStart = true;
    var punctuationEnd = /[:,.?!]/;
    var space = / /;
    var letter = /[A-Za-z]/;
    var openQuote = /[']/;
    var closeQuote = /[']/;
    var quote = false;

    var dataPos = 0;

    while(!data[dataPos].match(/\r/)) {
      storyTitle = storyTitle + data[dataPos];
      dataPos++;
    }
    data = data.replace(/\r\n/g,' ');

    for(var i=dataPos; i<Buffer.byteLength(data); i++) {
      if(lineStart) {
        if(!data[i].match(space)) {
          if(!data[i].match(openQuote)) {
            quote = false;
          } else{
            quote = true;
          }
          lineStart = false;
        }
        nextLine = nextLine + data[i];
      } else {
        if(quote && data[i].match(closeQuote) && !data[i+1].match(letter)) {
          lineStart = true;
        }
        if(!quote && data[i].match(punctuationEnd)) {
          lineStart = true;
        }
        nextLine = nextLine + data[i];
        if(lineStart) {
          storyText.push(nextLine);
          if(nextLine.includes("THE END.")) {
            i = Buffer.byteLength(data) + 1000;
          }
          nextLine = "";
        }
      }
    }

    context.title = storyTitle;
    context.text = storyText;
    return res.render('room', context);
  });
});


app.get('/readerRoom/:room_id', (req, res) => {
  var callbackCount = 0;
  var context = {};
  context.jsscripts = ["readerRoom.js"];
  var mysql = req.app.get('mysql');
  getRoom(res, mysql, context, req.params.room_id, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        console.log(context);
        res.render('readerRoom', context);
      }
    }
});

app.get('/listenerRoom/:room_id', (req, res) => {
  var callbackCount = 0;
  var context = {};
  context.jsscripts = ["room.js"];
  var mysql = req.app.get('mysql');
  getRoom(res, mysql, context, req.params.room_id, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        console.log(context);
        res.render('room', context);
      }
    }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

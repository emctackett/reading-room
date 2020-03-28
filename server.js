import express from "express";
const app = express();
var mysql = require('./dbcon.js');

const fs = require('fs');
const port = process.env.PORT || 4000;

app.use(express.static('public'));


const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const bodyParser = require('body-parser');
const activeSockets = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);

function getRoom(res, mysql, context, id, complete){
  var sql = "SELECT title, reader, listener FROM sessions WHERE UIUD = ?";
  var inserts = [id];
  console.log(inserts)
  mysql.pool.query(sql, inserts, function(error,results,fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
    }
    context.room = results[0];
    console.log(context);
    complete();
  });
}


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/schedule', (req, res) => {
  var context = {};
  context.jsscripts = ["fillForm.js"];
  res.render('schedule', context);
});

app.post('/schedule', function(req, res){
  console.log("post request received");
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO sessions (UIUD, title, email, start_time, reader, listener) VALUES (?,?,?,?,?,?)";
  var inserts = [req.body.UIUDid, req.body.storyTitle, req.body.emailAddr, req.body.meetingTime, req.body.readId, req.body.listenId];
  console.log(inserts);
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/schedule');
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

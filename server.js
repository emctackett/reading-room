import express from "express";
const app = express();
var mysql = require('./dbcon.js');
// https://socket.io/docs/#Using-with-Node-http-server
const server = require('http').Server(app);
const io = require('socket.io')(server);

const fs = require('fs');

//server.listen(80);

io.on('connection', function(socket) {
  socket.on('connection', socket => {
    const existingSocket = activeSockets.find(
      existingSocket => existingSocket === socket.id
    );

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');


//httpServer = createServer(app)
//io = socketIO(httpServer);

    if (!existingSocket) {
      activeSockets.push(socket.id);
    }

    socket.on('disconnect', () => {
      activeSockets = activeSockets.filter(
        existingSocket => existingSocket !== socket.id
      );
    });
  });
});

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


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/schedule', (req, res) => {
  var jscript = "schedule.js"
  res.render('schedule',{jscript: jscript});
});

app.get('/library', (req, res) => {
  fs.readFile('public/txt/contents.txt', 'utf8', function(err, data) {
    var titles = data.split("\r\n");
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
  var storyFile = "public/txt/THE_GOLDEN_BIRD.txt"
  fs.readFile(storyFile, 'utf8', function(err, data) {
    var storyText = [];
    var storyTitle = "";
    var nextLine = "";
    var lineStart = true;
    var punctuationEnd = /[.?!]/;
    var space = / /;
    var openQuote = ['/', String.fromCharCode(2018), '/'].join('');
    var closeQuote = ['/',String.fromCharCode(2019),'/'].join('');
    var endingStar = ['/',String.fromCharCode(42),'/'].join('');
    var quote = false;

    var dataPos = 0;

    while(!data[dataPos].match(/\r/)) {
      storyTitle = data[dataPos];
      dataPos++;
    }
    data = data.replace(/\r\n/g,' ');

    console.log(Buffer.byteLength(data));
    for(var i=dataPos; i<Buffer.byteLength(data); i++) {
      if(lineStart) {
        if(!data[i].match(endingStar)) {
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
          console.log("found the star");
          if(data[i+1].match(endingStar) && data[i+2].match(endingStar)) {
            i = Buffer.byteLength(data) + 1000;
          }
        }
      } else {
        if(quote && data[i].match(closeQuote)) {
          lineStart = true;
        }
        if(!quote && data[i].match(punctuationEnd)) {
          lineStart = true;
        }
        nextLine = nextLine + data[i];
        if(lineStart) {
          storyText.push(nextLine);
          console.log(nextLine);
          console.log(i);
          if(nextLine.includes("THE END.")) {
            i = Buffer.byteLength(data) + 1000;
          }
          nextLine = "";
        }
      }
    }

    res.render('room', {title: storyTitle}, {text: storyText})
  })
  res.render('room');
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

import express from "express";
const app = express();

// https://socket.io/docs/#Using-with-Node-http-server
const server = require('http').Server(app);
const io = require('socket.io')(server);

//server.listen(80);

io.on('connection', function(socket) {
  socket.on('connection', socket => {
    const existingSocket = activeSockets.find(
      existingSocket => existingSocket === socket.id
    );

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var mysql = require('./dbcon.js');
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
  res.render('schedule');
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

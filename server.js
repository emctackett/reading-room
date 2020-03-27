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

app.get('/', (req, res) => {
  res.render('home');
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

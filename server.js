const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.static('public'));

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

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

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

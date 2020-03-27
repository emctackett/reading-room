const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

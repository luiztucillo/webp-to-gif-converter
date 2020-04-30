const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const controller = require('./routes/image');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

app.use('/public', express.static('public'));
app.use('/images', controller);

app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error('Something went wrong'));
  });
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

app.listen(port, () => {
  console.log('Connected to port ' + port)
});
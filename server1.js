const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use((req, _res, next) => {
  req.setEncoding('utf8');
  next();
});

app.post('/stream', req => {
  req.pipe(process.stdout);
});

app.listen('5001', () => {
  console.log('I am here!');
});

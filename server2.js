const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Readable } = require('stream');
const stdin = process.openStdin();

const rs = new Readable();
rs.setEncoding('utf8');
rs._read = () => {};

const app = express();

app.use(cors());

app.listen('5002', () => {
  console.log('I am here!');
});

axios.post('http://localhost:5001/stream', rs);

stdin.addListener("data", text => {
  rs.resume();
  rs.push(text);
  rs.pause();
});



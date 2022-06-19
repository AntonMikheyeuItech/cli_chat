const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Readable } = require('stream');
const { consumer_ip } = require('./settings.json');
const stdin = process.openStdin();

const rs = new Readable();
rs.setEncoding('utf8');
rs._read = () => {};

const app = express();

app.use(cors());

app.use((req, _res, next) => {
  req.setEncoding('utf8');
  next();
});

app.post('/stream', req => {
  req.pipe(process.stdout);
});

app.listen('5002', () => {
  console.log(`Talk with ${consumer_ip}`);
});

// let sender;

// stdin.addListener("data", text => {
//   if (!sender) sender = axios.post(`http://${consumer_ip}:5001/stream`, rs);
//   rs.resume();
//   rs.push(text);
//   rs.pause();
// });

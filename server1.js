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

app.get('/health', (_req, res) => {
  res.status(200).send('Host is Active');
});

app.listen('5001', () => {
  console.log(`Talk with ${consumer_ip}`);
});

const connectInterval = setInterval(async () => {
  try {
    const response = await axios.get(`http://${consumer_ip}:5002/health`);
    console.log(response.data);

    axios.post(`http://${consumer_ip}:5002/stream`, rs);
    stdin.addListener("data", text => {
      rs.resume();
      rs.push(text);
      rs.pause();
    });

    clearInterval(connectInterval);
  } catch (error) {
    console.log(`${consumer_ip} is not online`);
  }
}, 1000);

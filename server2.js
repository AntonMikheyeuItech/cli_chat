const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { networkInterfaces } = require('os');
const { Readable } = require('stream');
const { consumer_ip } = require('./settings.json');
const stdin = process.openStdin();

const myNetworkIp = Object.values(networkInterfaces())[1][0].address;

console.log(`IP in your network is ${myNetworkIp}`);

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

app.listen('5002', () => {
  console.log(`Talk with ${consumer_ip}`);
});

const reconnect = () => {
  axios.post(`http://${consumer_ip}:5001/stream`, rs).catch(() => {
    console.log('\n------------Reconnect------------\n');
    reconnect();
  });
};

const handshake = async () => {
  try {
    const response = await axios.get(`http://${consumer_ip}:5001/health`);
    console.log(response.data);

    stdin.addListener("data", text => {
      rs.resume();
      rs.push(`-> ${text}`);
      rs.pause();
    });

    reconnect();
  } catch (error) {
    console.log(`${consumer_ip} is not online`);
    setTimeout(handshake, 1000);
  }
};

handshake();

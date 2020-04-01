const express = require('express');

let { MILLISECONDS } = require('./config');


const PORT = require('./config.js').PORT;
const { like } = require('./index.js');


const app = express();

app.listen(PORT, _ => {
    setInterval(like, MILLISECONDS);
});


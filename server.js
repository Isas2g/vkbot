const express = require('express');
let { VK } = require('vk-io');

let { MILLISECONDS } = require('./config');


const PORT = require('./config.js').PORT;
const { checkGroups, comment, like } = require('./index.js');


const app = express();



app.listen(PORT, async _ => {
    await checkGroups();
    setInterval(comment, MILLISECONDS);
    setInterval(like, MILLISECONDS);
});


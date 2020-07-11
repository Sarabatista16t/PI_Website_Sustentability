"use strict";
const express = require("express");
const options = require("./config/options.json");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();
const db = require('./db')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/www"));

//Connect to BD
db.connect()

//===================== 
// ROUTES 
//===================== 
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
});

app.get("/topics", requestHandlers.getTopics);

app.listen(options.server.port, function() {
    console.log("Server running at port:" + options.server.port);
});
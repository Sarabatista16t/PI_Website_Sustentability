"use strict";
const express = require("express");
const options = require("./config/options.json");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

//===================== 
// ROUTES 
//===================== 
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
});

app.listen(options.server.port, function() {
    console.log("Server running at port:" + options.server.port);
});
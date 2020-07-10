"use strict";
const express = require("express");
const options = require("./config/options.json");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

// User
app.get("/user", requestHandlers.getUser);

// post user
app.post("/user", requestHandlers.createUpdateUser);

// put user
app.put("/person/:id", requestHandlers.createUpdateUser);

// delete user
app.delete("/person/:id", requestHandlers.removeUser);

app.listen(options.server.port, function() {
    console.log("Server running at port:" + options.server.port);
});
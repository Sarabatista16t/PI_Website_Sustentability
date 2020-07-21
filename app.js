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

/*  AUTENTICAÇÃO  */
app.post("/login", requestHandlers.login);

/* OPERAÇÕES CRUD USER   */
app.get("/users", requestHandlers.getAllUsers);
app.get("/user/:id", requestHandlers.getUser);
app.post("/user", requestHandlers.createUser);
app.put("/user/:id", requestHandlers.updateUser);
app.delete("/user/:id", requestHandlers.deleteUser);

/* OPERAÇÕES CRUD TOPICS  */
app.get("/topics", requestHandlers.getAllTopics);
app.get("/topicsWithCards", requestHandlers.getAllTopicsWithCards);
app.get("/topic/:id", requestHandlers.getTopic);
app.post("/topic", requestHandlers.createTopic);
app.post("/topicWithCards", requestHandlers.createTopicWithCards);
app.delete("/topic/:id", requestHandlers.deleteTopic);
app.delete("/topicWithCards/:id", requestHandlers.deleteTopicWithCards);
app.put("/topic/:id", requestHandlers.updateTopic);
app.put("/topicWithCards/:id", requestHandlers.updateTopicWithCards);

app.listen(options.server.port, function() {
    console.log("Server running at port:" + options.server.port);
});
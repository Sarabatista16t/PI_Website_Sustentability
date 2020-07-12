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
app.post("/user", requestHandlers.getUser);
app.put("/:id", requestHandlers.updateUser);
/*app.delete("/:id", requestHandlers.deleteUser); */


/* OPERAÇÕES CRUD TOPIC  */
app.get("/topics", requestHandlers.getAllTopics);
/*app.get("/topic/:id", requestHandlers.getTopic);
app.post("/topic", requestHandlers.createTopic);
app.delete("/topic/:id", requestHandlers.deleteTopic);
app.put("/topic/:id", requestHandlers.updateTopic); */

app.listen(options.server.port, function() {
    console.log("Server running at port:" + options.server.port);
});
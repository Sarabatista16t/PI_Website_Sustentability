"use strict";
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const options = require("../config/options.json");

/**
 * Função para adicionar ou atualizar (upsert) um utilizador na base de dados.
 * @param {*} req 
 * @param {*} res 
 */
function createUpdateUser(req, res) {
    let client = getMongoDbClient();

    client.connect(function(err) {
        if (err) {
            res.json({ "message": "error", "error": err });
        } else {
            let collection = client.dv('BeAware').collection("user");

            collection.update({
                    _id: new ObjectID(req.method === 'PUT' ? req.body.id : null)
                }, {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    userRole: req.body.userRole
                }, {
                    multi: false,
                    upsert: true
                },
                function(err, response) {
                    if (err, response) {
                        if (err) {
                            res.sendStatus(404);
                        } else {
                            res.send(response.result);
                        }
                    }
                    client.close();
                }
            );
        }
    });
}

/**
 * Função para retornar a lista de utilizadores da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getUsers(req, res) {

    let client = new MongoClient(options.mongoDB.connectionString, { useUnifiedTopology: true });

    client.connect(function(err) {

        if (err) {

            res.status(404).json({ "message": "error", "error": err });

        } else {

            let collection = client.db('BeAware').collection("user");
            // (COMPLETAR)
            collection.find({}, { _id: 1, name: 1, birthDate: 1, idCountry: 1 }).toArray(function(err, documents) {

                if (err) {

                    res.status(404).json({ "message": "error", "error": err });

                } else {

                    res.status(200).json({ "message": "success", "person": documents });

                }

            });

            client.close();

        }

    });

}



/**
 * Função para remover uma pessoa da BD.
 * @param {*} req 
 * @param {*} res 
 */
function removePerson(req, res) {

    let client = new MongoClient(options.mongoDB.connectionString, { useUnifiedTopology: true });

    client.connect(function(err) {

        if (err) {

            res.json({ "message": "error", "error": err });

        } else {

            let collection = client.db('pi-lab11').collection("person");

            collection.remove({ _id: new ObjectID(req.params.id) }, { justOne: true }, function(err) {

                if (err) {

                    res.sendStatus(404);

                } else {

                    res.sendStatus(200);

                }

                client.close();

            });

        }

    });

}

/**
 * Função para retornar a lista de paises da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getCountries(req, res) {

    let client = new MongoClient(options.mongoDB.connectionString, { useUnifiedTopology: true });

    client.connect(function(err) {

        if (err) {

            res.json({ "message": "error", "error": err });

        } else {

            let collection = client.db('pi-lab11').collection("country");

            collection.find({}, { _id: 1, name: 1, shortName: 1 }).toArray(function(err, documents) {

                if (err) {

                    res.json({ "message": "error", "error": err });

                } else {

                    res.send({ "message": "success", "country": documents });

                }

                client.close();

            });

        }

    });

}
"use strict";

/** 
 * @class Gets all the necessary information from the database and displays it correctly in the HTML.
 * @constructs InfoManager
 * @param {string} id - id do elemento HTML que contém a informação.
 * 
 * @property {string} id - id do elemento HTML que contém a informação.
 * @property {country[]} countries - Array de objetos do tipo Country, para guardar todos os countries do nosso sistema
 * @property {person[]} people - Array de objetos do tipo person, para guardar todas as pessoas do nosso sistema
 */
function InfoManager(id) {
    this.id = id;
    this.topics = [];
};


/**
 * Sends the login info to the server, for it to check from the database and display the page if successfully
 */
InfoManager.prototype.login = function() {
    let div = document.getElementById("LoginPage ").children;
    let form = div.loginForm;
    let email = form.email.value;
    let password = form.password.value;
    let user = {
        "email": email,
        "password": password
    }
    let req = new XMLHttpRequest();
    req.open("POST", "/login");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
        console.log("Login realizado com sucesso");
        //showProfile()
    });

    const self = this;
    req.responseType = 'json';

    req.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let user = this.response.user[0];
            self.loggedUser = new User(user.Id, user.Name, user.Email, user.Password, user.roles);
            self.loggedUser.logIn();
        }
    }
    req.send(JSON.stringify(user));
}











InfoManager.prototype.showUsers = function() {}

/**
 * coloca a palavra "showTopics" no div titulo e cria dinamicamente uma tabela com a informação das showTopics
 */
InfoManager.prototype.showTopics = function() {
    let divTopics = document.getElementById("Topics ");

    window.info.topics.forEach(p => {
        divTopics.appendChild(createTopic(p.title, p.text));
    });

    divTopics.style.display = "block";

    function deleteTopicEventHandler() {
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            const idPerson = row.cells[1].firstChild.nodeValue;
            if (checkBox && checkBox.checked) {
                self.removePerson(idPerson);
                divTable.deleteRow(row.rowIndex);
            }

        }
    }

    function newTopicEventHandler() {
        /** @todo Completar */
        replaceChilds('divTable', document.createElement('div'));
        document.getElementById('formPerson').action = 'javascript:info.processingPerson("create");';
        document.getElementById('formPerson').style.display = 'block';
        document.getElementById('formPerson').reset();
        document.getElementById('contries').innerHTML = '';
        for (const c of self.countries) {
            document.getElementById('countries').options.add(new Option(c.name, c._id));
        }

    }

    function updatePersonEventHandler() {
        /** @todo Completar */
        let idPerson = null;
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            if (checkBox && checkBox.checked) {
                idPerson = row.cells[1].firstChild.nodeValue;
                break;
            }
        }

        if (idPerson) {
            replaceChilds('divTable', document.createElement('div'));
            document.getElementById('formPerson').action = 'javascript:info.processingPerson("update");';
            document.getElementById('formPerson').style.display = 'block';
            document.getElementById('formPerson').reset();
            document.getElementById('id').value = idPerson;
            const person = self.people.find(i => i.id === idPerson);
            document.getElementById('name').value = person.name;
            document.getElementById('date').value = person.birthDate.toISOString().split('T')[0];
            document.getElementById('countries').options;
        }

    }
    createButton(divTable, newPersonEventHandler, "New Person");
    createButton(divTable, deletePersonEventHandler, "Delete Person");
    createButton(divTable, updatePersonEventHandler, "Update Person");
    replaceChilds(this.id, divTable);
};

InfoManager.prototype.showCampusCards = function() {}
InfoManager.prototype.showProjectCards = function() {}




/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso topics através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getTopic = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/topics');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let topics = JSON.parse(xhr.responseText);
            topics.topic.forEach(t => {
                window.info.topics.push(t);
            });
        }
    };
    xhr.send();
};




/**
 * coloca a palavra "People" no div titulo e cria dinamicamente uma tabela com a informação das pessoas
 */
InfoManager.prototype.showPerson = function() {
    document.getElementById("headerTitle").textContent = "People";
    document.getElementById("formPerson").style.display = "none";
    let table = document.createElement("table");
    table.appendChild(tableLine(new Person(), true));
    window.info.people.forEach(p => {
        table.appendChild(tableLine(p, false));
    });

    let divTable = document.createElement("divTable");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);

    function deletePersonEventHandler() {
        /** @todo Completar */
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            const idPerson = row.cells[1].firstChild.nodeValue;
            if (checkBox && checkBox.checked) {
                self.removePerson(idPerson);
                divTable.deleteRow(row.rowIndex);
            }

        }
    }

    function newPersonEventHandler() {
        /** @todo Completar */
        replaceChilds('divTable', document.createElement('div'));
        document.getElementById('formPerson').action = 'javascript:info.processingPerson("create");';
        document.getElementById('formPerson').style.display = 'block';
        document.getElementById('formPerson').reset();
        document.getElementById('contries').innerHTML = '';
        for (const c of self.countries) {
            document.getElementById('countries').options.add(new Option(c.name, c._id));
        }

    }

    function updatePersonEventHandler() {
        /** @todo Completar */
        let idPerson = null;
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            if (checkBox && checkBox.checked) {
                idPerson = row.cells[1].firstChild.nodeValue;
                break;
            }
        }

        if (idPerson) {
            replaceChilds('divTable', document.createElement('div'));
            document.getElementById('formPerson').action = 'javascript:info.processingPerson("update");';
            document.getElementById('formPerson').style.display = 'block';
            document.getElementById('formPerson').reset();
            document.getElementById('id').value = idPerson;
            const person = self.people.find(i => i.id === idPerson);
            document.getElementById('name').value = person.name;
            document.getElementById('date').value = person.birthDate.toISOString().split('T')[0];
            document.getElementById('countries').options;
        }

    }
    createButton(divTable, newPersonEventHandler, "New Person");
    createButton(divTable, deletePersonEventHandler, "Delete Person");
    createButton(divTable, updatePersonEventHandler, "Update Person");
    replaceChilds(this.id, divTable);
};

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso person através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getPerson = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/person');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let people = JSON.parse(xhr.responseText);
            people.person.forEach(p => {
                window.info.people.push(p);
            });
        }
    };
    xhr.send();
};

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso país através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getCountry = function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/country");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);
            response.country.forEach(function(current) {
                window.info.countries.push(current);
            });
        }
    };
    xhr.send();
};

/**
 * Função que apaga o recurso pessoa com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
InfoManager.prototype.removeTopic = function(id) {
    /** @todo Completar */
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/topic/" + id, true);
    xhr.onreadystatechange = function() {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
        }
    }
    xhr.send();
}

/**
 * Função que apaga o recurso pessoa com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
InfoManager.prototype.removePerson = function(id) {
    /** @todo Completar */
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/person/" + id, true);
    xhr.onreadystatechange = function() {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);


        }
    }
    xhr.send();
}

/**
 * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
 * @param {String} acao - controla qual a operação do CRUD queremos fazer
 */
InfoManager.prototype.processingTopic = function(acao) {
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let birthDate = document.getElementById("date").value;
    let countryList = document.getElementById("countries");
    let idCountry = countryList.options[countryList.selectedIndex].value;
    let person = { id: id, name: name, birthDate: birthDate, idCountry: idCountry };
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    if (acao === "create") {

        /** @todo Completar */
        xhr.open("POST", "/person", true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);

            }
        }
        xhr.send();

    } else if (acao === "update") {

        /** @todo Completar */
        xhr.open("PUT", "/person/" + id, true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);

            }
        }
        xhr.send();

    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(person));
}
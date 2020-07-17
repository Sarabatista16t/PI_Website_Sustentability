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
    this.users = new Array();
    this.topics = new Array();
    this.loggedUser = undefined;
};

/*====================================================================================*/
/*=======================          AJAX FUNCTIONS            =========================*/
/*====================================================================================*/


/**
 * Sends the login info to the server, for it to check from the database and display the page if successfully
 */
InfoManager.prototype.login = function() {
    let div = document.getElementById("LoginPage").children;
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
    });

    const self = this;
    req.responseType = 'json';

    req.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let user = this.response.user[0];
            self.loggedUser = new User(user.Id, user.name, user.email, user.password, user.roles);
            console.log("LOGIN COM SUCESSO");
        }
    }
    showMainPage();
    req.send(JSON.stringify(user));
}

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso topics através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getUsers = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/users');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let users = JSON.parse(xhr.responseText);
            users.forEach(e => {
                window.info.users.push(e);
            })
            window.info.showUsers();
        }
    };
    xhr.send();
};


/**
 * Função que apaga o recurso pessoa com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
InfoManager.prototype.removeUser = function(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/user/" + id, true);
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
InfoManager.prototype.processingUser = function(acao) {
    let div = document.getElementById("RegisterPage").children;
    let form = div.formPerson;
    let name = form.name.value;
    let email = form.email.value;
    let password = form.password.value;
    let confirmPassword = form.confirmPassword.value;
    let role = 'editor';
    let user = {
        "name": name,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword,
        "roles": role
    }
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    if (acao === "create") {
        xhr.open("POST", "/user", true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        xhr.send();

    } else if (acao === "update") {
        xhr.open("PUT", "/user/" + id, true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        xhr.send();
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(user));
}


/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso topics através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getTopics = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/topics');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let topics = JSON.parse(xhr.responseText);
            topics.forEach(t => {
                window.info.topics.push(t);
            });
            window.info.showTopics();
            window.info.showExtraTopics();
        }
    };
    xhr.send();
};

/**
 * Função que apaga o recurso pessoa com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
InfoManager.prototype.removeTopic = function(id) {
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
 * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
 * @param {String} acao - controla qual a operação do CRUD queremos fazer
 */
InfoManager.prototype.processingTopic = function(acao) {
    let div = document.getElementById("TopicsPage").children;
    let form = div.formTopic;
    let title = form.title.value;
    let text = form.text.value;
    let topic = {
        "title": title,
        "text": text
    }
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    if (acao === "create") {
        xhr.open("POST", "/topic", true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        xhr.send();

    } else if (acao === "update") {
        xhr.open("PUT", "/topic/" + id, true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        xhr.send();
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(topic));
}



/*====================================================================================*/
/*=======================            SHOW FUNCTIONS          =========================*/
/*====================================================================================*/


/**
 * coloca a palavra "Utilizadores" no div titulo e cria dinamicamente uma tabela com a informação dos utilizadores
 */
InfoManager.prototype.showUsers = function() {

    document.getElementById("headerTitleUser").innerHTML = "Utilizadores";
    document.getElementById("formPerson").style.display = "none";
    let table = document.createElement("table");
    table.className = "table .table-bordered";

    //table.appendChild(tableLine(new User(), true));

    // Create table head
    let header = document.createElement("tr");

    let th0 = document.createElement("th");
    th0.scope = "col";
    th0.textContent = "";
    header.appendChild(th0);

    let th1 = document.createElement("th");
    th1.scope = "col";
    th1.textContent = "ID";
    header.appendChild(th1);

    let th2 = document.createElement("th");
    th2.scope = "col";
    th2.textContent = "Nome";
    header.appendChild(th2);

    let th3 = document.createElement("th");
    th3.scope = "col";
    th3.textContent = "Email";
    header.appendChild(th3);

    let th4 = document.createElement("th");
    th4.scope = "col";
    th4.textContent = "Role";
    header.appendChild(th4);

    table.appendChild(header);

    window.info.users.forEach(u => {
        console.log(u)
        let userAux = {
            "id": u._id,
            "name": u.name,
            "email": u.email,
            "role": u.roles
        }
        table.appendChild(tableLine(userAux, false));
    });

    let divTable = document.createElement("divTable");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);

    function deleteUserEventHandler() {
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            const idUser = row.cells[1].firstChild.nodeValue;
            if (checkBox && checkBox.checked) {
                info.removeUser(idUser);
                table.deleteRow(row.rowIndex);
            }
        }

    }

    function newUserEventHandler() {
        replaceChilds('divTable', document.createElement('div'));
        document.getElementById('formPerson').action = 'javascript:info.processingUser("create");';
        document.getElementById('formPerson').style.display = 'block';
        document.getElementById('formPerson').reset();
    }

    function updateUserEventHandler() {
        let idUser = null;
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            if (checkBox && checkBox.checked) {
                idUser = row.cells[1].firstChild.nodeValue;
                break;
            }
        }
        if (idUser) {
            replaceChilds('divTable', document.createElement('div'));
            document.getElementById('formPerson').action = 'javascript:info.processingUser("update");';
            document.getElementById('formPerson').style.display = 'block';
            document.getElementById('formPerson').reset();
            document.getElementById('id').value = idUser;
            const user = info.users.find(i => i._id === idUser);
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            //document.getElementById('role').value = user.roles;
        }
    }
    createButton(divTable, newUserEventHandler, "Novo utilizador");
    createButton(divTable, updateUserEventHandler, "Editar");
    createButton(divTable, deleteUserEventHandler, "Eliminar");
    replaceChilds("divInformationUser", divTable);
};


InfoManager.prototype.showTopics = function() {
    document.getElementById("headerTitleTopic").textContent = "Tópicos";
    document.getElementById("formTopic").style.display = "none";
    let table = document.createElement("table");
    table.className = "table .table-bordered";
    //table.appendChild(tableLine(new User(), true));

    // Create table head
    let header = document.createElement("tr");

    let th0 = document.createElement("th");
    th0.scope = "col";
    th0.textContent = "";
    header.appendChild(th0);

    let th1 = document.createElement("th");
    th1.scope = "col";
    th1.textContent = "ID";
    header.appendChild(th1);

    let th2 = document.createElement("th");
    th2.scope = "col";
    th2.textContent = "Título";
    header.appendChild(th2);

    let th3 = document.createElement("th");
    th3.scope = "col";
    th3.textContent = "Texto";
    header.appendChild(th3);

    table.appendChild(header);

    window.info.topics.forEach(t => {
        let topicAux = {
            "id": t._id,
            "title": t.title,
            "text": t.text
        }
        table.appendChild(tableLine(topicAux, false));
    });

    let divTable = document.createElement("divTable");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);

    function deleteTopicEventHandler() {
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            const idTopic = row.cells[1].firstChild.nodeValue;
            if (checkBox && checkBox.checked) {
                info.removeTopic(idTopic);
                table.deleteRow(row.rowIndex);
            }
        }
    }

    function newTopicEventHandler() {
        replaceChilds('divTable', document.createElement('div'));
        document.getElementById('formTopic').action = 'javascript:info.processingTopic("create");';
        document.getElementById('formTopic').style.display = 'block';
        document.getElementById('formTopic').reset();
    }

    function updateTopicEventHandler() {
        let idTopic = null;
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            if (checkBox && checkBox.checked) {
                idTopic = row.cells[1].firstChild.nodeValue;
                break;
            }
        }
        if (idTopic) {
            replaceChilds('divTable', document.createElement('div'));
            document.getElementById('formTopic').action = 'javascript:info.processingTopic("update");';
            document.getElementById('formTopic').style.display = "block";
            document.getElementById('formTopic').reset();
            document.getElementById('id').value = idTopic;
            const topic = info.topics.find(i => i._id === idTopic);
            console.log("TOPICs " + topic);
            document.getElementById('title').value = "Nome";
            document.getElementById('text').value = "titulo";
            //document.getElementById('title').value = topic.title;
            //document.getElementById('text').value = topic.text;
        }
    }
    createButton(divTable, newTopicEventHandler, "Novo Tópico");
    createButton(divTable, deleteTopicEventHandler, "Eliminar");
    createButton(divTable, updateTopicEventHandler, "Editar");
    replaceChilds("divInformationTopic", divTable);
};

InfoManager.prototype.showExtraTopics = function() {
    if (window.info.topics.length > 0) {
        let divTopics = document.getElementById("divExtraTopics");
        window.info.topics.forEach(t => {
            let topicAux = {
                "id": t._id,
                "title": t.title,
                "text": t.text
            }
            let topic = createTopic(topicAux.title, topicAux.text);
            divTopics.appendChild(topic);
        });
    }
}
"use strict";

/** 
 * @class Gets all the necessary information from the database and displays it correctly in the HTML.
 * @constructs InfoManager
 * @param {string} id - id do elemento HTML que contém a informação.
 * @property {country[]} users - Array de objetos do tipo User, para guardar todos os utilizadores do nosso sistema
 * @property {person[]} topics - Array de objetos do tipo Topic, para guardar todas os tópicos do nosso sistema
 * @param {User} loggedUser - Utilizador que está logado no sistema.
 */
function InfoManager(id) {
    this.id = id;
    this.users = [];
    this.topics = [];
    this.topicsWithCards = [];
    this.loggedUser = undefined;
};




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
        document.getElementById("RegisterPage").style.display = "block";
        document.getElementById("divInformationUser").style.display = "none";
        document.getElementById("headerTitleUser").style.display = "none";
        document.getElementById('formPerson').reset();
        console.log("CREATE USER ");
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
            document.getElementById("RegisterPage").style.display = "block";
            document.getElementById("divInformationUser").style.display = "none";
            document.getElementById("headerTitleUser").style.display = "none";
            document.getElementById('formPerson').reset();
            document.getElementById('id').value = idUser;
            const user = info.users.find(i => i._id === idUser);
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            console.log("USERS " + user.name);
        }
    }
    createButton(divTable, newUserEventHandler, "Novo utilizador");
    createButton(divTable, updateUserEventHandler, "Editar");
    createButton(divTable, deleteUserEventHandler, "Eliminar");
    replaceChilds("divInformationUser", divTable);
};

/**
 * coloca a palavra "Tópicos" no div titulo e cria dinamicamente uma tabela com a informação dos tópicos.
 */
InfoManager.prototype.showTopics = function() {
    document.getElementById("headerTitleTopic").textContent = "Tópicos";
    document.getElementById("formTopic").style.display = "none";
    document.getElementById("formTopicCards").style.display = "none";
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

    window.info.topicsWithCards.forEach(t => {
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
        document.getElementById('formTopic').action = 'javascript:info.processingSimpleTopic("create");';
        document.getElementById('formTopic').style.display = "block";
        document.getElementById("formTopicCards").style.display = "none";
        document.getElementById("TopicsPage").style.display = "block";
        document.getElementById("divInformationTopic").style.display = "none";
        document.getElementById("headerTitleTopic").style.display = "none";
        document.getElementById('formTopic').reset();
    }

    function newTopicCardsEventHandler() {
        replaceChilds('divTable', document.createElement('div'));
        document.getElementById('formTopicCards').action = 'javascript:info.processingTopicWithCards("create");';
        document.getElementById('formTopicCards').style.display = "block";
        document.getElementById("formTopic").style.display = "none";
        document.getElementById("TopicsPage").style.display = "block";
        document.getElementById("divInformationTopic").style.display = "none";
        document.getElementById("headerTitleTopic").style.display = "none";
        document.getElementById('formTopicCards').reset();
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
            document.getElementById("TopicsPage").style.display = "block";
            document.getElementById("divInformationTopic").style.display = "none";
            document.getElementById("headerTitleTopic").style.display = "none";
            document.getElementById('formTopic').reset();
            document.getElementById('id').value = idTopic;
            const topic = info.topics.find(i => i._id === idTopic);
            document.getElementById('title').value = topic.title;
            document.getElementById('text').value = topic.text;
        }
    }
    createButton(divTable, newTopicCardsEventHandler, "Novo Tópico com cartões");
    createButton(divTable, newTopicEventHandler, "Novo Tópico simples");
    createButton(divTable, updateTopicEventHandler, "Editar");
    createButton(divTable, deleteTopicEventHandler, "Eliminar");
    replaceChilds("divInformationTopic", divTable);
};

/**
 * Coloca dinamicamente os tópicos na main page.
 */
InfoManager.prototype.showExtraSimpleTopics = function() {
    if (window.info.topics.length > 0) {
        let divTopics = document.getElementById("divExtraTopics");
        window.info.topics.forEach(t => {
            let date = "" + t.date;
            let topicAux = {
                "id": t._id,
                "title": t.title,
                "text": t.text,
                "image": t.image,
                "date": date.split('T')[0]
            }
            let topic = createTopic(topicAux.title, topicAux.text, topicAux.image, topicAux.date);
            divTopics.appendChild(topic);
        });
    }
}

/**
 * Coloca dinamicamente os tópicos na main page.
 */
InfoManager.prototype.showExtraTopicsWithCards = function() {
    if (window.info.topicsWithCards.length > 0) {
        let divTopics = document.getElementById("divExtraTopics");
        window.info.topicsWithCards.forEach(t => {
            let date = "" + t.date;
            let topicAux = {
                "id": t._id,
                "title": t.title,
                "text": t.text,
                "card1_text": t.card1_text,
                "card1_img": t.card1_img,
                "card2_text": t.card2_text,
                "card2_img": t.card2_img,
                "card3_text": t.card3_text,
                "card3_img": t.card3_img,
                "date": date.split('T')[0]
            }
            let topic = createTopicWithCards(topicAux);
            divTopics.appendChild(topic);
        });
    }
}

/*====================================================================================*/
/*=======================          AJAX FUNCTIONS            =========================*/
/*====================================================================================*/


/**
 * Função que envia o login para o sevidor NODE.JS 
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
            showMainPage(); // ??
        }
    }
    req.send(JSON.stringify(user));
}

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso utilizadores através do verbo GET, usando pedidos assincronos e JSON
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
        // window.location.reload();
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
        "roles": role
    }

    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    if (acao === "create") {
        xhr.open("POST", "/user");
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        console.log(JSON.stringify(user));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(user));

    } else if (acao === "update") {
        xhr.open("PUT", "/user/" + id);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        console.log(JSON.stringify(user));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(user));
    }
    window.location.reload();
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
            window.info.showExtraSimpleTopics();
        }
    };
    xhr.send();
};

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso topics através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getTopicsWithCards = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/topicsWithCards');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let topicsWithCards = JSON.parse(xhr.responseText);
            topicsWithCards.forEach(t => {
                window.info.topicsWithCards.push(t);
            });
            window.info.showExtraTopicsWithCards();
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
        window.location.reload();
    }
    xhr.send();
}

/**
 * Função que apaga o recurso pessoa com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
InfoManager.prototype.removeTopicWithCards = function(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/topicWithCards/" + id, true);
    xhr.onreadystatechange = function() {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
        }
        window.location.reload();
    }
    xhr.send();
}

/**
 * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
 * @param {String} acao - controla qual a operação do CRUD queremos fazer
 */
InfoManager.prototype.processingSimpleTopic = function(acao) {
    let div = document.getElementById("TopicsPage").children;
    let form = div.formTopic;
    let title = form.title.value;
    let text = form.text.value;
    let image = form.image.value;
    let topic = {
        "title": title,
        "text": text,
        "image": image,
        "idUser": "1",
        "date": Date.now()
            // "idUser": this.loggedUser.Id
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
        console.log(JSON.stringify(topic));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(topic));

    } else if (acao === "update") {
        xhr.open("PUT", "/topic/" + id, true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        console.log(JSON.stringify(topic));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(topic));
    }
    window.location.reload();
}


/**
 * Função que apaga o recurso pessoa com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
InfoManager.prototype.removeTopicWithCards = function(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/topicWithCards/" + id, true);
    xhr.onreadystatechange = function() {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
        }
        window.location.reload();
    }
    xhr.send();
}

/**
 * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
 * @param {String} acao - controla qual a operação do CRUD queremos fazer
 */
InfoManager.prototype.processingTopicWithCards = function(acao) {
    let div = document.getElementById("TopicsPage").children;
    let form = div.formTopicCards;
    let title = form.title.value;
    let text = form.text.value;
    let card1Title = form.titleCard1.value;
    let card1Text = form.textCard1.value;
    let card1Img = form.imageCard1.value;
    let card2Title = form.titleCard2.value;
    let card2Text = form.textCard2.value;
    let card2Img = form.imageCard2.value;
    let card3Title = form.titleCard3.value;
    let card3Text = form.textCard2.value;
    let card3Img = form.imageCard3.value;

    let topic = {
        "title": title,
        "text": text,
        "card1_title": card1Title,
        "card1_text": card1Text,
        "card1_img": card1Img,
        "card2_title": card2Title,
        "card2_text": card2Text,
        "card2_img": card2Img,
        "card3_title": card3Title,
        "card3_text": card3Text,
        "card3_img": card3Img,
        "idUser": "1",
        "date": Date.now()
            // "idUser": this.loggedUser.Id
    }

    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    if (acao === "create") {
        xhr.open("POST", "/topicWithCards", true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        console.log(JSON.stringify(topic));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(topic));

    } else if (acao === "update") {
        xhr.open("PUT", "/topicWithCards/" + id, true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        console.log(JSON.stringify(topic));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(topic));
    }
    window.location.reload();
}
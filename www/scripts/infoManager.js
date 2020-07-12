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
    this.users = [];
    this.topics = [];
};

/*====================================================================================*/
/*==================           AUTENTICATION AJAX            =========================*/
/*====================================================================================*/


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



/*====================================================================================*/
/*=======================             GETS AJAX              =========================*/
/*====================================================================================*/

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso topics através do verbo GET, usando pedidos assincronos e JSON
 */
InfoManager.prototype.getUsers = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/users');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let users = JSON.parse(xhr.responseText);
            users.forEach(u => {
                window.info.users.push(u);
            });
        }
    };
    xhr.send();
};

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
        }
    };
    xhr.send();
};


/*====================================================================================*/
/*=======================                SHOW                =========================*/
/*====================================================================================*/


/**
 * coloca a palavra "Utilizadores" no div titulo e cria dinamicamente uma tabela com a informação dos utilizadores
 */
InfoManager.prototype.showUsers = function() {
    document.getElementById("headerTitle").textContent = "Utilizadores";
    document.getElementById("formPerson").style.display = "none";
    let table = document.createElement("table");
    table.appendChild(dom.tableLine(new User(), true));
    window.info.users.forEach(u => {
        table.appendChild(tableLine(u, false));
    });

    let divTable = document.createElement("divTable");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);

    function deleteUserEventHandler() {
        for (const row of table.rows) {
            const checkBox = row.cells[0].firstChild;
            const idUser = row.cells[1].firstChild.nodeValue;
            if (checkBox && checkBox.checked) {
                self.removeUser(idUser);
                divTable.deleteRow(row.rowIndex);
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
            const user = self.users.find(i => i.id === idUser);
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.roles[0];
        }
    }
    createButton(divTable, newUserEventHandler, "Novo utilizador");
    createButton(divTable, deleteUserEventHandler, "Eliminar");
    createButton(divTable, updateUserEventHandler, "Editar");
    replaceChilds(this.id, divTable);
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
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let user = { id: id, name: name, email: email };
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    if (acao === "create ") {
        xhr.open("POST", "/user", true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        }
        xhr.send();

    } else if (acao === "update ") {
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
    xhr.send(JSON.stringify(person));
}

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
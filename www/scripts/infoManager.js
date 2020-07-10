"use strict";

/** 
 * @class Guarda toda informação necessaria na execução do exercicio 
 * @constructs Informacao
 * @param {string} id - id do elemento HTML que contém a informação.
 * 
 * @property {string} id - id do elemento HTML que contém a informação.
 * @property {country[]} countries - Array de objetos do tipo Country, para guardar todos os countries do nosso sistema
 * @property {person[]} people - Array de objetos do tipo person, para guardar todas as pessoas do nosso sistema
 */
function InfoManager(id) {
    this.id = id;
    this.people = [];
    this.countries = [];
};

/**
 * coloca a view "MainPage" no div "divMainPage" e limpa o div "divTeam"
 */
InfoManager.prototype.showHome = function() {
    document.getElementById("divMainPage").textContent = "../views/MainPage.html";
    document.getElementById("divTeam").style.display = "none";
    replaceChilds(this.id, document.createElement("div"));
};

/**
 * coloca a view "TeamPage" no div "divTeam" e limpa o div "divMainPage"
 */
InfoManager.prototype.showHome = function() {
    document.getElementById("divTeam").textContent = "../views/TeamPage.html";
    document.getElementById("divMainPage").style.display = "none";
    replaceChilds(this.id, document.createElement("div"));
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
 * Função que apaga o recurso pessoa com ym pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
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
InfoManager.prototype.processingPerson = function(acao) {
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
        var xhr = new XMLHttpRequest();
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
        var xhr = new XMLHttpRequest();
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
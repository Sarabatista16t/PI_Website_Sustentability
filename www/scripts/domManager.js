/**
 * Função que substitui todos os elementos filhos de um elemento HTML por um novo elemento HTML (facilitador de DOM)
 * @param {string} id - id do elemento HTML para o qual se pretende substituir os filhos.
 * @param {HTMLElement} newSon - elemento HTML que será o novo filho.
 */
function replaceChilds(id, newSon) {
    var no = document.getElementById(id);
    while (no.hasChildNodes()) {
        no.removeChild(no.lastChild);
    }
    no.appendChild(newSon);
};

/**
 * Função que recebe um qualquer objeto e retorna dinamicamente uma linha de tabela HTML com informação relativa ao estado das suas propriedades
 * @param {Object} object - objecto do qual vamos transformar o conteudo dos seus atributos em linhas
 * @param {boolean} headerFormat - controla de o formato é cabeçalho ou linha normal
 */
function tableLine(object, headerFormat) {
    var tr = document.createElement("tr");
    if (!headerFormat) tr.appendChild(createCellCheckbox());
    else tr.appendChild(document.createElement("th"));
    var tableCell = null;
    for (var property in object) {
        if ((object[property] instanceof Function))
            continue;
        if (headerFormat) {
            tableCell = document.createElement("th");
            tableCell.textContent = property[0].toUpperCase() + property.substr(1, property.length - 1);
        } else {
            tableCell = document.createElement("td");
            tableCell.textContent = object[property];
        }
        tr.appendChild(tableCell);
    }
    return tr;
};

/**
 * Função genérica que tem como objetivo a criação de uma coluna com checkbox
 */
function createCellCheckbox() {
    var td = document.createElement("td");
    var check = document.createElement("input");
    check.type = "checkbox";
    td.appendChild(check);
    return td;
}

/**
 * Função genérica que cria um botão HTML, dá-lhe um evento e coloca-o na árvore de nós
 * @param {HTMLElement} fatherNode - nó pai do botão
 * @param {function} eventHandler - evento do botão.
 * @param {String} value - texto do botão.
 */
function createButton(fatherNode, eventHandler, value) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.className = "btn btn-success";
    button.addEventListener("click", eventHandler);
    fatherNode.appendChild(button);
}

/**
 * Função que cria um elemento "topic" com base nos parâmetros.
 * @param {*} topicTitle 
 * @param {*} topicText 
 */
function createTopic(topicTitle, topicText, topicImg, topicDate) {
    var title = document.createElement("h1");
    title.textContent = topicTitle;
    title.className = 'display-4';

    var text = document.createElement("p");
    text.textContent = topicText;
    text.className = 'lead';

    var articleTopic = document.createElement("article");
    articleTopic.setAttribute("id", "divTopic");
    articleTopic.appendChild(title);
    articleTopic.appendChild(text);

    if (topicImg) {
        var img = document.createElement("img");
        img.src = topicImg;
        img.style.display = "block";
        img.style.margin = "auto";
        articleTopic.appendChild(img);
    }

    var date = document.createElement("p");
    date.textContent = "Publicado em " + topicDate;
    date.style.fontStyle = "oblique";
    date.className = 'lead';

    articleTopic.appendChild(date);
    articleTopic.className = 'jumbotron';
    return articleTopic;
}

/**
 * Função que cria um elemento "topic" com base nos parâmetros.
 * @param {*} topicTitle 
 * @param {*} topicText 
 */
function createTopicWithCards(topic) {
    var title = document.createElement("h1");
    title.textContent = topic.title;
    title.className = 'display-4';

    var text = document.createElement("p");
    text.textContent = topic.text;
    text.className = 'lead';

    var divCards = document.createElement("div");
    divCards.className = "row d-flex mt-3 flex-wrap justify-content-between";

    var card1 = createCard(topic.card1_title, topic.card1_text, topic.card1_img);
    var card2 = createCard(topic.card2_title, topic.card2_text, topic.card2_img);
    var card3 = createCard(topic.card3_title, topic.card3_text, topic.card3_img);

    divCards.appendChild(card1);
    divCards.appendChild(card2);
    divCards.appendChild(card3);

    var date = document.createElement("p");
    date.textContent = "Publicado em " + topic.date;
    date.style.fontStyle = "oblique";
    date.className = 'lead';

    var articleTopic = document.createElement("article");
    articleTopic.setAttribute("id", "divTopic");
    articleTopic.appendChild(title);
    articleTopic.appendChild(text);
    articleTopic.appendChild(divCards);
    articleTopic.appendChild(date);
    articleTopic.className = 'jumbotron';
    return articleTopic;
}

/**
 * Function to create a card.
 * @param {} title 
 * @param {*} text 
 */
function createCard(title, text, img) {
    var card = document.createElement("div");
    card.className = 'card';

    var cardImage = document.createElement("img");
    cardImage.className = 'card-img-top';
    cardImage.alt = "IPS";
    cardImage.style = "width:100%;";
    if (img) {
        cardImage.src = img;
    } else {
        cardImage.src = "https://cdn4.ecycle.com.br/cache/images/2020-07/50-650-sustentabilidade.jpg";
    }

    var cardBody = document.createElement("div");
    cardBody.className = 'card-body lead';

    var cardTitle = document.createElement("h5");
    cardTitle.className = 'card-title';
    cardTitle.textContent = title;

    var cardText = document.createElement("p");
    cardText.className = 'card-text';
    cardText.textContent = text;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(cardImage);
    card.appendChild(cardBody);

    return card;
}

/**
 * Funtion to create a modal for choosing the type of topic the user wants to create.
 * @param {*} actionBtn1 
 * @param {*} actionBtn2 
 */
function createTopicsModal(actionBtn1, actionBtn2) {
    var divModal = document.createElement("div");
    divModal.className = "modal fade";
    divModal.id = "topicsModal";
    divModal.tabindex = "-1";
    divModal.role = "dialog";
    //divModal.aria.labelledby = "topicsModal";
    //divModal.aria.hidden = "true";

    var divModalDialog = document.createElement("div");
    divModalDialog.className = "modal-dialog modal-dialog-centered";
    divModalDialog.role = "document";

    var divModalContent = document.createElement("div");
    divModalContent.className = "modal-content";

    var divModalHeader = document.createElement("div");
    divModalHeader.className = "modal-content";
    var title = document.createElement("h5");
    title.textContent = "Publicação de conteúdos";
    title.id = "topicsModalTitle";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "close";
    //btn.data.dismiss = "modal";
    //btn.arial.label = "Close";
    var span = document.createElement("span");
    //span.aria.hidden = "true";
    span.textContent = "& times;";
    btn.appendChild(span);
    divModalHeader.appendChild(title);
    divModalHeader.appendChild(btn);

    var divModalBody = document.createElement("div");
    divModalBody.className = "modal-body";
    divModalBody.textContent = "Selecione o tipo de conteúdo que pretende publicar!";

    var divModalFooter = document.createElement("div");
    divModalFooter.className = "modal-footer";
    // BUTTON TO CREATE TOPICS WITH CARDS
    var btnTopicsWithCards = document.createElement("button");
    btnTopicsWithCards.type = "button";
    btnTopicsWithCards.className = "btn btn-secondary";
    btnTopicsWithCards.onclick = actionBtn1;
    // BUTTON TO CREATE SIMPLE TOPICS
    var btnSimpleTopics = document.createElement("button");
    btnSimpleTopics.type = "button";
    btnSimpleTopics.className = "btn btn-secondary";
    btnSimpleTopics.onclick = actionBtn2;
    divModalFooter.appendChild(btnTopicsWithCards);
    divModalFooter.appendChild(btnSimpleTopics);

    divModalContent.appendChild(divModalHeader);
    divModalContent.appendChild(divModalBody);
    divModalContent.appendChild(divModalFooter);
    divModalDialog.appendChild(divModalContent);
    divModal.appendChild(divModalDialog);
    return divModal;
}

function createModalButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary";
    //btn.toggle = "modal";
    btn.data = "#topicsModal";
    btn.textContent = "Criar tópico";
    return btn;
}

/**
 * Funtion to create an alert
 */
function createSuccessAlert(msg) {
    var alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success alert-dismissible fade show";
    alertDiv.role = "alert";
    alertDiv.textContent = "Sucesso! :) " + msg;

    /*btn.type = "button";
    btn.className = "close";
    btn.dataDismiss = "alert";
    btn.ariaLabel = "Close";

    var span = document.createElement("span");
    span.ariaHidden = "true";
    span.textContent = "&times;";

		btn.appendChild(span);*/

    var btn = document.createElement("node");
    btn.innerHTML = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden ="true"> &times; </span> </button>';

    alertDiv.appendChild(btn);

    return alertDiv;
}
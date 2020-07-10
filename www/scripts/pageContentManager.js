"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * Aproveitamos ainda para solicitar ao servidor o carregamento de dados de forma assincrona(AJAX)
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = function(event) {
    showSlides(1); // inicializar o slide show
    // var info = new Information("divInformation");

    var info = new infoManager();
    /*info.getGames();
    info.getPlayers();
    info.getTeams();
    info.getNews();
    info.getTournaments();*/
    showMainPage(); // show only the main page
    window.info = info;
};

/**
 * Function to hide all the HTML elements in the page, using the CSS properties. 
 */
function hideAll() {
    if (info.loggedUser) {
        document.getElementById("unlogged").style.display = "none";
        document.getElementById("menuManager").style.display = "block";
        document.getElementById("logged").style.display = "block";
    } else {
        document.getElementById("logged").style.display = "none";
        document.getElementById("unlogged").style.display = "block";
        document.getElementById("menuManager").style.display = "none";

    }
    document.getElementById("LoginPage").style.display = "none";
    document.getElementById("RegisterPage").style.display = "none";
    document.getElementById("MainPage").style.display = "none";
    document.getElementById("TeamPage").style.display = "none";
}

/**
 * Function to show only the main page.
 */
function showMainPage() {
    hideAll();
    document.getElementById("MainPage").style.display = "block";
}

/**
 * Function to show only the team page.
 */
function showTeamPage() {
    hideAll();
    document.getElementById("TeamPage").style.display = "block";
}

/**
 * Function to show only the login page.
 */
function showLoginPage() {
    hideAll();
    document.getElementById("LoginPage").style.display = "block";
}

/**
 * Function to show only the register page.
 */
function showRegisterPage() {
    hideAll();
    document.getElementById("RegisterPage").style.display = "block";
}

/**
 * Function to show the logOutPage. Sets the user to undefined and sends the user to the main page
 */
function showLogOut() {
    info.loggedPlayer.logOut();
    info.loggedPlayer = undefined;
    showMainPage()
}
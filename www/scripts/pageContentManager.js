"use strict";

showMainPage();
var info = new InfoManager();
window.info = info;
info.getUsers();
info.getTopics();


let arr = info.users;
console.log("TYPE OF ARRAY " + typeof arr);
console.log("LENGTH ARRAY " + arr.length);
console.log("CONTEÚDO DO ARRAY " + arr);

//info.showUsers();
//info.showTopics();
//info.showExtraTopics();

/**
 * Function to hide all the HTML elements in the page, using the CSS properties. 
 */
function hideAll() {
    /*if (this.info.loggedUser) {
        document.getElementById("menuWithoutLogin").style.display = "block";
        document.getElementById("menuWithLogin").style.display = "none";
    } else {
        document.getElementById("menuWithoutLogin").style.display = "none";
        document.getElementById("menuWithLogin").style.display = "block";
    }*/
    document.getElementById("LoginPage").style.display = "none";
    document.getElementById("RegisterPage").style.display = "none";
    document.getElementById("divInformationUser").style.display = "none";
    document.getElementById("headerTitleUser").style.display = "none";
    document.getElementById("divInformationTopic").style.display = "none";
    document.getElementById("headerTitleTopic").style.display = "none";
    document.getElementById("TopicsPage").style.display = "none";
    document.getElementById("MainPage").style.display = "none";
    document.getElementById("TeamPage").style.display = "none";
}

/**
 * Function to show only the main page.
 */
function showMainPage() {
    hideAll();
    //info.showExtraTopics();
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
 * Function to show only the main page.
 */
function showRegisterFormPage() {
    hideAll();
    document.getElementById("RegisterPage").style.display = "block";
}

/**
 * Function to show only the register page.
 */
function showTopicsFormPage() {
    hideAll();
    document.getElementById("TopicsPage").style.display = "block";
}

/**
 * Function to show only the register page.
 */
function showUsersPage() {
    hideAll();
    //info.showUsers();
    document.getElementById("headerTitleUser").style.display = "block";
    document.getElementById("divInformationUser").style.display = "block";
}

/**
 * Function to show only the register page.
 */
function showTopicsPage() {
    hideAll();
    //info.showTopics();
    document.getElementById("headerTitleTopic").style.display = "block";
    document.getElementById("divInformationTopic").style.display = "block";
}


/**
 * Function to show the logOutPage. Sets the user to undefined and sends the user to the main page
 */
function showLogOut() {
    info.loggedPlayer.logOut();
    info.loggedPlayer = undefined;
    showMainPage()
}
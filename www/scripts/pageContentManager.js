"use strict";

showMainPage();
var info = new InfoManager();
window.info = info;
info.getUsers();
info.getTopics();


/**
 * Function to hide all the HTML elements in the page, using the CSS properties. 
 */
function hideAll() {
    /*if (info.loggedUser) {
        document.getElementById("unlogged").style.display = "none";
        document.getElementById("menuManager").style.display = "block";
        document.getElementById("logged").style.display = "block";
    } else {
        document.getElementById("logged").style.display = "none";
        document.getElementById("unlogged").style.display = "block";
        document.getElementById("menuManager").style.display = "none";

    }*/
    document.getElementById("LoginPage").style.display = "none";
    document.getElementById("CreateUserPage").style.display = "none";
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
 * Function to show only the main page.
 */
function showManageContentsPage() {
    hideAll();
    document.getElementById("manageContents").style.display = "block";
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
function showCreateUserPage() {
    hideAll();
    document.getElementById("CreateUserPage").style.display = "block";
}

/**
 * Function to show the logOutPage. Sets the user to undefined and sends the user to the main page
 */
function showLogOut() {
    info.loggedPlayer.logOut();
    info.loggedPlayer = undefined;
    showMainPage()
}
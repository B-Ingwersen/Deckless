/* page.js
    This file defines functions for handling navigation actions on the setup
    and game pages (ie event handlers for button presses); these are currently
    invoked through hardcoded css attributes in games.html
*/

/* a list of the valid screen names */
var page_screenNames = ['welcome', 'webWait', 'webOwner', 'local', 'game'];

/* a list of the setup functions for each game */
var page_screenSetups = {
    welcome : null,
    webWait : page_webWait_setup,
    webOwner : page_webOwner_setup,
    local : page_local_setup,
    game : null
};

/* page_setScreen
    navigate to a specific screen by switching to that HTML element

    name: a string; the identifier of the desired screen
        should be one of the strings in page_screenNames
*/
function page_setScreen(name) {
    // hide all of the screen html elements
    for (var i = 0; i < page_screenNames.length; i++) {
        document.getElementById(page_screenNames[i] + "-screen").style.display = 'none';
    }

    // unhide the desired screen
    document.getElementById(name + "-screen").style.display = 'inherit';

    // call the screen's setup function if it has one
    if (page_screenSetups[name]) {
        page_screenSetups[name]();
    }
}

/* page_welcome_joinInvalid
    set an error message in the join box on the welcome screen

    text: the text of the error message to display (a string)
*/
function page_welcome_joinInvalid(text) {
    document.getElementById('welcome-join-error').innerHTML = text;
}

/* event listerner for submitting the welcome-join-form */
document.getElementById('welcome-join-form').addEventListener("submit", (e) => {
    // stop post behavior
    e.preventDefault();

    // get the user inputted code and nickname
    var groupCode = document.getElementById("welcome-join-code").value;
    var name = document.getElementById("welcome-join-name").value;

    // check that the nickname field was filled in
    if (name == "") {
        page_welcome_joinInvalid("Please enter a nickname.");
    }

    // check that the group code was filled in
    else if (groupCode == "") {
        page_welcome_joinInvalid("Please enter a group code.");
    }
    else {
        page_welcome_joinInvalid("Please wait...");

        // attempt to join the game; on success navigate to the wait screen; on
        // failure, display an error message
        web_joinGame(groupCode, name, function() {
            game_type = "web";
            web_amOwner = false;
            page_welcome_joinInvalid("");
            page_setScreen('webWait');
        }, function() {
            page_welcome_joinInvalid("Sorry, this group wasn't found.");
        });
    }
});

/* page_welcome_createInvalid
    set an error message in the create game box on the welcome screen

    text: the text of the error message to display (a string)
*/
function page_welcome_createInvalid(text) {
    document.getElementById('welcome-create-error').innerHTML = text;
}

/* event listener for submitting the game creation form */
document.getElementById('welcome-create-form').addEventListener("submit", (e) => {
    // stop post behavior
    e.preventDefault();

    // get the users nickname
    var name = document.getElementById("welcome-create-name").value;

    // check that the nickname field was filled in
    if (name == "") {
        page_welcome_createInvalid("Please enter a nickname.");
    }
    else {
        // attempt to create the game; on success navigate to the wait screen;
        // on failure, display an error message
        web_createGameGroup(name, function(/* Success */) {
            game_type = "web";
            web_amOwner = true;
            page_setScreen('webOwner');
        }, function(/* Error */) {
            page_welcome_createInvalid("Sorry, an error occured when creating your game.")
        });
    }
});

/* page_webWait_setup
    setup the waiting screen when a user joins a multiplayer game which they are
    not the host of
*/
function page_webWait_setup() {
    // set a title saying what game the user joined
    var title = document.getElementById('webWait-title');
    title.innerHTML = "You have joined group " + web_gameCode;
}

/* page_webOwner_setup
    setup the game start screen for the host of a multiplayer game
*/
function page_webOwner_setup() {

    // display what the group code is
    var title = document.getElementById('webOwner-title');
    title.innerHTML = "Your Group Code is: <b>" + web_gameCode + "</b>";

    // create the game list
    var gameList = document.getElementById('webOwner-gameList');
    gameList.innerHTML = "";

    // add each game to the game list
    var gameNames = Object.keys(game_catalog);
    for (var i = 0; i < gameNames.length; i++) {
        var gameName = gameNames[i];

        // create a card element with game information and a button to start
        // the game
        cardHTML = '<div class="w3-col s12 m6 l4 w3-padding">' +
            '<div class="w3-card w3-white imitation-card w3-padding">' + 
            '<h2>' + game_catalog[gameName].fullName + '</h2>' +
            '<p>' + game_catalog[gameName].description + '<p/>' +
            '<button class="w3-button w3-blue" onclick="' + 
            "web_buildGame('" + gameName + "')" +
            '">Launch Game</button>' + 
            '</div>';

        gameList.innerHTML += cardHTML;
    }
}

/* event listener for the local game button on the welcome screen */
document.getElementById('welcome-local-form').addEventListener("submit", (e) => {
    // prevent post behavior
    e.preventDefault();

    // set the local game type and switch to the local game setup screen
    game_type = "local";
    page_setScreen('local');
});

/* page_local_setup
    setup the local game setup screen
*/
function page_local_setup() {
    // create the game list
    var gameList = document.getElementById('local-gameList');
    gameList.innerHTML = "";

    // add each game to the game list
    var gameNames = Object.keys(game_catalog);
    for (var i = 0; i < gameNames.length; i++) {
        // extract the player limits for the game
        var gameName = gameNames[i];
        var minPlayers = String(game_catalog[gameName].minPlayers - 1);
        var maxPlayers = String(game_catalog[gameName].maxPlayers - 1);

        // create a card element with game information and a button to start
        // the game along with options to adjust the number of AI players
        cardHTML = '<div class="w3-col s12 m6 l4 w3-padding">' +
            '<div class="w3-card w3-white imitation-card w3-padding">' + 
            '<h2>' + game_catalog[gameName].fullName + '</h2>' +
            '<p>' + game_catalog[gameName].description + '</p>' +
            '<form>' + 
            '<label>AI Players:</label>' +
            '<input class="w3-input w3-margin-bottom" type="number" ' + 
            'min="' + minPlayers + '" ' + 'max="' + maxPlayers + '" ' +
            'value="' + minPlayers + '" id="local-nPlayers-' + gameName + '">' +
            '<button class="w3-button w3-blue" type="button" onclick="' + 
            "buildLocalGame('" + gameName + "', Number(document.getElementById(" +
            "'local-nPlayers-" + gameName + "').value) + 1)" +
            '">Launch Game</button>' + 
            '</form>' +
            '</div>';

        gameList.innerHTML += cardHTML;
    }
}

/* event listener for before unload; force a prompt message for "are you sure
you want to quit if a game type has been selected" */
window.addEventListener("beforeunload", function(event) {
    // force the "are you sure" dialogue if a game type has been selected
    if (game_type) {
        event.preventDefault();
        event.returnValue = '';
    }

    // otherwise allow exit normally
    else {
        delete event['returnValue'];
    }
});
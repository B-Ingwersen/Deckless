/* Helper functions for the setup-pages */

function page_setScreen(name) {
    for (var i = 0; i < page_screenNames.length; i++) {
        document.getElementById(page_screenNames[i] + "-screen").style.display = 'none';
    }
    document.getElementById(name + "-screen").style.display = 'inherit';
    if (page_screenSetups[name]) {
        page_screenSetups[name]();
    }
}

function page_welcome_joinInvalid(text) {
    document.getElementById('welcome-join-error').innerHTML = text;
}

document.getElementById('welcome-join-form').addEventListener("submit", (e) => {
    e.preventDefault();

    var groupCode = document.getElementById("welcome-join-code").value;
    var name = document.getElementById("welcome-join-name").value;

    if (name == "") {
        page_welcome_joinInvalid("Please enter a nickname.");
    }
    else if (groupCode == "") {
        page_welcome_joinInvalid("Please enter a group code.");
    }
    else {
        page_welcome_joinInvalid("Please wait...");

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

function page_welcome_createInvalid(text) {
    document.getElementById('welcome-create-error').innerHTML = text;
}

document.getElementById('welcome-create-form').addEventListener("submit", (e) => {
    e.preventDefault();

    var name = document.getElementById("welcome-create-name").value;

    if (name == "") {
        page_welcome_createInvalid("Please enter a nickname.");
    }
    else {
        web_createGameGroup(name, function(/* Success */) {
            game_type = "web";
            web_amOwner = true;
            page_setScreen('webOwner');
        }, function(/* Error */) {
            page_welcome_createInvalid("Sorry, an error occured when creating your game.")
        });
        game_type = "web";
        web_amOwner = true;
        page_setScreen('webOwner');
    }
});

function page_webWait_setup() {
    var title = document.getElementById('webWait-title');

    title.innerHTML = "You have joined group " + web_gameCode;
}

function page_webOwner_setup() {
    var title = document.getElementById('webOwner-title');

    title.innerHTML = "Your Group Code is: <b>" + web_gameCode + "</b>";

    var gameList = document.getElementById('webOwner-gameList');
    gameList.innerHTML = "";

    var gameNames = Object.keys(game_catalog);
    for (var i = 0; i < gameNames.length; i++) {
        var gameName = gameNames[i];

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

document.getElementById('welcome-local-form').addEventListener("submit", (e) => {
    e.preventDefault();

    game_type = "local";
    page_setScreen('local');
});

function page_local_setup() {
    var gameList = document.getElementById('local-gameList');
    gameList.innerHTML = "";

    var gameNames = Object.keys(game_catalog);
    for (var i = 0; i < gameNames.length; i++) {
        var gameName = gameNames[i];
        var minPlayers = String(game_catalog[gameName].minPlayers - 1);
        var maxPlayers = String(game_catalog[gameName].maxPlayers - 1);

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

var page_screenNames = ['welcome', 'webWait', 'webOwner', 'local', 'game'];
var page_screenSetups = {
    welcome : null,
    webWait : page_webWait_setup,
    webOwner : page_webOwner_setup,
    local : page_local_setup,
    game : null
};

window.addEventListener("beforeunload", function(event) {
    if (game_type) {
        event.preventDefault();
        event.returnValue = '';
    }
    else {
        delete event['returnValue'];
    }
});
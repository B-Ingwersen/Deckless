
var self_playerID = null;
var game_playerIDs = null;
var game_aiPlayers = null;
var game_playerNames = null;

var game_titleTextIndex = 0;
function game_tempTitleText(text, color) {
    game_titleTextIndex += 1;
    var myTitleTextIndex = game_titleTextIndex;

    if (!color) {
        color = 'black';
    }
    var titleText = document.getElementById('game-title-text')
    titleText.innerHTML = '<b>' + text + '<b>';
    titleText.style.color = color;

    setTimeout(function() {
        if (myTitleTextIndex == game_titleTextIndex) {
            titleText.innerHTML = '';
            titleText.style.color = 'black';
        }
    }, 1000);
}

var game_catalog = {
    ratscrew : {
        setupFunc : ratscrew_setupGame,
        startFunc : ratscrew_startGame,
        fullName : 'Egyptian Ratscrew',
        description : 'Half skill, half luck, and lots of fun slapping the deck',
        minPlayers : 2, /* TODO -- change back to 2 */
        maxPlayers : 6
    }
}

var game_type = null; // "local" or "web"

function game_end() {
    game = null;
    moveProcessingFunction = null;
    movePostFunction = null;
    aiProcessingFunction = null;

    game_playerIDs = null;
    game_playerNames = null;
    game_aiPlayers = [];
}

function game_exitToSelectionScreen() {
    document.getElementById('game-exit').style.display = 'none';
    if (game_type == 'web') {
        moveProcessingFunction = web_processMoveFunc;
        movePostFunction = web_postMoveFunc;
        web_exitGame();
    }
    else if (game_type == 'local') {
        page_setScreen('local');
    }
    else {
        page_setScreen('welcome');
    }
}

var game_exitWait = false;
function game_exitAll() {
    document.getElementById('game-exit').style.display = 'none';
    game_exitWait = true;
    if (game_type == 'web') {
        web_exitAll();
    }
    else {
        game_type = null;
        self_playerID = null;
        page_setScreen('welcome');
        game_exitWait = false;
    }
}

function game_handleWinner(playerID) {
    var winnerName = game_playerNames[playerID];
    var gameType = game_type;
    setTimeout(function() {
        document.getElementById('game-exit').style.display = 'inherit';

        var title = document.getElementById('game-exit-title');
        if (playerID) {
            if (winnerName == "You") {
                title.innerHTML = 'Game Over: You Win!';
            }
            else {
                title.innerHTML = 'Game Over: ' + winnerName + ' Wins!';
            }
        }
        else {
            title.innerHTML = 'Game Over: No Winner';
        }

        var container = document.getElementById('game-exit-container');
        container.innerHTML = "<button class='w3-button w3-block w3-blue w3-margin-bottom' onclick='game_exitToSelectionScreen()'>Play new " + gameType + " game</button>";
        container.innerHTML += "<button class='w3-button w3-block w3-blue' onclick='game_exitAll()'>Exit/Change game type</button>";
    }, 1000);

    game_end();
}

function game_hideExitMenu() {
    document.getElementById('game-exit').style.display = 'none';
}

function game_showExitMenu() {
    document.getElementById('game-exit').style.display = 'inherit';

    document.getElementById('game-exit-title').innerHTML = "Are you sure you want to exit?";

    var container = document.getElementById('game-exit-container');
    container.innerHTML = "<button class='w3-button w3-block w3-blue w3-margin-bottom' onclick='game_hideExitMenu(); game_exitToSelectionScreen()'>Exit current game</button>";
    container.innerHTML += "<button class='w3-button w3-block w3-blue w3-margin-bottom' onclick='game_hideExitMenu(); game_exitAll()'>Exit all</button>";
    container.innerHTML += "<button class='w3-button w3-block w3-blue' onclick='game_hideExitMenu()'>Cancel</button>";
}
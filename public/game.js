/* game.js
    provide the basic parameters for keeping track of players and recording game
    options
    
    managing the UI for exiting the game or when the game is over
*/

var self_playerID = null; /* player id of self */
var game_playerIDs = null; /* ids of all players in the game */
var game_aiPlayers = null; /* ids that belong to ai players */
var game_playerNames = null; /* array of player names in same order as game_playerIDs */

/* the game type:
    'local' : play with ai players, no networking calls made
    'web' : use firebase backend for other players
*/
var game_type = null;

/* the available game types with config/parameters:
    setupFunc: function to initialize the game
    startFunc: function to actually start game play
    fullName: self explanitory
    description: self explanitory
    minPlayers, maxPlayers: limits on # of players in the game

When a new game is developed, it must be added here to show up as an option
*/
var game_catalog = {
    ratscrew : {
        setupFunc : ratscrew_setupGame,
        startFunc : ratscrew_startGame,
        fullName : 'Egyptian Ratscrew',
        description : 'Half skill, half luck, and lots of fun slapping the deck',
        minPlayers : 2,
        maxPlayers : 6
    }
}

/* the current id of the title text; this should be incremented every time the
title text is updated so that each id is unique */
var game_titleTextIndex = 0;

/* game_tempTitleText:
    set the temporary title text (overlay message in the game which dissapears
    after 1 second)

    text: a string with the text to display
    color: css string for the text color; if none specified, it defaults
        to black
*/
function game_tempTitleText(text, color) {
    // get a new title text index and save it for later
    game_titleTextIndex += 1;
    var myTitleTextIndex = game_titleTextIndex;

    // default to black if no color set
    if (!color) {
        color = 'black';
    }

    // set the new title
    var titleText = document.getElementById('game-title-text')
    titleText.innerHTML = '<b>' + text + '<b>';
    titleText.style.color = color;

    // erase the title text after 1 second of displaying it
    setTimeout(function() {
        // set the title text to nothing only if the text hasn't been
        // overwritten since (which would increment game_titleTextIndex)
        if (myTitleTextIndex == game_titleTextIndex) {
            titleText.innerHTML = '';
            titleText.style.color = 'black';
        }
    }, 1000);
}

/* game_end:
    reset all the game configuration parameters to their default state
    note: this function does NOT affect the UI
*/
function game_end() {
    game = null;
    moveProcessingFunction = null;
    movePostFunction = null;
    aiProcessingFunction = null;

    game_playerIDs = null;
    game_playerNames = null;
    game_aiPlayers = [];
}

/* game_exitToSelectionScreen
    while in a game, return to the game selection screen for the specific game
    type (if no game type specified, return back to the welcome screen)
*/
function game_exitToSelectionScreen() {
    // hide the 'game-exit' dialogue
    document.getElementById('game-exit').style.display = 'none';

    // return to the correct selection screen based on game_type
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

/* whether the user has selected to exit the game but the backend has not
completed the operation yet; this is mostly relevant for the 'web' game_type */
var game_exitWait = false;

/* game_exitAll
    perform a UI exit all the way to the welcome screen
*/
function game_exitAll() {
    // hide the 'game-exit' dialogue
    document.getElementById('game-exit').style.display = 'none';

    // record that we have started the exit process
    game_exitWait = true;

    // clear game parameters and perform necessary backend cleanup
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

/* game_handleWinner
    perform a UI and game state update for a particular player winning the game

    playerID: the playerID of the winning player -- set to null to specify that
        nobody won the game
*/
function game_handleWinner(playerID) {
    var winnerName = game_playerNames[playerID];
    var gameType = game_type;

    // wait one second after the winning move to display the game over dialogue
    // (the delay lets animation of the winning move finish)
    setTimeout(function() {
        // display the 'game-exit' panel
        document.getElementById('game-exit').style.display = 'inherit';

        // adjust the dialogue to reflect who won
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

        // display the option to play another game of the same type or return
        // to the welcome screen
        var container = document.getElementById('game-exit-container');
        container.innerHTML = "<button class='w3-button w3-block w3-blue w3-margin-bottom' onclick='game_exitToSelectionScreen()'>Play new " + gameType + " game</button>";
        container.innerHTML += "<button class='w3-button w3-block w3-blue' onclick='game_exitAll()'>Exit/Change game type</button>";
    }, 1000);

    // reset game parameters
    game_end();
}

/* game_hideExitMenu:
    hide the UI exit menu
*/
function game_hideExitMenu() {
    document.getElementById('game-exit').style.display = 'none';
}

/* game_showExitMenu:
    display the UI with options for exiting the game
*/
function game_showExitMenu() {
    // display the UI panel
    document.getElementById('game-exit').style.display = 'inherit';

    // set the header text (in other context displays a game over message)
    document.getElementById('game-exit-title').innerHTML = "Are you sure you want to exit?";

    // present options to go back to the selection screen, the initial menu,
    // or to cancel and return to the game
    var container = document.getElementById('game-exit-container');
    container.innerHTML = "<button class='w3-button w3-block w3-blue w3-margin-bottom' onclick='game_hideExitMenu(); game_exitToSelectionScreen()'>Exit current game</button>";
    container.innerHTML += "<button class='w3-button w3-block w3-blue w3-margin-bottom' onclick='game_hideExitMenu(); game_exitAll()'>Exit all</button>";
    container.innerHTML += "<button class='w3-button w3-block w3-blue' onclick='game_hideExitMenu()'>Cancel</button>";
}
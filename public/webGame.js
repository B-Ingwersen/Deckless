/* webGame.js
    implement the Firebase web backend for games; game info is stored in a
    Firebase realtime Database to coordinate between multiple players
*/

/* the player ID of self */
var web_playerID = null;

/* the id of the game */
var web_gameID = null;

/* the 6 digit code that the user inputs to designate what game they're in; this
can be used to lookup the web_gameID */
var web_gameCode = null;

/* whether self owns the current game */
var web_amOwner = false;

/* firebase config -- fill in with details */
var firebaseConfig = {
    apiKey: /* FILL IN WITH YOUR INFO */,
    authDomain: /* FILL IN WITH YOUR INFO */,
    databaseURL: /* FILL IN WITH YOUR INFO */
    projectId: /* FILL IN WITH YOUR INFO */,
    storageBucket: /* FILL IN WITH YOUR INFO */,
    messagingSenderId: /* FILL IN WITH YOUR INFO */,
    appId: /* FILL IN WITH YOUR INFO */,
    measurementId: /* FILL IN WITH YOUR INFO */
};

// Initialize Firebase, get realtime database hook
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

/* db structure:

deckless-games : {
    games : {
        <game-id> : {
            players : {
                <player-id> : {
                    name : <name>,
                    owner : <true/false>
                },
                ...
            }
            gamePlay : {
                <move-id> : {
                    <move-data>
                },
                ...
            }
        },
        ...
    }
}
*/

/* web_addAuthUser
    make the user an anonymous, authenticated firebase user (or verify that this
    is already true)

    callbackFunc: the function to call if user creation is successful
    errorCallback: the function to call if creating the user fails
*/
function web_addAuthUser(callbackFunc, errorCallback) {
    // check if there is already an authenticated user token that has been used
    // in the last 6 days (user tokens that are unsused for a week or more might
    // get automatically cleaned up)
    var userInfo = firebase.auth().currentUser;
    if (
        !userInfo ||
        Date.parse(userInfo.metadata.lastSignInTime) < Date.now() - 6 * 86400 * 1000
    ) {
        
        // clear the current user if they are already signed in
        if (userInfo) {
            firebase.auth().signOut();
        }

        // anonymously sign in the user, checking for an error
        firebase.auth().signInAnonymously().catch(errorCallback);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                callbackFunc();
            }
            else {
                errorCallback();
            }
        });          
    }
    else {
        callbackFunc();
    }
}

/* web_generateGameCode
    generate a came code if a valid gameID has already been obtained; this
    should only be called if web_amOwner is true. If successful, the game code
    will be stored in the web_gameCode global variable

    gameID: a valid web gameID
    callbackFunc: function to call if the operation is successful
    errorCallback: function to call if the operation fails
*/
function web_generateGameCode(gameID, callbackFunc, errorCallback) {
    // generate a random number between 0 and 999999 (inclusive); convert it to
    // a string and pad it with leading zeros to 6 digits wide
    var gameCode = String(Math.floor(Math.random() * 999999));
    for (var i = gameCode.lenth; i < 6; i++) {
        gameCode = '0' + gameCode;
    }
    
    // check if the gameCode has already been used
    var ref = database.ref('gameCodes/' + gameCode);
    ref.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            // if it already exists, try again
            // TODO -- set a limit of how many times to try before giving up
            web_generateGameCode(gameID, callbackFunc, errorCallback);
        }
        else {

            // try to add the newly generated gameCode to the gameLog entry
            console.log('try game ID', gameID);
            database.ref('gameLog/' + gameID).update({
                code : gameCode
            }, function(error) {

                // check if the operation failed
                console.log('put game ID', gameID);
                if (error) {
                    if (errorCallback) {
                        errorCallback();
                    }
                    return;
                }
                
                // add the gameCode to the list of game codes, and include its
                // associated gameID
                ref.update({
                    id : gameID,
                }, function(error) {
                    // check that the operation succeeded
                    if (error) {
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                    else {
                        web_gameCode = gameCode;
                        console.log('Set game code to:', gameCode);
    
                        if (callbackFunc) {
                            callbackFunc();
                        }
                    }
                });
            });
        }
    });
} 

/* web_createGameGroup
    create a new web game as the owner

    ownerName: the player name for self
    callbackFunc: function to call if the operation is successful
    errorCallback: function to call if the operation fails
*/
function web_createGameGroup(ownerName, callbackFunc, errorCallback) {
    // add self as an authenticated user first
    web_addAuthUser(function() {

    // get a new gameID by asking the database to add a new game entry
    var gameRef = database.ref('games').push();
    var gameID = gameRef.key;

    // add a gameLog entry with the newly generated gameID, and set self to be
    // the owner
    database.ref('gameLog/' + gameID).update({
        owner : firebase.auth().currentUser.uid
    }, function(error) {
        // check if the operation failed
        if (error) {
            web_gameID = null;

            if (errorCallback) {
                errorCallback();
            }

            return;
        }
        else {
            // set the lastModification time for the game as right now
            var initialGameData = {
                lastModification : firebase.database.ServerValue.TIMESTAMP
            };
            gameRef.update(initialGameData, function(error) {
                // check if the operation failed
                if (error) {
                    web_gameID = null;
        
                    if (errorCallback) {
                        errorCallback();
                    }
        
                    return;
                }
                else {
                    web_gameID = gameID;
        
                    // add self as a player in the game
                    var playerID = firebase.auth().currentUser.uid;
                    var playerRef = database.ref('games/' + gameID + '/players/' + playerID);
                    playerRef.update({
                        name : ownerName,
                    }, function (error) {
                        // check if the operation failed
                        if (error) {
                            // clear global variables
                            web_gameID = null;
                            web_playerID = null;
                            self_playerID = null;
        
                            if (errorCallback) {
                                errorCallback();
                            }
                        }
                        else {
                            // set the global variables for the player and game
                            // info
                            web_gameID = gameID;
                            web_playerID = playerID;
                            self_playerID = playerID;
        
                            console.log('Game created with gameID=', gameID, ', playerID=', playerID);
        
                            // generate the game code
                            web_generateGameCode(gameID, callbackFunc, errorCallback);
                        }
                    });
                }
            });
        }
    });
    }, function() {
        if (errorCallback()) {
            errorCallback();
        }
    });
}

/* web_postMoveFunc
    implement postMove for a web game

    info: a dictionary describing a valid move
*/
function web_postMoveFunc(info) {
    console.log(info);
    if (web_gameID) {
        // add a new entry to the game's gamePlay list
        var move = database.ref('games/' + web_gameID + '/gamePlay').push();
        move.set(info);

        // update when the game was last modified
        var timestampRef = database.ref('games/' + web_gameID);
        timestampRef.update({
            lastModification : firebase.database.ServerValue.TIMESTAMP
        });
    }
}

/* web_processMoveFunc
    implement processMove for a web game

    moveID: the unique ID of the move
    info: dictionary describing a valid move
*/
function web_processMoveFunc(moveID, info) {
    console.log('processing: ', moveID, info);

    // process game creation moves
    if (web_gameID && info.action == 'create') {
        // check that the self user is part of the game
        if (info.playerIDs.indexOf(self_playerID) == -1) {
            /* TODO -- graphical action for this */
            console.log("ERROR: player not included in game");
            return;
        }

        // record the list of players
        game_playerIDs = info.playerIDs;
        game_playerNames = info.playerNames;
        game_aiPlayers = [];

        // change to the game screen and setup the specific game
        page_setScreen('game');
        game_catalog[info.game].setupFunc(moveID, info);
    }
}

/* web_setupMoveListener
    add a database listener to wait for and process moves from other players
*/
function web_setupMoveListener() {
    if (web_gameID) {
        // set the web game handlers for processing moves
        moveProcessingFunction = web_processMoveFunc;
        movePostFunction = web_postMoveFunc;
        aiProcessingFunction = null;

        // add the database listener
        var moves = database.ref('games/' + web_gameID + '/gamePlay');
        moves.on('child_added', function(moveSnapshot) {
            var moveID = moveSnapshot.key;
            var moveInfo = moveSnapshot.val();

            console.log('move receieved:');
            console.log('\tmoveID: ', moveID);
            console.log('\tmoveInfo: ', moveInfo);

            // pass the move info onto the game logic
            receiveMove(moveID, moveInfo);
        });
    }
}

/* web_exitGame
    exit a web game, cleaning up resources
*/
function web_exitGame() {
    // if the player is the game owner, take care to clearing the gamePlay
    if (web_amOwner) {
        var moveRef = database.ref('games/' + web_gameID + '/gamePlay');
        moveRef.remove().then(function() {
            page_setScreen('webOwner');
        });
    }
    else {
        page_setScreen('webWait');
    }
}

/* web_exitAll
    clean up all the resources associated with a web game
*/
function web_exitAll() {
    // disable the database listerner
    var moveRef = database.ref('games/' + web_gameID + '/gamePlay');
    moveRef.off();
    console.log('trying...');

    // remove resources based on whether you're the owner or another player
    if (web_amOwner) {
        // clean up the gameCode entry, the games entry, and finally the gameLog
        // entry
        // TODO -- still go back to welcome screen if operaiton is successful
        // TODO -- add catch csaes to remaining database calls
        console.log('trying2...');
        database.ref('gameCodes/' + web_gameCode).remove().then(function() {
            console.log('trying3...');
            database.ref('games/' + web_gameID).remove().then(function() {
                database.ref('gameLog/' + web_gameID).remove().then(function() {
                    // clear global game parameters and return to the welcome
                    // screen
                    web_gameID = null;
                    web_playerID = null;
                    self_playerID = null;
                    web_gameCode = null;
                    web_amOwner = false;
                    game_type = null;
                    page_setScreen('welcome');
                    game_exitWait = false;
                });
            });
        }).catch(function() {
            console.log("it failed...");
        });
    }
    else {
        // remove self from the player list
        var playerRef = database.ref('games/' + web_gameID + '/players/' + web_playerID);
        playerRef.remove().then(function() {
            // clear global game parameters and return to the welcome screen
            web_gameID = null;
            web_playerID = null;
            self_playerID = null;
            web_gameCode = null;
            web_amOwner = false;
            game_type = null;
            page_setScreen('welcome');
            game_exitWait = false;
        });
    }
}

/* web_buildGame
    initialize a web game -- only call if the web_amOwner is true

    gameName: string of the game's name
*/
function web_buildGame(gameName) {
    if (web_gameID) {
        // get the player list form the database
        var ref = database.ref('games/' + web_gameID + '/players');
        ref.once('value').then( function(dataSnapshot) {

            var playerData = dataSnapshot.val();
            var playerIDs = Object.keys(playerData);
            var playerNames = {};

            // convert the list of player names into a dictionary mapping
            // player IDs to names
            for (var i = 0; i < playerIDs.length; i++) {
                playerNames[playerIDs[i]] = playerData[playerIDs[i]].name;
            }

            // setup global game player parameters
            game_playerIDs = playerIDs;
            game_playerNames = playerNames;
            game_aiPlayers = [];

            console.log(game_playerIDs);
            console.log(game_playerNames);

            // add the web move listener
            web_setupMoveListener();

            // call the specified game's start function
            game_catalog[gameName].startFunc();
        });
    }
}

/* web_joinGame
    join a game if NOT the game owner

    gameCode: the 6 digit game code
    name: self player nick name
    callbackFunc: function to call if the operation is successful
    errorCallback: function to call if the operation fails
*/
function web_joinGame(gameCode, name, callbackFunc, errorCallback) {
    // add self as an authenticated user first
    web_addAuthUser(function() {
        // get the game from the gameCodes list
        var gameRef = database.ref('gameCodes/' + gameCode);
        gameRef.once('value').then(function(snapshot) {
            if (!snapshot.exists()) {
                console.log("ERROR: game doesn't exist");
                /* TODO -- graphical action game not found */
                if (errorCallback) {
                    errorCallback();
                }
                return;
            }

            // extract the gameID
            var gameID = snapshot.val().id;

            // add self to the list of players and get the player ID
            var playerID = firebase.auth().currentUser.uid;
            var playerRef = database.ref('games/' + gameID + '/players/' + playerID);

            // set player nickname in the database
            playerRef.update({
                name : name
            }, function (error) {
                // check if the operation succeeded
                if (error) {
                    // clear global game variables
                    web_gameID = null;
                    web_playerID = null;
                    self_playerID = null;
                    web_gameCode = null;

                    if (errorCallback) {
                        errorCallback();
                    }
                }
                else {
                    // record the web game global variables
                    web_gameID = gameID;
                    web_playerID = playerID;
                    self_playerID = playerID;
                    web_gameCode = gameCode;

                    console.log('Joined game with gameID=', gameID, ', playerID=', playerID);

                    // add the move listener
                    web_setupMoveListener();

                    if (callbackFunc) {
                        callbackFunc();
                    }
                }
            });
        });
    }, function() {
        if (errorCallback) {
            errorCallback();
        }
    });
}


// Add Firebase project configuration object here
// Your web app's Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
console.log(database);

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

var web_playerID = null;
var web_gameID = null;
var web_gameCode = null;
var web_amOwner = false;

function web_addAuthUser(callbackFunc, errorCallback) {
    var userInfo = firebase.auth().currentUser;
    if (
        !userInfo ||
        Date.parse(userInfo.metadata.lastSignInTime) < Date.now() - 6 * 86400 * 1000
    ) {
        if (userInfo) {
            firebase.auth().signOut();
        }
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

function web_generateGameCode(gameID, callbackFunc, errorCallback) {
    var gameCode = String(Math.floor(Math.random() * 999999));
    for (var i = gameCode.lenth; i < 6; i++) {
        gameCode = '0' + gameCode;
    }
    
    var ref = database.ref('gameCodes/' + gameCode);
    ref.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            web_generateGameCode(gameID, callbackFunc, errorCallback);
        }
        else {  
            console.log('try game ID', gameID);
            database.ref('gameLog/' + gameID).update({
                code : gameCode
            }, function(error) {
                console.log('put game ID', gameID);
                if (error) {
                    if (errorCallback) {
                        errorCallback();
                    }
                    return;
                }
                
                ref.update({
                    id : gameID,
                }, function(error) {
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

function web_createGameGroup(ownerName, callbackFunc, errorCallback) {
    web_addAuthUser(function() {

    var gameRef = database.ref('games').push();
    var gameID = gameRef.key;

    database.ref('gameLog/' + gameID).update({
        owner : firebase.auth().currentUser.uid
    }, function(error) {
        if (error) {
            web_gameID = null;

            if (errorCallback) {
                errorCallback();
            }

            return;
        }
        else {
            var initialGameData = {
                lastModification : firebase.database.ServerValue.TIMESTAMP
            };
        
            gameRef.update(initialGameData, function(error) {
                if (error) {
                    web_gameID = null;
        
                    if (errorCallback) {
                        errorCallback();
                    }
        
                    return;
                }
                else {
                    web_gameID = gameID;
        
                    //var playerRef = gameRef.child('players').push();
                    //var playerID = playerRef.key;
                    var playerID = firebase.auth().currentUser.uid;
                    var playerRef = database.ref('games/' + gameID + '/players/' + playerID);
        
                    playerRef.update({
                        name : ownerName,
                    }, function (error) {
                        if (error) {
                            web_gameID = null;
                            web_playerID = null;
                            self_playerID = null;
        
                            if (errorCallback) {
                                errorCallback();
                            }
                        }
                        else {
                            web_gameID = gameID;
                            web_playerID = playerID;
                            self_playerID = playerID;
        
                            console.log('Game created with gameID=', gameID, ', playerID=', playerID);
        
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

function web_postMoveFunc(info) {
    console.log(info);
    if (web_gameID) {
        var move = database.ref('games/' + web_gameID + '/gamePlay').push();
        move.set(info);
        var timestampRef = database.ref('games/' + web_gameID);
        timestampRef.update({
            lastModification : firebase.database.ServerValue.TIMESTAMP
        });
    }
}

function web_processMoveFunc(moveID, info) {
    console.log('processing: ', moveID, info);
    if (web_gameID && info.action == 'create') {
        if (info.playerIDs.indexOf(self_playerID) == -1) {
            /* TODO -- graphical action for this */
            console.log("ERROR: player not included in game");
            return;
        }

        /* TODO -- graphical action -- reveal game screen */

        game_playerIDs = info.playerIDs;
        game_playerNames = info.playerNames;
        game_aiPlayers = [];

        page_setScreen('game');
        game_catalog[info.game].setupFunc(moveID, info);
    }
}

function web_setupMoveListener() {
    if (web_gameID) {
        moveProcessingFunction = web_processMoveFunc;
        movePostFunction = web_postMoveFunc;
        aiProcessingFunction = null;

        var moves = database.ref('games/' + web_gameID + '/gamePlay');
        moves.on('child_added', function(moveSnapshot) {
            var moveID = moveSnapshot.key;
            var moveInfo = moveSnapshot.val();

            console.log('move receieved:');
            console.log('\tmoveID: ', moveID);
            console.log('\tmoveInfo: ', moveInfo);

            receiveMove(moveID, moveInfo);
        });
    }
}

function web_exitGame() {
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

function web_exitAll() {
    var moveRef = database.ref('games/' + web_gameID + '/gamePlay');
    moveRef.off();
    console.log('trying...');
    if (web_amOwner) {
        console.log('trying2...');
        database.ref('gameCodes/' + web_gameCode).remove().then(function() {
            console.log('trying3...');
            database.ref('games/' + web_gameID).remove().then(function() {
                database.ref('gameLog/' + web_gameID).remove().then(function() {
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
        var playerRef = database.ref('games/' + web_gameID + '/players/' + web_playerID);
        playerRef.remove().then(function() {
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

function web_buildGame(gameName) {
    if (web_gameID) {
        var ref = database.ref('games/' + web_gameID + '/players');
        ref.once('value').then( function(dataSnapshot) {
            var playerData = dataSnapshot.val();
            var playerIDs = Object.keys(playerData);
            var playerNames = {};

            for (var i = 0; i < playerIDs.length; i++) {
                playerNames[playerIDs[i]] = playerData[playerIDs[i]].name;
            }

            game_playerIDs = playerIDs;
            game_playerNames = playerNames;
            game_aiPlayers = [];

            console.log(game_playerIDs);
            console.log(game_playerNames);

            web_setupMoveListener();

            game_catalog[gameName].startFunc();
        });
    }
}

function web_joinGame(gameCode, name, callbackFunc, errorCallback) {
    web_addAuthUser(function() {
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

            var gameID = snapshot.val().id;

            //var playerRef = database.ref('games/' + gameID + '/players').push();
            //var playerID = playerRef.key;
            var playerID = firebase.auth().currentUser.uid;
            var playerRef = database.ref('games/' + gameID + '/players/' + playerID);

            playerRef.update({
                name : name
            }, function (error) {
                if (error) {
                    web_gameID = null;
                    web_playerID = null;
                    self_playerID = null;
                    web_gameCode = null;

                    if (errorCallback) {
                        errorCallback();
                    }
                }
                else {
                    web_gameID = gameID;
                    web_playerID = playerID;
                    self_playerID = playerID;
                    web_gameCode = gameCode;

                    console.log('Joined game with gameID=', gameID, ', playerID=', playerID);

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
//web_createGame('myName');

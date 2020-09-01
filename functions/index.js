const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.cleanup = functions.https.onRequest((req, res) => {

    var authcode = req.query.ac;
    if (authcode != /* PUT YOUR AUTHCODE HERE AND PASS IT AS THE 'ac' GET VARIABLE WHEN CALLING THIS ENDPOINT */) {
        res.send('Error: incorrect authcode');
        return;
    }
    
    admin.database().ref('/gameLog').once('value').then(function(snapshot) {

        var gameData = snapshot.val();
        if (!gameData) {
            return;
        }
        
        var gameIDs = Object.keys(gameData);
        var N = gameIDs.length;
        for (var i = 0; i < N; i++) {
            var gameID_ext = gameIDs[i];

            (function(gameID) {
                var gameRef = admin.database().ref('games/' + gameID);
                var codeRef = null;
                if (gameData[gameID].code) {
                    codeRef = admin.database().ref('gameCodes/' + gameData[gameID].code);
                }
                var logRef = admin.database().ref('gameLog/' + gameID);

                gameRef.child('lastModification').once('value').then(function(snapshot) {
                    var tStamp = snapshot.val();
                    if (
                        tStamp && tStamp > Date.now() - 10000000
                    ) {
                        return;
                    }
                    gameRef.remove((error) => {
                        if (codeRef) {
                            codeRef.remove((error) => {
                                logRef.remove();
                            })
                        }
                        else {
                            logRef.remove();
                        }
                    });
                });
            })(gameID_ext);
        }
    });
    res.send('Test if this worked!');
});

exports.cleanup_users = functions.https.onRequest((req, res) => {
    var authcode = req.query.ac;
    if (authcode != /* PUT YOUR AUTHCODE HERE AND PASS IT AS THE 'ac' GET VARIABLE WHEN CALLING THIS ENDPOINT */) {
        res.send('Error: incorrect authcode');
        return;
    }

    var listAllUsers = function(nextPageToken) {
        // List batch of users, 1000 at a time.
        admin.auth().listUsers(1000, nextPageToken).then(
            function(listUsersResult) {
                listUsersResult.users.forEach(function(userRecord) {

                var timeStamp = Date.parse(userRecord.metadata.lastSignInTime);
                if (timeStamp < Date.now() - 7 * 86400 * 1000) {
                    admin.auth().deleteUser(userRecord.uid);
                }
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken);
            }
        })
        .catch(function(error) {
            console.log('Error listing users:', error);
        });
    };
    // Start listing users from the beginning, 1000 at a time.
    listAllUsers();
  
    res.send('Listing users in console...');
});

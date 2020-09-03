/* moves.js
    provide an abstraction layer between the backend that communicates move data
    and the game runtime that processes them; it provides an interface that
    allows the game logic to post and receive moves, and it exposes handlers for
    the backend to communicate that information
*/

/* the number of moves that have been processed */
var moveQueueProcessed = 0;
/* the number of moves that have been added */
var moveQueueAdded = 0;

/* handler provided by the current game type for posting a move */
var movePostFunction = null
/* handler provided by the current game type for processing a move */
var moveProcessingFunction = null;

/* hook for AI players whenever a move is processed */
var aiProcessingFunction = null;

/* postMove
    add a move to the move queue

    info: a dictionary describing a valid move
*/
function postMove(info) {
    if (movePostFunction) {
        movePostFunction(info);
    }
    // local post type:
    //receiveMove(String(localMoveIndex++), info);
}

/* receiveMode
    the callback function for whenever a game backend receieves a move
*/
function receiveMove(id, info) {
    // get the next move index, then increment the move counter
    var moveNumber = moveQueueAdded++;

    // process the move
    processMoveQueue(moveNumber, id, info);
}

/* processMoveQueue
    call the appropriate handlers/hooks for a newly receieved move

    moveNumber: a sequential index for the move
    id: a unique id for the move
    info: a dictionary describing the move's parameters
*/
async function processMoveQueue(moveNumber, id, info) {
    // wait until previous moves in the queue have been processed
    while (moveQueueProcessed != moveNumber) {
        // Do nothing -- wait
    }

    // call the move processing handler
    if (moveProcessingFunction) {
        moveProcessingFunction(id, info);
    }

    // call the ai player hook for each ai player in the game
    if (aiProcessingFunction) {
        for (var i = 0; i < game_aiPlayers.length; i++) {
            aiProcessingFunction(game_aiPlayers[i]);
        }
    }

    // record that the move is finished being processed
    moveQueueProcessed++;
}

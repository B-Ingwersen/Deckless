

var moveQueueProcessed = 0;
var moveQueueAdded = 0;

var movePostFunction = null
function postMove(info) {
    if (movePostFunction) {
        movePostFunction(info);
    }
    // local post type:
    //receiveMove(String(localMoveIndex++), info);
}

function receiveMove(id, info) {
    var moveNumber = moveQueueAdded++;
    processMoveQueue(moveNumber, id, info);
}

var moveProcessingFunction = null;
var aiProcessingFunction = null;
async function processMoveQueue(moveNumber, id, info) {
    while (moveQueueProcessed != moveNumber) {
        // Do nothing -- wait
    }

    if (moveProcessingFunction) {
        moveProcessingFunction(id, info);
    }

    // local -- run ai players
    if (aiProcessingFunction) {
        for (var i = 0; i < game_aiPlayers.length; i++) {
            aiProcessingFunction(game_aiPlayers[i]);
        }
    }

    moveQueueProcessed++;
}

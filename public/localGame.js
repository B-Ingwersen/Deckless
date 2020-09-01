

var localMoveIndex = 0; 
function localMovePostFunc(info) {
    receiveMove(String(localMoveIndex++), info);
}

function localMoveProcessingFunc(moveID, info) {
    if (info.action == 'create') {
        page_setScreen('game');
        game_catalog[info.game].setupFunc(moveID, info);
    }
}

function buildLocalGame(game, nPlayers) {
    console.log(nPlayers);
    if (nPlayers) {
        self_playerID = '0';
        game_playerIDs = ['0'];
        game_aiPlayers = [];
        game_playerNames = {
            '0' : 'You'
        };
        for (var i = 1; i < nPlayers; i++) {
            var id = String(i);
            game_playerIDs.push(id);
            game_aiPlayers.push(id);
            game_playerNames[id] = 'Computer Player ' + id;
        }

        movePostFunction = localMovePostFunc;
        moveProcessingFunction = localMoveProcessingFunc;

        game_catalog[game].startFunc();
    }
}
/* ratscrew.js
    implement the ratscrew card game functions
*/

/* ratscrew_currentPlayerIndex
    return the index of the current player
*/
function ratscrew_currentPlayerIndex() {
    return game.getCurrentState().globalStates.currentPlayer;
}

/* ratscrew_getPlayerByindex
    get a players's name based on its player index
*/
function ratscrew_getPlayerByIndex(index) {
    return game.players[index];
}

/* ratscrew_currentPlayer
    return the current player's name
*/
function ratscrew_currentPlayer() {
    return ratscrew_getPlayerByIndex(
        ratscrew_currentPlayerIndex()
    );
}

/* ratscrew_getNextPlayer
    get the index of the next player; return null if there is only one player
    left in the game

    state: the current game state

    return the player index or null
*/
function ratscrew_getNextPlayer(state) {
    var nextPlayerIndex = ratscrew_currentPlayerIndex();

    // iterate the player index until you find a valid player, or you get back
    // to the same player
    while (true) {
        nextPlayerIndex = (nextPlayerIndex + 1) % game.players.length;

        // if the player still has cards in their hand, then they should play
        // next
        var nextPlayer = ratscrew_getPlayerByIndex(nextPlayerIndex);
        var nextPlayerStack = state.getGroupAndStack(nextPlayer, 'hand');
        if (nextPlayerStack.cards.length > 0) {
            return nextPlayerIndex;
        }

        if (nextPlayerIndex == ratscrew_currentPlayerIndex()) {
            return null;
        }
    }
}

/* ratscrew_changeCurrentPlayer
    set a new current player, updating both the game state and the UI

    newState: the new state object being formed
    newPlayer: the player to set as the new current player
*/
function ratscrew_changeCurrentPlayer(newState, newPlayer) {
    var oldPlayer = game.players[newState.globalStates.currentPlayer];

    // update the visual card stacks
    var oldStack = newState.getGroupAndStack(oldPlayer, 'hand');
    var newStack = newState.getGroupAndStack(newPlayer, 'hand');
    oldStack.display.setBackground(null);
    newStack.display.setBackground('#99ff33');

    // update the game state
    newState.globalStates.currentPlayer = game.players.indexOf(newPlayer);
}

/* ratscrew_advancePlayer
    advance the current player of the game, updating both the game state
    and the UI

    playerStack: the current player's stack
    newState: the new state to modify
*/
function ratscrew_advancePlayer(playerStack, newState) {
    // unhighlight the current players stack
    playerStack.display.setBackground(null);

    // get the next player
    var nextPlayerIndex = ratscrew_getNextPlayer(newState);

    // update the game state to reflect the new player
    newState.globalStates.currentPlayer = nextPlayerIndex;

    // if there is a next player, highlight their card stack
    if (nextPlayerIndex != null) {
        var nextPlayer = game.players[nextPlayerIndex];
        var nextPlayerStack = newState.stackGroups[nextPlayer].stacks.hand;
        nextPlayerStack.display.setBackground('#99ff33');
    }
}

/* ratscrew_checkTopBottomPair
    check for a top botton pair in a stack of cards (card at the top and bottom
    of the deck with the same face value)

    cards: an array of Card objects

    return a boolean
*/
function ratscrew_checkTopBottomPair(cards) {
    // cannot have a pair in less than two cards
    if (cards.length < 2) {
        return false;
    }

    //get the top and bottom card and check if they're equivalent
    var topCard = cards_getNum(cards[cards.length - 1].value);
    var bottomCard = cards_getNum(cards[0].value);
    if (topCard == bottomCard) {
        return true;
    }
    return false;
}

/* ratscrew_checkPair
    check for a pair (top two cards have the same face value) in ta stack of
    cards

    cards: an array of Card objects

    return a boolean
*/
function ratscrew_checkPair(cards) {
    // cannot have a pair in less than two cards
    if (cards.length < 2) {
        return false;
    }

    // get the top two cards and compare their value
    var topCard = cards_getNum(cards[cards.length - 1].value);
    var bottomCard = cards_getNum(cards[cards.length - 2].value);
    if (topCard == bottomCard) {
        return true;
    }
    return false;
}

/* ratscrew_checkSandwich
    check for a sandwich (top card and card two below it are the same face 
    value in a deck of cards)

    cards: an array of Card objects

    return a boolean
*/
function ratscrew_checkSandwich(cards) {
    // cannot have a sandwich with less than 3 cards
    if (cards.length < 3) {
        return false;
    }

    // get the two cards and compare their value
    var topCard = cards_getNum(cards[cards.length - 1].value);
    var bottomCard = cards_getNum(cards[cards.length - 3].value);
    if (topCard == bottomCard) {
        return true;
    }
    return false;
}

/* ratscrew_checkPatterns
    check for a slap-able pattern in a deck of cards

    cards: an array of Card objects

    return a string with the name of the pattern, or null if no pattern is found
*/
function ratscrew_checkPatterns(cards) {
    if (ratscrew_checkPair(cards)) {
        return "Pair";
    }
    if (ratscrew_checkSandwich(cards)) {
        return "Sandwich";
    }
    if (ratscrew_checkTopBottomPair(cards)) {
        return "Top Bottom Pair";
    }
    return null;
}

function ratscrew_checkWinner() {
    var winnerPlayer = null;
    for (var i = 0; i < game.players.length; i++) {
        var player = game.players[i];

        if (game.getCurrentState().getGroupAndStack(player, 'hand').cards.length > 0) {
            if (winnerPlayer) {
                return;
            }
            else {
                winnerPlayer = player;
            }
        }
    }

    var centerStack = game.getCurrentState().stackGroups.centerPile.stacks.stack;
    if (ratscrew_checkPatterns(centerStack.cards)) {
        return;
    }

    if (
        game.getCurrentState().globalStates.faceCardState && 
        game.getCurrentState().globalStates.faceCardBeneficiary != winnerPlayer &&
        game.getCurrentState().globalStates.faceCardsToPlay == 0
    ) {
        return;
    }

    game_handleWinner(winnerPlayer);
}

function ratscrew_ProcessMove(moveId, info) {
    if (info.action == "create") {
        // build the initial game state
        game = new GameObject(info.playerIDs);
        var state = new GameState(null);
        state.createStackGroups(info.playerIDs, ["hand"]);
        state.createStackGroup("centerPile", ["stack"]);
        game.addState(moveId, info, state);
        cards_create52CardDeck();
    }

    if (info.action == "start") {
        var newState = game.newState(moveId, info);

        var displays = game.drawManager.createCircularStacks(
            game.players.length,
            game.players.indexOf(self_playerID)
        );

        for (var i = 0; i < game.players.length; i++) {
            var playerID = game.players[i];
            var hand = game.getCurrentState().getGroupAndStack(playerID, 'hand');
            hand.addDisplay(displays[i]);
            hand.display.text = game_playerNames[playerID];

            if (i == 0) {
                hand.display.setBackground('#99ff33');
            }

            if (playerID == self_playerID) {
                hand.setHoverActive();
                hand.display._mouseClickFunc = ratscrew_userClickFunc;
                hand.display.displayText = true;
            }
            else {
                hand.setHoverHighlight();
            }

            hand.addCards(info.players[i].initialCards, "down");
        }

        var centerStack = game.getCurrentState().getGroupAndStack('centerPile', 'stack');
        centerStack.addDisplay(game.drawManager.createCenterStack());
        centerStack.display._mouseClickFunc = ratscrew_userSlapFunc;
        centerStack.setHoverHighlight();
        centerStack.display.text = 'Click to Slap';

        game.getCurrentState().addStateVariable('currentPlayer', 0);

        game.getCurrentState().addStateVariable('faceCardState', false);
        game.getCurrentState().addStateVariable('faceCardsToPlay', null);
        game.getCurrentState().addStateVariable('faceCardBeneficiary', null);

        game.drawManager.draw();
        requestAnimationFrame(animationFunction);
    }

    if (info.action == "move") {
        if (!game.verifyState(info.previousMoveID)) {
            return;
        }

        var newState = new GameState(game.getCurrentState());

        var currentPlayer = ratscrew_currentPlayer();
        if (info.player != currentPlayer) {
            return;
        }

        if (
            newState.globalStates.faceCardState &&
            newState.globalStates.faceCardsToPlay <= 0
        ) {
            return;
        }

        var playerStack = newState.stackGroups[info.player].stacks.hand;
        var centerStack = newState.stackGroups.centerPile.stacks.stack;

        if (!playerStack.sendCard(info.card, centerStack, 'top', 'up')) {
            return;
        }

        if (cards_getNumAceHigh(info.card) > 10) {
            newState.globalStates.faceCardState = true;
            newState.globalStates.faceCardsToPlay = cards_getNumAceHigh(info.card) - 10;
            newState.globalStates.faceCardBeneficiary = info.player;
            ratscrew_advancePlayer(playerStack, newState);
        }
        else if (newState.globalStates.faceCardState) {
            newState.globalStates.faceCardsToPlay--;
            /* TODO -- handle when stack if empty */
            if (playerStack.cards.length == 0) {
                ratscrew_advancePlayer(playerStack, newState);
            }
        }
        else {
            ratscrew_advancePlayer(playerStack, newState);
        }

        game.addState(moveId, info, newState);

        ratscrew_checkWinner();
    }

    if (info.action == "slap") {
        if (!game.verifyState(info.previousMoveID)) {
            return;
        }

        var newState = new GameState(game.getCurrentState());

        var playerStack = newState.stackGroups[info.player].stacks.hand;
        var centerStack = newState.stackGroups.centerPile.stacks.stack;

        var pattern = ratscrew_checkPatterns(centerStack.cards);
        if (!(
            newState.globalStates.faceCardState &&
            info.player == newState.globalStates.faceCardBeneficiary &&
            newState.globalStates.faceCardsToPlay == 0
        ) && !pattern) {
            game_tempTitleText(game_playerNames[info.player] + ": Bad Slap", 'red');
            return;
        }

        if (pattern) {
            game_tempTitleText(game_playerNames[info.player] + ": " + pattern, '#000080');
        }
        else {
            game_tempTitleText(game_playerNames[info.player] + ": Face Cards", '#000080');
        }

        newState.globalStates.faceCardState = false;
        ratscrew_changeCurrentPlayer(newState, info.player);

        centerStack.sendAll(playerStack, 'bottom', 'down');
        game.addState(moveId, info, newState);

        ratscrew_checkWinner();
    }
}

function ratscrew_userClickFunc(stack) {
    if (!game) {
        return;
    }
    var currentPlayerIndex = game.getCurrentState().globalStates.currentPlayer;
    var currentPlayer = game.players[currentPlayerIndex];

    if (currentPlayer != self_playerID) {
        return;
    }

    var currentPlayerStack = game.getCurrentState().stackGroups[self_playerID].stacks.hand;
    var card = currentPlayerStack.getTopCard().value;

    var moveInfo = {
        previousMoveID : game.getCurrentID(),
        action : "move",
        player : currentPlayer,
        card : card
    };

    postMove(moveInfo);
}

function ratscrew_userSlapFunc(stack) {
    console.log("i worked!");

    var moveInfo = {
        previousMoveID : game.getCurrentID(),
        action : "slap",
        player : self_playerID
    };

    postMove(moveInfo);
}

function ratscrew_aiFunction(playerID) {
    if (!game) {
        return;
    }
    var currentPlayerIndex = game.getCurrentState().globalStates.currentPlayer;
    var currentPlayer = game.players[currentPlayerIndex];
    var previousMoveID = game.getCurrentID();

    if (currentPlayer == playerID) {
        var currentPlayerStack = game.getCurrentState().stackGroups[playerID].stacks.hand;
        var card = currentPlayerStack.getTopCard().value;

        setTimeout(function(){
            postMove({
                previousMoveID : previousMoveID,
                action : "move",
                player : playerID,
                card : card
            });
        }, 1500);
    }
    else if (
        game.getCurrentState().globalStates.faceCardState &&
        playerID == game.getCurrentState().globalStates.faceCardBeneficiary &&
        game.getCurrentState().globalStates.faceCardsToPlay == 0
    ) {
        setTimeout(function(){
            postMove({
                previousMoveID : previousMoveID,
                action : "slap",
                player : playerID,
            });
        }, 1000);
    }
    else if (ratscrew_checkPatterns(
        game.getCurrentState().getGroupAndStack('centerPile', 'stack').cards
    )) {
        if (Math.random() < 1.0 / 3.0) {
            setTimeout(function(){
                postMove({
                    previousMoveID : previousMoveID,
                    action : "slap",
                    player : playerID,
                });
            }, Math.round(Math.random() * 1000 + 600));
        }
    }
}

function ratscrew_setupGame(moveID, info) {
    moveProcessingFunction = ratscrew_ProcessMove;
    aiProcessingFunction = ratscrew_aiFunction;

    moveProcessingFunction(moveID, info);
}

function ratscrew_startGame() {
    console.log('tried to start');

    postMove({
        action : "create",
        game : "ratscrew",
        playerIDs : game_playerIDs,
        playerNames : game_playerNames,
        player : self_playerID
    });

    postMove({
        action : "start",
        players : cards_initialShuffleAll(game_playerIDs),
        player : self_playerID
    });
}
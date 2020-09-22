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

/* ratscrew_checkWinner
    check if somebody has won the game; if yes, run the winner handling code;
    otherwise, do nothing
*/
function ratscrew_checkWinner() {

    // iterate through each player checking for winners
    var winnerPlayer = null;
    for (var i = 0; i < game.players.length; i++) {
        var player = game.players[i];

        // if a player has a non empty deck, they are a potential winner; if
        // multiple players have non empty decks though, there is not a winner
        // yet
        if (game.getCurrentState().getGroupAndStack(player, 'hand').cards.length > 0) {
            if (winnerPlayer) {
                return;
            }
            else {
                winnerPlayer = player;
            }
        }
    }

    // if the center stack could be slapped right now, then the game is not
    // actually over yet
    var centerStack = game.getCurrentState().stackGroups.centerPile.stacks.stack;
    if (ratscrew_checkPatterns(centerStack.cards)) {
        return;
    }

    // If there is a non-winner player who can slap the pile because of face
    // cards, then there is not winner yet
    if (
        game.getCurrentState().globalStates.faceCardState && 
        game.getCurrentState().globalStates.faceCardBeneficiary != winnerPlayer &&
        game.getCurrentState().globalStates.faceCardsToPlay == 0
    ) {
        return;
    }

    // actually process the game win
    game_handleWinner(winnerPlayer);
}

/* ratscrew_ProcessMove
    move processing hander for ratscrew

    moveId: a unique string assigned to the move
    info: a dictionary of move info; at minimum should have an 'action' key
    to designate what type of move it is
*/
function ratscrew_ProcessMove(moveId, info) {
    // create a new game
    if (info.action == "create") {
        // build the initial game state
        game = new GameObject(info.playerIDs);
        var state = new GameState(null);

        // set the card stacks
        state.createStackGroups(info.playerIDs, ["hand"]);
        state.createStackGroup("centerPile", ["stack"]);

        // generate the cards and add the create move
        game.addState(moveId, info, state);
        cards_create52CardDeck();
    }

    // start an already created game
    if (info.action == "start") {
        // new state to save for after the game
        var newState = game.newState(moveId, info);

        // setup the visual stacks for each player
        var displays = game.drawManager.createCircularStacks(
            game.players.length,
            game.players.indexOf(self_playerID)
        );
        for (var i = 0; i < game.players.length; i++) {

            // attatch the corresponding visual display to each card stack
            var playerID = game.players[i];
            var hand = game.getCurrentState().getGroupAndStack(playerID, 'hand');
            hand.addDisplay(displays[i]);
            hand.display.text = game_playerNames[playerID];

            // set the initial visual states of each stack
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

            // ard cards to each stack in face down orientation
            hand.addCards(info.players[i].initialCards, "down");
        }

        // setup the visual state of the cetner stack
        var centerStack = game.getCurrentState().getGroupAndStack('centerPile', 'stack');
        centerStack.addDisplay(game.drawManager.createCenterStack());
        centerStack.display._mouseClickFunc = ratscrew_userSlapFunc;
        centerStack.setHoverHighlight();
        centerStack.display.text = 'Click to Slap';

        // add the global state variables
        game.getCurrentState().addStateVariable('currentPlayer', 0);
        game.getCurrentState().addStateVariable('faceCardState', false);
        game.getCurrentState().addStateVariable('faceCardsToPlay', null);
        game.getCurrentState().addStateVariable('faceCardBeneficiary', null);

        // start animating the screen
        game.drawManager.draw();
        requestAnimationFrame(animationFunction);
    }

    // process a move
    if (info.action == "move") {
        // if the state cannot be verified, skip it
        if (!game.verifyState(info.previousMoveID)) {
            return;
        }

        // new game state to build
        var newState = new GameState(game.getCurrentState());

        // if the somebody other than the current player moved, reject it
        var currentPlayer = ratscrew_currentPlayer();
        if (info.player != currentPlayer) {
            return;
        }

        // if the game is in the face cards state, reject the move
        if (
            newState.globalStates.faceCardState &&
            newState.globalStates.faceCardsToPlay <= 0
        ) {
            return;
        }

        // get the stacks
        var playerStack = newState.stackGroups[info.player].stacks.hand;
        var centerStack = newState.stackGroups.centerPile.stacks.stack;

        // if sending a card to the center stack fails, ignore the move
        if (!playerStack.sendCard(info.card, centerStack, 'top', 'up')) {
            return;
        }

        // set the face card state if a face card was playerd
        if (cards_getNumAceHigh(info.card) > 10) {
            newState.globalStates.faceCardState = true;
            newState.globalStates.faceCardsToPlay = cards_getNumAceHigh(info.card) - 10;
            newState.globalStates.faceCardBeneficiary = info.player;
            ratscrew_advancePlayer(playerStack, newState);
        }
        // if in the face card state, update the place in the the state after
        // the play
        else if (newState.globalStates.faceCardState) {
            newState.globalStates.faceCardsToPlay--;
            if (playerStack.cards.length == 0) {
                ratscrew_advancePlayer(playerStack, newState);
            }
        }
        // otherwise it is a normal play
        else {
            ratscrew_advancePlayer(playerStack, newState);
        }

        // add the state and see if somebody won
        game.addState(moveId, info, newState);
        ratscrew_checkWinner();
    }

    // handle a player slapping the deck
    if (info.action == "slap") {
        // ignore the move if it cannot be verified
        if (!game.verifyState(info.previousMoveID)) {
            return;
        }

        // create a new state
        var newState = new GameState(game.getCurrentState());

        // get the stacks
        var playerStack = newState.stackGroups[info.player].stacks.hand;
        var centerStack = newState.stackGroups.centerPile.stacks.stack;

        // check if there was a slappable pattern & state; if not, exit
        var pattern = ratscrew_checkPatterns(centerStack.cards);
        if (!(
            newState.globalStates.faceCardState &&
            info.player == newState.globalStates.faceCardBeneficiary &&
            newState.globalStates.faceCardsToPlay == 0
        ) && !pattern) {
            game_tempTitleText(game_playerNames[info.player] + ": Bad Slap", 'red');
            return;
        }

        // display whether it was valid based on face cards or a card pattern
        if (pattern) {
            game_tempTitleText(game_playerNames[info.player] + ": " + pattern, '#000080');
        }
        else {
            game_tempTitleText(game_playerNames[info.player] + ": Face Cards", '#000080');
        }

        // exit the face card state after a slap
        newState.globalStates.faceCardState = false;
        ratscrew_changeCurrentPlayer(newState, info.player);

        // put all the cards face down at the bottom of the slapping player's
        // stack
        centerStack.sendAll(playerStack, 'bottom', 'down');
        game.addState(moveId, info, newState);

        // check if there was a winner
        ratscrew_checkWinner();
    }
}

/* ratscrew_userClickFunc
    mouse click handler for when the user presses their stack; used for the
    standard way of playing a card

    stack: the CardStack the user clicked on
*/
function ratscrew_userClickFunc(stack) {
    // ignore events when the game isn't active
    if (!game) {
        return;
    }

    // if it is not the user's turn, don't allow them to click
    var currentPlayerIndex = game.getCurrentState().globalStates.currentPlayer;
    var currentPlayer = game.players[currentPlayerIndex];
    if (currentPlayer != self_playerID) {
        return;
    }

    // get the card off the top of the player's stack
    var currentPlayerStack = game.getCurrentState().stackGroups[self_playerID].stacks.hand;
    var card = currentPlayerStack.getTopCard().value;

    // add a move
    var moveInfo = {
        previousMoveID : game.getCurrentID(),
        action : "move",
        player : currentPlayer,
        card : card
    };
    postMove(moveInfo);
}

/* ratscrew_userSlapFunc
    the mouse click function for the center stack; when the user presses it,
    it generates a slap event
*/
function ratscrew_userSlapFunc(stack) {
    // create and post the slap move
    var moveInfo = {
        previousMoveID : game.getCurrentID(),
        action : "slap",
        player : self_playerID
    };
    postMove(moveInfo);
}

/* ratscrew_aiFunction
    the move handler for computer players

    playerID: the player id string of the ai player
*/
function ratscrew_aiFunction(playerID) {
    // do nothing if there is no active game
    if (!game) {
        return;
    }

    // figure out who's move it is and what the last move was
    var currentPlayerIndex = game.getCurrentState().globalStates.currentPlayer;
    var currentPlayer = game.players[currentPlayerIndex];
    var previousMoveID = game.getCurrentID();

    // if it is the AI player's turn, make a move
    if (currentPlayer == playerID) {
        var currentPlayerStack = game.getCurrentState().stackGroups[playerID].stacks.hand;
        var card = currentPlayerStack.getTopCard().value;

        // wait 1.5 seconds before moving
        setTimeout(function(){
            postMove({
                previousMoveID : previousMoveID,
                action : "move",
                player : playerID,
                card : card
            });
        }, 1500);
    }

    // trigger a slap if it's the computer player's opportunity to claim face
    // cards
    else if (
        game.getCurrentState().globalStates.faceCardState &&
        playerID == game.getCurrentState().globalStates.faceCardBeneficiary &&
        game.getCurrentState().globalStates.faceCardsToPlay == 0
    ) {

        // wait 1 second before claiming
        setTimeout(function(){
            postMove({
                previousMoveID : previousMoveID,
                action : "slap",
                player : playerID,
            });
        }, 1000);
    }

    // if there is a slapable pattern, potentially slap it
    else if (ratscrew_checkPatterns(
        game.getCurrentState().getGroupAndStack('centerPile', 'stack').cards
    )) {
        // slap 1/3 of the time on slappable patterns
        if (Math.random() < 1.0 / 3.0) {

            // wait between 0.6 and 1.6 seconds to simulate the varying
            // reactions of a human player (note that a human player loses
            // a few tenths of a second because of the animation)
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

/* ratscrew_setupGame
    the game setup handler for a ratscrew game

    moveID: the string ID of the move
    info: the dictionary with the game set up information
*/
function ratscrew_setupGame(moveID, info) {
    // set the move handlers
    moveProcessingFunction = ratscrew_ProcessMove;
    aiProcessingFunction = ratscrew_aiFunction;

    // pass the move to the move handling function
    moveProcessingFunction(moveID, info);
}

/* ratscrew_startGame
    the game starting handler for ratscrew games
*/
function ratscrew_startGame() {
    // post the game create and the game start moves
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
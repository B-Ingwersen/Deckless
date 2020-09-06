/* state.js
    define the objects used to track the state of a card game and its history;
    this acts as a source of truth which the visual component of the game should
    match
*/


/* the GameObject instance that tracks the history and state of the current
game being played */
var game = null;

/* StackState
    describes a state of a stack of cards
*/
class StackState {
    
    /* constructor
        create a StackState as either empty or as a clone of another StackState

        template: an optional StackState parameter; if passed, the new object
        will be a clone of template, otherwise it will be built as empty
    */
    constructor(template) {
        // the array of cards in the stack (Card object)
        this.cards = [];

        // copy the template if it is not null
        if (template) {
            for (var i = 0; i < template.cards.length; i++) {
                var card = template.cards[i];
                this.cards.push(card);
            }

            // display: the CardStackobject used for visualizaing the stack
            this.display = template.display;
        }

        // otherwise leave the stack empty
        else {
            this.display = null;
        }
    }

    /* addCards
        add a list of cards to the stack

        cards: a list of card values
        orientation: either "up" or "down"
    */
    addCards(cards, orientation) {
        for (var i = 0; i < cards.length; i++) {
            // addd the corresponding Card object to the visual display
            var card = allCards[cards[i]];
            if (this.display) {
                this.display.addCard(card, "in-stack");
                card.setOrientation(orientation);
            }

            // add the card to the cards list
            this.cards.push(card);
        }
    }

    /* setCards
        set a stack to have exactly a list of cards

        cards: a list of card values
        orientation: either "up" or "down"
    */
    setCards(cards, orientation) {
        // clear the cards list, and then add the new cards
        this.cards = [];
        this.addCards(cards, orientation);
    }

    /* addDisplay
        add a dispaly object for visualizing the card stack

        display: a valid draw area element (ex a CardStack) for visualizing
        the StackState
    */
    addDisplay(display) {
        this.display = display;
    }

    /* getTopCard
        get the card at the top of the stack

        return a card value
    */
    getTopCard() {
        return this.cards[this.cards.length - 1];
    }

    /* getBottomCard
        get the card at the bottom of the stack

        return a card value
    */
    getBottomCard() {
        return this.cards[0];
    }

    /* sendCard
        send a card from one stack to another; the card will be removed from
        this stack and added to the other, and the move will be replected in
        the stack's display

        card: the value of the card to send; if the card is not found, the
        function exits
        stack: the destination StackState object
        destLoc: either "top" or "bottom" (where in the destination stack the
        card should be added)
        destOrient: either "up" or "down"; the orientation the card should have
        once it is added to the destination stack

        return a boolean of whether the operation was successful (it fails if
        card is not in the stack)
    */
    sendCard(card, stack, destLoc, destOrient) {
        // find the card's location in the stack, stroing in variable i
        // if it is nto found exit the function
        var i;
        for (i = 0; i < this.cards.length; i++) {
            if (this.cards[i].value == card) {
                break;
            }
        }
        if (i >= this.cards.length) {
            return false;
        }

        // remove the card from this stack
        var cardObj = this.cards[i];
        this.cards.splice(i,1);

        // add the card to the destination stack
        if (!destLoc || destLoc == 'top') {
            stack.cards.push(cardObj);
        }
        else if (destLoc == 'bottom') {
            stack.cards.splice(0, 0, cardObj);
        }

        // mirror the card move in the UI
        this.display.sendCard(card, stack.display, moveNormal, destLoc);

        // set the target orientation of the card in the destination stack
        if (destOrient == 'up') {
            cardObj.moveDestFlip = 0;
        }
        else if (destOrient == 'down') {
            cardObj.moveDestFlip = Math.PI;
        }

        return true;
    }

    /* sendAll
        send all the cards in the stack to another stack

        stack; the destination stack (another StackState object)
        destLoc: either "top" or "bottom" (where in the destination stack the
        cards should be added)
        destOrient: either "up" or "down"; the orientation the cards should have
        once they are added to the destination stack
    */
    sendAll(stack, destLoc, destOrient) {
        // create an array with the value of each card in the stack
        var cards = [];
        for (var i = 0; i < this.cards.length; i++) {
            cards.push(this.cards[i].value);
        }

        // send each card to the other stack
        for (var i = 0; i < cards.length; i++) {
            this.sendCard(cards[i], stack, destLoc, destOrient);
        }
    }

    /* setHoverActive
        set the display objects's mouse handling functions to put the stack in
        the active state when the mouse hovers over it
    */
    setHoverActive() {
        // have the display enter the active state when the mouse enters
        this.display._mouseEnterFunc = function(stack, x, y) {
            stack.active = true;
            stack.waitingRedrawBackground = true;
            globalRedrawTrigger = true;
        };

        // have the display exit hte active state when the mouse exits
        this.display._mouseExitFunc = function(stack, x, y) {
            stack.active = false;
            stack.waitingRedrawBackground = true;
            globalRedrawTrigger = true;
        };
    }

    /* setHoverhighlight
        set the dispaly object's mouse handling function to change background
        color when the house hover's over it
    */
    setHoverHighlight() {
        // set the background color to a darker green when the mouse enters
        this.display._mouseEnterFunc = function(stack, x, y) {
            stack.setBackground('#008000');
            stack.displayText = true;
            globalRedrawTrigger = true;
        };

        // clear the background color when the mouse exits
        this.display._mouseExitFunc = function(stack, x, y) {
            stack.setBackground(null);
            stack.displayText = false;
            globalRedrawTrigger = true;
        };
    }
}

/* StackGroudpState
    describes a group of stacks, tagged with names
*/
class StackGroupState {
    /* constructor
        create a StackGroupState as either empty or as a clone of another 
        StackGroupState

        template: an optional StackGroupState parameter; if passed, the new
        object will be a clone of template, otherwise it will be built as empty
    */
    constructor(template) {
        // an array of stack names
        this.names = [];
        // a dictionary mapping stack names to StackState objects
        this.stacks = {};

        // if a template is specified, copy the stacks over
        if (template) {
            for (var i = 0; i < template.names.length; i++) {
                var name = template.names[i];
                this.names.push(name);
                this.stacks[name] = new StackState(template.stacks[name]);
            }
        }
    }

    /* createStack
        add a new empty stack to the StackGroupState

        name: a unique string name for the stack
    */
    createStack(name) {
        this.names.push(name);
        this.stacks[name] = new StackState(null);
    }

    /* createStacks
        add multiple empty stacks to the StackGroupState

        names: an array of unique stacks names to use
    */
    createStacks(names) {
        for (var i = 0; i < names.length; i++) {
            this.createStack(names[i]);
        }
    }
}

/* GameState
    describes the state of a game, containing stack groups and global variables
*/
class GameState {
    /* constructor
        create a GameState as either empty or as a clone of another GameState

        template: an optional GameState parameter; if passed, the new object
        will be a clone of template, otherwise it will be built as empty
    */
    constructor(template) {
        // named StackGroup objects
        this.stackGroupNames = [];
        this.stackGroups = {};
        
        // state variables for storing extra information
        this.globalStateNames = [];
        this.globalStates = {};

        // if a template is passed, clone the game state
        if (template) {
            // copy all the StackGroupState objects
            for (var i = 0; i < template.stackGroupNames.length; i++) {
                var name = template.stackGroupNames[i];
                this.stackGroupNames.push(name);
                this.stackGroups[name] = new StackGroupState(template.stackGroups[name]);
            }

            // copy all the global state variables
            for (var i = 0; i < template.globalStateNames.length; i++) {
                var name = template.globalStateNames[i];
                this.globalStateNames.push(name);
                this.globalStates[name] = template.globalStates[name];
            }
        }
    }

    /* createStackGroup
        create a new stack group

        name: a unique string name for the stack group
        initialStacks: optional parameter; an array of StateStacks to add to the
        new stack group
    */
    createStackGroup(name, initialStacks) {
        // create the new stack group and add it to the GameState
        this.stackGroupNames.push(name);
        this.stackGroups[name] = new StackGroupState(null);

        // add the initial stack to the new stack group if given
        if (initialStacks) {
            this.stackGroups[name].createStacks(initialStacks);
        }
    }

    /* createStackGroups
        create multiple stack groups

        names: an array of unique names to use for the stack group
        initialStacks: optional parameter; an array of StateStacks to add to the
        new stack group; these stacks will be added to each new stack group
    */
    createStackGroups(names, initialStacks) {
        for (var i = 0; i < names.length; i++) {
            this.createStackGroup(names[i], initialStacks);
        }
    }

    /* addStateVariable
        add a new state variable and set its value

        name: a unique string for state variable
        value: the value to associate with the state variable
    */
    addStateVariable(name, value) {
        this.globalStateNames.push(name);
        this.globalStates[name] = value;
    }

    /* getGroupAndStack
        get a StackState object, specified by the stack group name and the stack
        name

        group: a string of the stack group's name
        stack: a string of the stack's name

        return the StackState object
    */
    getGroupAndStack(group, stack) {
        return this.stackGroups[group].stacks[stack];
    }
}

/* GameObject
    describes a game with its current state, players, and state history
*/
class GameObject {
    /* constructor
        players: an array of the game players
    */
    constructor(players) {
        // inialize the drawing backend of the game
        this.initDraw();

        // store the players
        this.players = players;

        // initialize the state variables and history as empty for now
        this.stateVariables = {};
        this.history = [];
    }

    /* initDraw
        initialize the canvas and CardManager for the game
    */
    initDraw() {
        // initalize the javascript canvases
        const game_canvas = document.getElementById("gameCanvas");
        const fore_canvas = document.getElementById("foregroundCanvas");

        // make the drawManager if it doesn't exist
        if (!drawManager) {
            drawManager = new CardManager(game_canvas, fore_canvas, window.innerWidth, window.innerHeight);
        }

        // reset and store a reference tothe drawmanager
        drawManager.reset();
        this.drawManager = drawManager;
    }

    /* getCurrentState
        get the current GameState of the game

        return a GameState object or null if there is no game history
    */
    getCurrentState() {
        // check if there is any game history, and return the last game state
        // entry if there is
        var l = this.history.length;
        if (l == 0) {
            return null;
        }
        else {
            return this.history[l-1].state;
        }
    }

    /* getCurrentID
        get the current state id

        return an id string or null if there is no game history
    */
    getCurrentID() {
        // check if there is any game history, and return the last game id
        // entry if there is
        var l = this.history.length;
        if (l == 0) {
            return null;
        }
        else {
            return this.history[l-1].id;
        }
    }

    /* addState
        add a new game state and the associated move information

        id: the is (string) of the new state
        move: an object that describes the latest move
        state: the new GameState object
    */
    addState(id, move, state) {
        // the state to the game
        this.history.push({
            id: id,
            move: move,
            state: state
        });
    }

    /* verifyState
        verify that a new game state is valid by checking if the previous id
        it's based off of is the same as the current game state

        previousID: the previous stateID that the new state is based off of

        return a boolean of true if verified, otherwise false
    */
    verifyState(previousID) {
        if (previousID == this.getCurrentID()) {
            return true;
        }
        else {
            return false;
        }
    }

    /* newState
        add a new game state that is identical to the current game state


        id: the is (string) of the new state
        move: an object that describes the latest move

        return the new GameState object
    */
    newState(id, move) {
        var newState = new GameState(game.getCurrentState());
        this.addState(id, move, newState);
        return newState;
    }
}
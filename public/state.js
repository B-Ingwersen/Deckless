var game = null;

class StackState {
    constructor(template) {
        this.cards = [];
        if (template) {
            for (var i = 0; i < template.cards.length; i++) {
                var card = template.cards[i];
                this.cards.push(card);
            }
            this.display = template.display;
        }
        else {
            this.display = null;
        }
    }

    /* TODO -- set orientation as well */
    addCards(cards, orientation) {
        for (var i = 0; i < cards.length; i++) {
            var card = allCards[cards[i]];
            if (this.display) {
                this.display.addCard(card, "in-stack");
                card.setOrientation(orientation);
            }
            this.cards.push(card);
        }
    }

    setCards(cards, orientation) {
        this.cards = [];
        this.addCards(cards, orientation);
    }

    addDisplay(display) {
        this.display = display;
    }

    getTopCard() {
        return this.cards[this.cards.length - 1];
    }
    getBottomCard() {
        return this.cards[0];
    }

    sendCard(card, stack, destLoc, destOrient) {
        var i;
        for (i = 0; i < this.cards.length; i++) {
            if (this.cards[i].value == card) {
                break;
            }
        }
        if (i >= this.cards.length) {
            return false;
        }

        var cardObj = this.cards[i];
        this.cards.splice(i,1);
        if (!destLoc || destLoc == 'top') {
            stack.cards.push(cardObj);
        }
        else if (destLoc == 'bottom') {
            stack.cards.splice(0, 0, cardObj);
        }
        this.display.sendCard(card, stack.display, moveNormal, destLoc);

        if (destOrient == 'up') {
            cardObj.moveDestFlip = 0;
        }
        else if (destOrient == 'down') {
            cardObj.moveDestFlip = Math.PI;
        }
        return true;
    }

    sendAll(stack, destLoc, destOrient) {
        var cards = [];
        for (var i = 0; i < this.cards.length; i++) {
            cards.push(this.cards[i].value);
        }
        for (var i = 0; i < cards.length; i++) {
            this.sendCard(cards[i], stack, destLoc, destOrient);
        }
    }

    setHoverActive() {
        this.display._mouseEnterFunc = function(stack, x, y) {
            stack.active = true;
            stack.waitingRedrawBackground = true;
            globalRedrawTrigger = true;
        };
        this.display._mouseExitFunc = function(stack, x, y) {
            stack.active = false;
            stack.waitingRedrawBackground = true;
            globalRedrawTrigger = true;
        };
    }

    setHoverHighlight() {
        this.display._mouseEnterFunc = function(stack, x, y) {
            stack.setBackground('#008000');
            stack.displayText = true;
            globalRedrawTrigger = true;
        };
        this.display._mouseExitFunc = function(stack, x, y) {
            stack.setBackground(null);
            stack.displayText = false;
            globalRedrawTrigger = true;
        };
    }
}

class StackGroupState {
    constructor(template) {
        this.names = [];
        this.stacks = {};
        if (template) {
            for (var i = 0; i < template.names.length; i++) {
                var name = template.names[i];
                this.names.push(name);
                this.stacks[name] = new StackState(template.stacks[name]);
            }
        }
    }

    createStack(name) {
        this.names.push(name);
        this.stacks[name] = new StackState(null);
    }

    createStacks(names) {
        for (var i = 0; i < names.length; i++) {
            this.createStack(names[i]);
        }
    }
}

class GameState {
    constructor(template) {
        this.stackGroupNames = [];
        this.stackGroups = {};
        //this.players = [];
        this.globalStateNames = [];
        this.globalStates = {};
        if (template) {
            for (var i = 0; i < template.stackGroupNames.length; i++) {
                var name = template.stackGroupNames[i];
                this.stackGroupNames.push(name);
                this.stackGroups[name] = new StackGroupState(template.stackGroups[name]);
            }
            /*for (var i = 0; i < template.players; i++) {
                var player = template.players[i];
                this.players.push(player);
            }*/
            for (var i = 0; i < template.globalStateNames.length; i++) {
                var name = template.globalStateNames[i];
                this.globalStateNames.push(name);
                this.globalStates[name] = template.globalStates[name];
            }
        }
    }

    createStackGroup(name, initialStacks) {
        this.stackGroupNames.push(name);
        this.stackGroups[name] = new StackGroupState(null);
        if (initialStacks) {
            this.stackGroups[name].createStacks(initialStacks);
        }
    }

    createStackGroups(names, initialStacks) {
        for (var i = 0; i < names.length; i++) {
            this.createStackGroup(names[i], initialStacks);
        }
    }

    addStateVariable(name, value) {
        this.globalStateNames.push(name);
        this.globalStates[name] = value;
    }

    getGroupAndStack(group, stack) {
        return this.stackGroups[group].stacks[stack];
    }
}

class GameObject {
    constructor(players) {
        this.initDraw();
        this.players = players;
        this.stateVariables = {};
        this.history = [];
    }

    initDraw() {
        const game_canvas = document.getElementById("gameCanvas");
        const fore_canvas = document.getElementById("foregroundCanvas");
        if (!drawManager) {
            drawManager = new CardManager(game_canvas, fore_canvas, window.innerWidth, window.innerHeight);
        }
        drawManager.reset();
        this.drawManager = drawManager;
    }

    getCurrentState() {
        var l = this.history.length;
        if (l == 0) {
            return null;
        }
        else {
            return this.history[l-1].state;
        }
    }

    getCurrentID() {
        var l = this.history.length;
        if (l == 0) {
            return null;
        }
        else {
            return this.history[l-1].id;
        }
    }

    addState(id, move, state) {
        this.history.push({
            id: id,
            move: move,
            state: state
        });
    }

    verifyState(previousID) {
        if (previousID == this.getCurrentID()) {
            return true;
        }
        else {
            return false;
        }
    }

    newState(id, move) {
        var newState = new GameState(game.getCurrentState());
        this.addState(id, move, newState);
        return newState;
    }
}
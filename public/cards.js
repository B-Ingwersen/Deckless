
/* an array of all the cards that have been created for the current game */
var allCards = null;

/* cards_shuffle
    randomly shuffle an array of cards

    cards: an array of cards (could ve values of Card objects)

    return the shuffled array of cards
*/
function cards_shuffle(cards) {
    // randomly swap each card with a card that comes before it in the deck;
    // start this process at the end and work forward
    var j, i;
    for (i = cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));

        // swap cards[i] and cards[j]
        var card = cards[i];
        cards[i] = cards[j];
        cards[j] = card;
    }
    return cards;
}

/* cards_initialShuffleAll
    create all 52 cards and randomly distrubute them among players

    playerIDs: the list of player ids to distribute the cards among

    return an array with entries of the form:
        {
            id: // the playerID
            initialCards: // the array of card values assigned to the player
        }
*/
function cards_initialShuffleAll(playerIDs) {
    // create all 52 cards and shuffle them
    var cards = [];
    for (var i = 0; i < 52; i++) {
        cards.push(i);
    }
    cards_shuffle(cards);

    // divide the cards up among the players
    var cardDistribution = [];
    var nPlayers = playerIDs.length;
    for (var i = 0; i < nPlayers; i++) {

        // determine the slice of the cards array to assign to the player
        var initialIndex = Math.round(i * 52.0 / nPlayers);
        var endIndex = Math.round((i + 1) * 52.0 / nPlayers);

        // add an entry for the player
        cardDistribution.push({
            id : playerIDs[i],
            initialCards : cards.slice(initialIndex, endIndex)
        });
    }

    return cardDistribution;
}

/* cards_create52CardDeck
    create an array of Card objects that cover a full 52-card deck

    return the array of Card objects
*/
function cards_create52CardDeck() {
    allCards = [];
    for (var i = 0; i < 52; i++) {
        allCards.push(new Card(i + 1));
    }
}

/* card_getSuit
    return the suit index (0 - 3) for a card given its value

    value: a card value (1 - 52)

    return the suit index:
        0: spade
        1: club
        2: heart
        3: diamond
*/
function cards_getSuit(value) {
    return Math.round((value - 1) / 13);
}

/* cards_getNum
    get the face value of a card given its value

    value: a card value (1 - 52)

    return the face value:
        1: Ace
        2 - 10: the equivalent numbers
        11: Jack
        12: Queen
        13: King
*/
function cards_getNum(value) {
    return ((value - 1) % 13) + 1;
}

/* cards_getNumAceHigh
    get the face value of a card in a system where ace is considered the high
    card

    value: a card value (1 - 52)

    return the face value:
        2 - 10: the corresponding numbers
        11: Jack
        12: Queen
        13: King
*/
function cards_getNumAceHigh(value) {
    var num = cards_getNum(value);

    // translate Ace to 14
    if (num == 1) {
        num = 14;
    }
    return num;
}
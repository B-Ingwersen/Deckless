
var allCards = null;

// CARD FUNCTIONS

function cards_shuffle(cards) {
    var j, i;
    for (i = cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        var card = cards[i];
        cards[i] = cards[j];
        cards[j] = card;
    }
    return cards;
}

function cards_initialShuffleAll(playerIDs) {
    var cards = [];
    for (var i = 0; i < 52; i++) {
        cards.push(i);
    }
    cards_shuffle(cards);

    var cardDistribution = [];
    var nPlayers = playerIDs.length;
    for (var i = 0; i < nPlayers; i++) {
        var initialIndex = Math.round(i * 52.0 / nPlayers);
        var endIndex = Math.round((i + 1) * 52.0 / nPlayers);

        cardDistribution.push({
            id : playerIDs[i],
            initialCards : cards.slice(initialIndex, endIndex)
        });
    }

    return cardDistribution;
}

function cards_create52CardDeck() {
    allCards = [];
    for (var i = 0; i < 52; i++) {
        allCards.push(new Card(i + 1));
    }
}

function cards_getSuit(value) {
    return Math.round((value - 1) / 13);
}
function cards_getNum(value) {
    return ((value - 1) % 13) + 1;
}
function cards_getNumAceHigh(value) {
    var num = cards_getNum(value);
    if (num == 1) {
        num = 14;
    }
    return num;
}

// CARD FUNCTIONS END
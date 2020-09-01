

var CARD_WIDTH = 200;
var CARD_HEIGHT = 300;

// CARD DRAING FUNCTIONS -- START //
    function drawDiamond(ctx, x,y, w) {
        h = 2.7*w/2;
        ctx.fillStyle = "#FF0000";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x,y-h);
        ctx.lineTo(x+w, y);
        ctx.lineTo(x, y+h);
        ctx.lineTo(x-w, y);
        ctx.fill();
    }
    function drawHeart(ctx, x,y, w) {
        r = w/2;
        ctx.fillStyle = "#FF0000";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x,y-0.707*r);
        ctx.arc(x+w/2,y-0.707*r, r, Math.PI, 9*Math.PI/4);
        ctx.lineTo(x, y+1.707*r);
        ctx.lineTo(x-w*0.854, y);
        ctx.arc(x-w/2,y-0.707*r, r, 3*Math.PI/4, 2*Math.PI);
        ctx.fill();
    }
    function drawHeart2(ctx, x,y, w) {
        r = w/2;
        ctx.fillStyle = "#FF0000";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x,y+0.707*r);
        ctx.arc(x+w/2,y+0.707*r, r, Math.PI, 7*Math.PI/4, true);
        ctx.lineTo(x, y-1.707*r);
        ctx.lineTo(x-w*0.854, y);
        ctx.arc(x-w/2,y+0.707*r, r, 5*Math.PI/4, 0, true);
        ctx.fill();
    }
    function drawSpade(ctx, x,y, w) {
        d = w/3;
        ctx.fillStyle = "#000000";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x,y-3.828*d);
        ctx.lineTo(x+2.414*d,y-1.414*d)
        ctx.arc(x+d,y, 2*d, Math.PI*7/4, Math.PI*2/3);
        ctx.arc(x-d,y, 2*d, Math.PI/3, 5*Math.PI/4);
        ctx.lineTo(x,y-3.828*d);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x,y+d);
        ctx.lineTo(x+d,y+4*d);
        ctx.lineTo(x-d,y+4*d);
        ctx.lineTo(x,y+d);
        ctx.fill();
    }
    function drawSpade2(ctx, x,y, w) {
        d = w/3;
        ctx.fillStyle = "#000000";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x,y+3.828*d);
        ctx.lineTo(x+2.414*d,y+1.414*d)
        ctx.arc(x+d,y, 2*d, Math.PI/4, Math.PI*4/3, true);
        ctx.arc(x-d,y, 2*d, Math.PI*5/3, Math.PI*3/4, true);
        ctx.lineTo(x,y+3.828*d);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x,y-d);
        ctx.lineTo(x+d,y-4*d);
        ctx.lineTo(x-d,y-4*d);
        ctx.lineTo(x,y-d);
        ctx.fill();
    }
    function drawClub(ctx, x,y, w) {
        r = w/2;
        y += 0.35*w;
        ctx.fillStyle = "#000000";
        ctx.shadowColor = "#C0C0C0";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x+r,y-1.5*r);
        ctx.arc(x, y-1.5*r, r, 0,2*Math.PI);
        ctx.fill();
        ctx.moveTo(x+0.134*r,y);
        ctx.arc(x-0.866*r, y, r, 0,2*Math.PI);
        ctx.fill();
        ctx.moveTo(x+1.866*r,y);
        ctx.arc(x+0.866*r, y, r, 0,2*Math.PI);
        ctx.fill();
        ctx.moveTo(x,y+0.5*r);
        ctx.lineTo(x+0.8*r,y+1.8*r);
        ctx.lineTo(x-0.8*r,y+1.8*r);
        ctx.lineTo(x,y+0.5*r);
        ctx.fill();
    }
    function drawClub2(ctx, x,y, w) {
        r = w/2;
        y += 0.35*w;
        ctx.fillStyle = "#000000";
        ctx.shadowColor = "#C0C0C0";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x+r,y+1.5*r);
        ctx.arc(x, y+1.5*r, r, 0,2*Math.PI);
        ctx.fill();
        ctx.moveTo(x+0.134*r,y);
        ctx.arc(x-0.866*r, y, r, 0,2*Math.PI);
        ctx.fill();
        ctx.moveTo(x+1.866*r,y);
        ctx.arc(x+0.866*r, y, r, 0,2*Math.PI);
        ctx.fill();
        ctx.moveTo(x,y-0.5*r);
        ctx.lineTo(x+0.8*r,y-1.8*r);
        ctx.lineTo(x-0.8*r,y-1.8*r);
        ctx.lineTo(x,y-0.5*r);
        ctx.fill();
    }
    function drawCard(value, ctx, x,y, w,h, shadow) {
        ctx.fillStyle = "#FFFFFF";
        var r = w / 10;

        ctx.shadowBlur = shadow;
        ctx.shadowColor = "black";

        /*ctx.fillRect(x,y+r,w,h-2*r);
        ctx.fillRect(x+r,y,w-2*r,r);
        ctx.fillRect(x+r,y+h-r,w-2*r,r);*/
        
        ctx.beginPath();
        ctx.arc(x+r,y+r, r, Math.PI, 3*Math.PI/2);
        //ctx.lineTo(x+w-r,y);
        ctx.arc(x+w-r,y+r, r, 3*Math.PI/2, 2*Math.PI);
        //ctx.lineTo(x+w,y+h-r);
        ctx.arc(x+w-r,y+h-r, r, 0, Math.PI/2);
        ctx.arc(x+r,y+h-r, r, Math.PI/2, Math.PI);
        ctx.fill();

        var suit = Math.floor((value-1) / 13);
        var suitFunctions = [drawSpade, drawClub, drawHeart, drawDiamond];
        var suitFunctions2 = [drawSpade2, drawClub2, drawHeart2, drawDiamond];
        var drawFunction = suitFunctions[suit];
        var drawFunction2 = suitFunctions2[suit];
        var number = ((value - 1) % 13) + 1;
        var s = w/10;
        if (number == 1) {
            drawFunction(ctx, x+w/2, y+h/2, s);
        }
        else if (number == 2) {
            drawFunction(ctx, x+w*0.5, y+h*0.2, s);
            drawFunction2(ctx, x+w*0.5, y+h*0.8, s);
        }
        else if (number == 3) {
            drawFunction(ctx, x+w/2, y+h/2, s);
            drawFunction(ctx, x+w*0.5, y+h*0.2, s);
            drawFunction2(ctx, x+w*0.5, y+h*0.8, s);
        }
        else if (number == 4) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
        }
        else if (number == 5) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.5, y+h*0.5, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
        }
        else if (number == 6) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.5, s);
            drawFunction(ctx, x+w*0.7, y+h*0.5, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
        }
        else if (number == 7) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.5, s);
            drawFunction(ctx, x+w*0.7, y+h*0.5, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w*0.5, y+h*0.35, s);
        }
        else if (number == 8) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.5, s);
            drawFunction(ctx, x+w*0.7, y+h*0.5, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w*0.5, y+h*0.35, s);
            drawFunction2(ctx, x+w*0.5, y+h*0.65, s);
        }
        else if (number == 9) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.4, s);
            drawFunction(ctx, x+w*0.7, y+h*0.4, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.6, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.6, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w/2, y+h/2, s);
        }
        else if (number == 10) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.4, s);
            drawFunction(ctx, x+w*0.7, y+h*0.4, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.6, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.6, s);
            drawFunction2(ctx, x+w*0.3, y+h*0.8, s);
            drawFunction2(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w/2, y+h*0.3, s);
            drawFunction2(ctx, x+w/2, y+h*0.7, s);
        }

        drawFunction(ctx, x+w*0.12, y+h*0.22, s/2);
        drawFunction2(ctx, x+w*0.88, y+h*0.78, s/2);

        var text = String(number);
        if (number == 1) {text = "A";}
        else if (number == 11) {text = "J";}
        else if (number == 12) {text = "Q";}
        else if (number == 13) {text = "K";}
        
        ctx.font = String(Math.floor(s*1.5)) + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, x+w*0.12, y+h*0.16);
        ctx.save();
        ctx.rotate(Math.PI);
        ctx.fillText(text, -x-w*0.88, -y-h*0.84);
        ctx.restore();
    }
    function drawCardBack(value, ctx, x,y, w,h, shadow) {
        ctx.fillStyle = "#FFFFFF";
        var r = w / 10;

        ctx.shadowBlur = shadow;
        ctx.shadowColor = "black";

        /*ctx.fillRect(x,y+r,w,h-2*r);
        ctx.fillRect(x+r,y,w-2*r,r);
        ctx.fillRect(x+r,y+h-r,w-2*r,r);*/
        
        ctx.beginPath();
        ctx.arc(x+r,y+r, r, Math.PI, 3*Math.PI/2);
        //ctx.lineTo(x+w-r,y);
        ctx.arc(x+w-r,y+r, r, 3*Math.PI/2, 2*Math.PI);
        //ctx.lineTo(x+w,y+h-r);
        ctx.arc(x+w-r,y+h-r, r, 0, Math.PI/2);
        ctx.arc(x+r,y+h-r, r, Math.PI/2, Math.PI);
        ctx.fill();

        ctx.fillStyle = "#6600ff";
        ctx.shadowBlur = 0;

        var s = w * 0.06;
        var x_s = x + s;
        var y_s = y + s;
        var w_s = w - 2 * s;
        var h_s = h - 2 * s;
        ctx.fillRect(x + s, y + s, w - s * 2, h - s * 2);

        const n = 10;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = w / 200;
        for (var i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.moveTo(x_s + w_s * i / n, y_s);
            ctx.lineTo(x_s + w_s, y_s + (n - i) * h_s / n);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x_s, y_s + h_s * i / n);
            ctx.lineTo(x_s + (n - i) * w_s / n, y_s + h_s);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x_s + w_s * (n - i) / n, y_s);
            ctx.lineTo(x_s, y_s + (n - i) * h_s / n);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x_s + w_s, y_s + h_s * i / n);
            ctx.lineTo(x_s + i * w_s / n, y_s + h_s);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.font = String(Math.floor(s*3)) + "px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        //ctx.fillText("Deckless", x + w / 2, y + h * 0.53);

        /*drawFunction(ctx, x+w*0.12, y+h*0.22, s/2);
        drawFunction2(ctx, x+w*0.88, y+h*0.78, s/2);*/
    }
    function drawCard2(ctx, val, x,y, rot, flip, height) {
        ctx.save();
    
        var w = CARD_WIDTH;
        var h = CARD_HEIGHT;
        
        ctx.translate(x,y);
        ctx.rotate(rot);
        ctx.scale(Math.cos(flip), 1.0)
        if (Math.cos(flip) > 0) {
            drawCard(val, ctx, -w/2, -h/2, w, h, height / Math.sqrt(1 - Math.sin(flip) * Math.sin(flip) ));
        }
        else {
            drawCardBack(val, ctx, -w/2, -h/2, w, h, height / Math.sqrt(1 - Math.sin(flip) * Math.sin(flip) ));
        }
    
        ctx.restore();
    }
// CARD DRAING FUNCTIONS -- END //


var canvasWidth = 0;
var canvasHeight = 0;

var cards = [];
var background;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

class CardManager {
    constructor(canvas, fCanvas, width, height) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;

        this.fCanvas = fCanvas;
        this.fctx = fCanvas.getContext("2d");
        this.fctx.canvas.width = width;
        this.fctx.canvas.height = height;

        this.width = width;
        this.height = height;

        var L = Math.min(width, height);
        CARD_HEIGHT = Math.min(300, L / 2.2 - 60);
        CARD_WIDTH = CARD_HEIGHT * 2 / 3;

        this.lastElementId = 0;
        this.elements = [];
        this.foregroundCards = [];

        fCanvas.addEventListener('mousemove', function(evt) {
            drawManager.mouseMoveHandler(evt);
        }, false);
        fCanvas.addEventListener('click', function(evt) {
            drawManager.mouseClickHandler(evt);
        }, false);

        this.currentMouseOver = null;
    }

    reset() {
        this.elements = [];
        this.foregroundCards = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    mouseMoveHandler(evt) {
        var pos = getMousePos(this.fCanvas, evt);
        var foundElem = null;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].elem.coordsIn(pos.x, pos.y)) {
                foundElem = this.elements[i];
                break;
            }
        }

        if (foundElem) {
            if (this.currentMouseOver) {
                if (this.currentMouseOver.id != foundElem.id) {
                    foundElem.elem.mouseEnter(pos.x, pos.y);
                    this.currentMouseOver.elem.mouseExit(pos.x, pos.y);
                }
                else {
                    foundElem.elem.mouseMove(pos.x, pos.y);
                }
            }
            else {
                foundElem.elem.mouseEnter(pos.x, pos.y);
            }
        }
        else {
            if (this.currentMouseOver) {
                this.currentMouseOver.elem.mouseExit(pos.x, pos.y);
            }
        }

        this.currentMouseOver = foundElem;
    }

    mouseClickHandler(evt) {
        var pos = getMousePos(this.fCanvas, evt);
        var foundElem = null;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].elem.coordsIn(pos.x, pos.y)) {
                foundElem = this.elements[i];
                break;
            }
        }

        if (foundElem) {
            foundElem.elem.mouseClick();
        }
    }
    

    addElement(elem) {
        var elemId = this.lastElementId;
        this.lastElementId++;
        this.elements.push({
            id: elemId,
            elem: elem
        });
        return elemId;
    }

    draw() {
        this.foregroundCards = [];
        this.fctx.clearRect(0, 0, this.width, this.height);
        var redraw = false;
        for (var i = 0; i < this.elements.length; i++) {
            redraw |= this.elements[i].elem.draw();
        }

        for (var i = 0; i < this.foregroundCards.length; i++) {
            this.foregroundCards[i].draw(this.fctx);
        }

        return redraw;
    }

    createCircularStacks(N, centerStackIndex) {
        if (!centerStackIndex) {
            centerStackIndex = 0;
        }

        var stacks = [];

        var W = this.width;
        var H = this.height;

        for (var i = -centerStackIndex; i < N - centerStackIndex; i++) {

            var s_x = Math.sin(i*Math.PI*2/N);
            if (s_x > 0) {s_x = Math.pow(Math.abs(s_x), 0.2);}
            else {s_x = -Math.sqrt(Math.abs(s_x));}
            var s_y = Math.cos(i*Math.PI*2/N);
            if (s_y > 0) {s_y = Math.pow(Math.abs(s_y), 0.2);}
            else {s_y = -Math.sqrt(Math.abs(s_y));}
    
            var stack = new CardStack(this, W/2+W*0.5*s_x, H/2+H*0.5*s_y, -Math.atan2(s_x*W, s_y*H));
            stacks.push(stack);
        }

        return stacks;
    }

    createCenterStack() {
        var W = this.width;
        var H = this.height;

        return new CardStack(this, W / 2, H / 2, 0);
    }
}

function moveNormal(info, progress) {

    var p = (Math.cos(progress * Math.PI) + 1) / 2;
    //var p = 1 - progress;

    var x = info.moveDestX - (info.moveDestX - info.moveSourceX) * p;
    var y = info.moveDestY - (info.moveDestY - info.moveSourceY) * p;
    var rot = info.moveDestAngle - (info.moveDestAngle - info.moveSourceAngle) * p;
    var flip = info.moveDestFlip - (info.moveDestFlip - info.moveSourceFlip) * p;
    var height = 10;

    return [x,y,rot,height,flip];
}

function moveNormalFlip(info, progress) {

    var p = (Math.cos(progress * Math.PI) + 1) / 2;
    //var p = 1 - progress;

    var x = info.moveDestX - (info.moveDestX - info.moveSourceX) * p;
    var y = info.moveDestY - (info.moveDestY - info.moveSourceY) * p;
    var rot = info.moveDestAngle - (info.moveDestAngle - info.moveSourceAngle) * p;
    var flip = info.moveSourceFlip + (1 - p) * Math.PI;
    var height = 10;

    return [x,y,rot,height,flip];
}

class Card {
    constructor(value) {
        this.value = value;
        this.x = 0;
        this.y = 0;
        this.rot = 0;
        this.flip = 0;
        this.heigth = 5;

        this.moveSourceX = 0;
        this.moveSourceY = 0;
        this.moveDestX = 0;
        this.moveDestY = 0;
        this.moveLength = 0;
        this.moveProgress = 0;
        this.moveOrigin = null;
        this.moveTarget = null;
    }

    setView(x,y, rot, flip, height) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.flip = flip;
        this.height = height;
    }

    setOrientation(orientation) {
        if (orientation == "up") {
            this.flip = 0;
        }
        else if (orientation == "down") {
            this.flip = Math.PI;
        }
    }

    setMove(source, destination, moveFunction) {
        this.moveSourceX = this.x;
        this.moveSourceY = this.y;
        this.moveSourceAngle = this.rot;
        this.moveDestX = destination.x;
        this.moveDestY = destination.y;
        this.moveDestAngle = destination.angle;
        this.moveDestFlip = this.flip;
        this.moveStart = Date.now();
        this.moveLength = 300;
        this.moveOrigin = source;
        this.moveTarget = destination;
        this.moveSourceFlip = this.flip;

        this.moveFunction = moveFunction;

        if (Math.abs(this.moveDestAngle - this.moveSourceAngle) > Math.PI) {
            if (this.moveDestAngle > this.moveSourceAngle) {
                this.moveDestAngle -= 2 * Math.PI;
            }
            else {
                this.moveDestAngle += 2 * Math.PI;
            }
        }
    }

    setDestination(x,y) {
        this.moveDestX = x;
        this.moveDestY = y;
    }

    move(ctx) {
        var progress = (Date.now() - this.moveStart) / this.moveLength;
        if (progress > 1) {
            progress = 1;
        }

        var pos = this.moveFunction(this, progress);
        this.x = pos[0];
        this.y = pos[1];
        this.rot = pos[2];
        this.height = pos[3];
        this.flip = pos[4];

        if (progress >= 1.0) {
            return true;
        }
    }

    draw(ctx) {
        drawCard2(ctx, this.value, this.x, this.y, this.rot, this.flip, this.height);
    }
}

class CardStack {
    constructor(drawArea, x, y, angle) {
        this.drawArea = drawArea;
        this.x = x;
        this.y = y;
        this.angle = angle;

        this.cards = [];

        this.id = drawArea.addElement(this);

        this.waitingRedrawAll = false;
        this.waitingRedrawBackground = false;
        this.waitingRedrawForeground = false;

        this.active = false;

        this._mouseEnterFunc = null;
        this._mouseExitFunc = null;
        this._mouseClickFunc = null;

        this.backgroundColor = null;
        this.text = null;
        this.displayText = false;
    }

    mouseEnter(x,y) {
        if (this._mouseEnterFunc) {
            this._mouseEnterFunc(this, x, y);
        }
    }
    mouseExit(x,y) {
        if (this._mouseExitFunc) {
            this._mouseExitFunc(this, x, y);
        }
    }
    mouseMove(x,y) {

    }

    mouseClick() {
        if (this._mouseClickFunc) {
            this._mouseClickFunc(this);
        }
        /*console.log("I got clicked!");
        var l = this.cards.length;
        if (l > 0) {
            this.sendCard(this.cards[l-1].card.value, centerStack, moveNormalFlip);
        }*/
    }

    addCard(card, type) {
        this.cards.push({
            type: type,
            card: card
        });
        this.waitingRedrawAll = true;
    }

    addCardBottom(card, type) {
        this.cards.splice(0,0, {
            type: type,
            card: card
        });
        this.waitingRedrawAll = true;
    }

    generate52CardDeck() {
        this.cards = [];
        for (var i = 0; i < 52; i++) {
            var card = new Card(52 - i);
            this.addCard(card, "in-stack");
        }
    }

    orient(dir) {
        if (dir == "up") {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards[i].card.setView(
                    this.cards[i].card.x,
                    this.cards[i].card.y,
                    this.cards[i].card.rot,
                    0,
                    this.cards[i].card.height
                )
            }
        }
        else if (dir == "down") {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards[i].card.setView(
                    this.cards[i].card.x,
                    this.cards[i].card.y,
                    this.cards[i].card.rot,
                    Math.PI,
                    this.cards[i].card.height
                )
            }
        }
    }

    sendCard(value, destination, moveFunc, destLoc) {
        var index = -1;
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].card.value == value) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return;
        }

        this.cards[index].card.setMove(this, destination, moveFunc);
        if (!destLoc || destLoc == 'top') {
            destination.addCard(this.cards[index].card, "incoming");
        }
        else if (destLoc == 'bottom') {
            destination.addCardBottom(this.cards[index].card, "incoming");
        }
        this.cards.splice(i, 1);
        this.waitingRedrawAll = true;
        globalRedrawTrigger = true;
    }

    coordsIn(x,y) {
        /*if (x > this.x - CARD_WIDTH / 2 - 15
            && x < this.x + CARD_WIDTH / 2 + 35
            && y > this.y - CARD_HEIGHT / 2 - 45
            && y < this.y + CARD_HEIGHT / 2 + 15)
        {
            return true;
        }
        return false;*/

        x -= this.x;
        y -= this.y;
        var newX = x * Math.cos(-this.angle) - y * Math.sin(-this.angle);
        var newY = x * Math.sin(-this.angle) + y * Math.cos(-this.angle);

        if (newX > - CARD_WIDTH / 2 - 15
            && newX < CARD_WIDTH / 2 + 35
            && newY > - CARD_HEIGHT / 2 - 45
            && newY < CARD_HEIGHT / 2 + 15)
        {
            return true;
        }
        return false;
    }

    setBackground(color) {
        this.backgroundColor = color;
        this.waitingRedrawBackground = true;
    }

    drawText(text) {
        var ctx = this.drawArea.ctx;
        var W = CARD_WIDTH + 46;
        var X = -CARD_WIDTH / 2 - 13;
        var Y = -CARD_HEIGHT * 0.25;
        var XCenter = X + W / 2;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.font = '30px Arial';
        var w = ctx.measureText(text).width;
        var fontSize = 30;
        if (w > W * 0.8) {
            fontSize = Math.floor(30 * (W * 0.8) / w);
            ctx.font = String(fontSize) + "px Arial";
        }

        w = ctx.measureText(text).width;

        ctx.fillStyle = 'rgba(40,40,40,0.7)';
        ctx.fillRect(X, Y - 20, W, 40);
        ctx.fillStyle = 'white';
        ctx.fillText(text, XCenter - w / 2, Y + fontSize * 0.4);

        ctx.restore();
    }

    drawBackground() {
        var ctx = this.drawArea.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(- CARD_WIDTH / 2 - 15 + 2, - CARD_HEIGHT / 2 - 45 + 2, CARD_WIDTH + 50 - 4, CARD_HEIGHT + 60 - 4);
        }
        else {
            ctx.clearRect(- CARD_WIDTH / 2 - 15, - CARD_HEIGHT / 2 - 45, CARD_WIDTH + 50, CARD_HEIGHT + 60);
        }
        //this.drawArea.ctx.clearRect(this.x - CARD_WIDTH / 2 - 15, this.y - CARD_HEIGHT / 2 - 45, CARD_WIDTH + 50, CARD_HEIGHT + 60);
        ctx.restore();

        this.waitingRedrawBackground = false;

        var topCard = -1;
        var cutoff = this.cards.length;
        var nFound = 0;
        for (var i = this.cards.length - 1; i >= 0; i--) {
            cutoff = i;
            if (this.cards[i].type == "in-stack") {
                if (topCard == -1) {
                    topCard = i;
                }
                nFound++;
            }
            if (nFound >= 5) {
                break;
            }
        }

        var cardOff = 5;
        var shadow = 10;

        for (var i = 0; i < this.cards.length; i++) {
            var o = Math.max(0, Math.min(4, (i - cutoff)) );
            if (this.cards[i].type == "in-stack") {
                var x = this.x + o * cardOff * (Math.cos(this.angle) + Math.sin(this.angle));
                var y = this.y - o * cardOff * (Math.cos(this.angle) - Math.sin(this.angle));
                if (this.active && topCard == i) {
                    y -= 10 * Math.cos(this.angle);
                    x += 10 * Math.sin(this.angle);
                }
                this.cards[i].card.setView(x, y, this.angle, this.cards[i].card.flip, shadow);
                if (i >= cutoff) {
                    this.cards[i].card.draw(this.drawArea.ctx);
                }
                else {

                }
            }
            else if (this.cards[i].type == "incoming") {
                // do nothing for now;
            }
            else if (this.cards[i].type == "outgoing") {
                // do nothing for now;
            }
        }

        if (this.text && this.displayText) {
            this.drawText(this.text);
        }
    }

    drawAll(ctx) {
        var requestAnotherRedraw = false;

        var cutoff = this.cards.length;
        var nFound = 0;
        for (var i = this.cards.length - 1; i >= 0; i--) {
            cutoff = i;
            if (this.cards[i].type == "in-stack") {
                nFound++;
            }
            if (nFound >= 5) {
                break;
            }
        }

        var cardOff = 5;
        var shadow = 10;

        for (var i = 0; i < this.cards.length; i++) {
            var o = Math.max(0, Math.min(4, (i - cutoff)) );
            if (this.cards[i].type == "in-stack") {
                this.cards[i].card.setView(this.x + o * cardOff, this.y - o * cardOff, 0, 0, shadow);
                if (i >= cutoff) {
                    this.cards[i].card.draw(ctx);
                }
                else {

                }
            }
            else if (this.cards[i].type == "incoming") {

                this.cards[i].card.setDestination(this.x + o * cardOff, this.y - o * cardOff);
                
                if (!this.cards[i].card.move(ctx)) {
                    requestAnotherRedraw = true;
                }
                else {
                    this.cards[i].type = "in-stack";
                    this.waitingRedrawBackground = true;
                }
            }
            else if (this.cards[i].type == "outgoing") {
                if (this.cards[i].card.move(ctx)) {
                    this.cards.splice(i, 1);
                }
                requestAnotherRedraw = true;
            }
        }
        return requestAnotherRedraw;
    }

    drawForeground() {
        var ctx = this.drawArea.fctx;
        this.waitingRedrawForeground = false;

        var cutoff = this.cards.length;
        var nFound = 0;
        for (var i = this.cards.length - 1; i >= 0; i--) {
            cutoff = i;
            if (this.cards[i].type == "in-stack") {
                nFound++;
            }
            if (nFound >= 5) {
                break;
            }
        }

        var cardOff = 5;
        var shadow = 10;

        for (var i = 0; i < this.cards.length; i++) {
            var o = Math.max(0, Math.min(4, (i - cutoff)) );
            if (this.cards[i].type == "in-stack") {
                // ignore
            }
            else if (this.cards[i].type == "incoming") {
                var x = this.x + o * cardOff * (Math.cos(this.angle) + Math.sin(this.angle));
                var y = this.y - o * cardOff * (Math.cos(this.angle) - Math.sin(this.angle));

                this.cards[i].card.setDestination(x,y);
                
                if (!this.cards[i].card.move(ctx)) {
                    this.waitingRedrawForeground = true;
                }
                else {
                    this.cards[i].type = "in-stack";
                    this.waitingRedrawBackground = true;
                }
                this.drawArea.foregroundCards.push(this.cards[i].card);
            }
            else if (this.cards[i].type == "outgoing") {
                if (this.cards[i].card.move(ctx)) {
                    this.cards.splice(i, 1);
                }
                this.waitingRedrawForeground = true;
            }
        }
    }

    draw() {
        if (this.waitingRedrawAll) {
            //this.drawAll()
            this.waitingRedrawBackground = true;
            this.waitingRedrawForeground = true;
            this.waitingRedrawAll = false;
        }

        if (this.waitingRedrawBackground) {
            this.drawBackground();
        }
        if (this.waitingRedrawForeground) {
            this.drawForeground();
        }

        return this.waitingRedrawBackground | this.waitingRedrawForeground;
    }
}

var globalRedrawTrigger = true;
function animationFunction() {
    if (globalRedrawTrigger && drawManager) {
        globalRedrawTrigger = drawManager.draw();
    }
    requestAnimationFrame(animationFunction);
}

var drawManager = null;
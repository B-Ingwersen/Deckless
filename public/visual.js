
/* the global dimensions for all cards
    TODO -- move this to a CardManager parameter
*/
var CARD_WIDTH = 200;
var CARD_HEIGHT = 300;

/* the global instance of a CardManager that should be used to display the
game state */
var drawManager = null;

/* TODO -- document these */
var canvasWidth = 0;
var canvasHeight = 0;
var cards = [];
var background;

// CARD DRAING FUNCTIONS -- START //
    /* suit drawing functions
        draw the specified suit on the javascript canvas; the invert version of
        each draws the suit upside down

        ctx: a javascript canvas 2d context
        x: the x coordinate of the center of the suit (in pixels)
        y: the y coordinate of hte center of the suit (in pixels)
        w: the width of the suit (in pixels)
    */
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
    function drawHeartInvert(ctx, x,y, w) {
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
    function drawSpadeInvert(ctx, x,y, w) {
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
    function drawClubInvert(ctx, x,y, w) {
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

    /* drawCardFront
        draw the fron of a card to the javascript canvas

        value: the unique identifier for a card between 1 and 52
            TODO -- provide reference to description of card values
        ctx: the 2d context of the target javascript canvas
        x: x coordinate of the center of the card (in pixels)
        y: y coordinate of the center of the card (in pixels)
        w: the width of the card in pixels
        h: the height of the card in pixels
        shadow: the intensity of the shadow blur to draw around the card
    */
    function drawCardFront(value, ctx, x,y, w,h, shadow) {

        // set the background and shadow parameters
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = shadow;
        ctx.shadowColor = "black";

        // the radius for rounding the edges of the card
        var r = w / 10;
        
        // draw the outline of a card and fill it in
        ctx.beginPath();
        ctx.arc(x+r,y+r, r, Math.PI, 3*Math.PI/2);
        ctx.arc(x+w-r,y+r, r, 3*Math.PI/2, 2*Math.PI);
        ctx.arc(x+w-r,y+h-r, r, 0, Math.PI/2);
        ctx.arc(x+r,y+h-r, r, Math.PI/2, Math.PI);
        ctx.fill();

        // extract the suit and card number from the value parameter
        var suit = Math.floor((value-1) / 13);
        var number = ((value - 1) % 13) + 1;

        // select the suit drawing functions to use
        var suitFunctions = [drawSpade, drawClub, drawHeart, drawDiamond];
        var suitFunctionsInvert = [drawSpadeInvert, drawClubInvert, drawHeartInvert, drawDiamond];
        var drawFunction = suitFunctions[suit];
        var drawFunctionInvert = suitFunctionsInvert[suit];

        // the size of suits to draw on the cards
        var s = w/10;

        // draw the pattern of suits on the card based on its face value
        if (number == 1) {
            drawFunction(ctx, x+w/2, y+h/2, s);
        }
        else if (number == 2) {
            drawFunction(ctx, x+w*0.5, y+h*0.2, s);
            drawFunctionInvert(ctx, x+w*0.5, y+h*0.8, s);
        }
        else if (number == 3) {
            drawFunction(ctx, x+w/2, y+h/2, s);
            drawFunction(ctx, x+w*0.5, y+h*0.2, s);
            drawFunctionInvert(ctx, x+w*0.5, y+h*0.8, s);
        }
        else if (number == 4) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
        }
        else if (number == 5) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.5, y+h*0.5, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
        }
        else if (number == 6) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.5, s);
            drawFunction(ctx, x+w*0.7, y+h*0.5, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
        }
        else if (number == 7) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.5, s);
            drawFunction(ctx, x+w*0.7, y+h*0.5, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w*0.5, y+h*0.35, s);
        }
        else if (number == 8) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.5, s);
            drawFunction(ctx, x+w*0.7, y+h*0.5, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w*0.5, y+h*0.35, s);
            drawFunctionInvert(ctx, x+w*0.5, y+h*0.65, s);
        }
        else if (number == 9) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.4, s);
            drawFunction(ctx, x+w*0.7, y+h*0.4, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.6, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.6, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w/2, y+h/2, s);
        }
        else if (number == 10) {
            drawFunction(ctx, x+w*0.3, y+h*0.2, s);
            drawFunction(ctx, x+w*0.7, y+h*0.2, s);
            drawFunction(ctx, x+w*0.3, y+h*0.4, s);
            drawFunction(ctx, x+w*0.7, y+h*0.4, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.6, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.6, s);
            drawFunctionInvert(ctx, x+w*0.3, y+h*0.8, s);
            drawFunctionInvert(ctx, x+w*0.7, y+h*0.8, s);
            drawFunction(ctx, x+w/2, y+h*0.3, s);
            drawFunctionInvert(ctx, x+w/2, y+h*0.7, s);
        }

        // draw the small suit in the corners of the cards (next to the face
        // value)
        drawFunction(ctx, x+w*0.12, y+h*0.22, s/2);
        drawFunctionInvert(ctx, x+w*0.88, y+h*0.78, s/2);

        // get the text string to use for face value; replace facecards with
        // the appropriate number
        var text = String(number);
        if (number == 1) {text = "A";}
        else if (number == 11) {text = "J";}
        else if (number == 12) {text = "Q";}
        else if (number == 13) {text = "K";}
        
        // draw the number/face card letter on the card
        ctx.font = String(Math.floor(s*1.5)) + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, x+w*0.12, y+h*0.16);
        ctx.save();
        ctx.rotate(Math.PI);
        ctx.fillText(text, -x-w*0.88, -y-h*0.84);
        ctx.restore();
    }

    /* drawCardBack
        draw the back of a card to the javascript canvas

        value: the unique identifier for a card between 1 and 52
            TODO -- provide reference to description of card values
            Note: this doesn't matter for drawing the back of the card
        ctx: the 2d context of the target javascript canvas
        x: x coordinate of the center of the card (in pixels)
        y: y coordinate of the center of the card (in pixels)
        w: the width of the card in pixels
        h: the height of the card in pixels
        shadow: the intensity of the shadow blur to draw around the card
    */
    function drawCardBack(value, ctx, x,y, w,h, shadow) {

        // set the background and shadow parameters
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = shadow;
        ctx.shadowColor = "black";

        // the radius for rounding the edges of the card
        var r = w / 10;
        
        // draw the outline of a card and fill it in
        ctx.beginPath();
        ctx.arc(x+r,y+r, r, Math.PI, 3*Math.PI/2);
        ctx.arc(x+w-r,y+r, r, 3*Math.PI/2, 2*Math.PI);
        ctx.arc(x+w-r,y+h-r, r, 0, Math.PI/2);
        ctx.arc(x+r,y+h-r, r, Math.PI/2, Math.PI);
        ctx.fill();

        // set the blue color of the interior of the card
        ctx.fillStyle = "#6600ff";
        ctx.shadowBlur = 0;

        // calculate the dimensions of the inner blue rectangle
        var s = w * 0.06;
        var x_s = x + s;
        var y_s = y + s;
        var w_s = w - 2 * s;
        var h_s = h - 2 * s;

        // draw the inner blue rectangle
        ctx.fillRect(x_s, y_s, w_s, h_s);

        // draw the criss-cross pattern on the back of the cards
        const n = 10; // the number of cross hatches
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
    }

    /* drawCard
        draw a card with specified rotations

        ctx: the 2d context of the target javascript canvas
        value: the unique identifier for a card between 1 and 52
            TODO -- provide reference to description of card values
        x: x coordinate of the center of the card (in pixels)
        y: y coordinate of the center of the card (in pixels)
        rot: the rotation of the card counterclockwise in radians, where zero
        means orientated upwards
        flip: the amount the card has been flipped in radians; zero is face up,
        pi is upside down (as in seeing the back of the card)
        height: the height above the playing surface (this affects the intensity
        of the drop shadow)
    */
    function drawCard(ctx, val, x,y, rot, flip, height) {
        ctx.save(); // save the pre-transformation canvas context
    
        // card dimensions
        var w = CARD_WIDTH;
        var h = CARD_HEIGHT;
        
        // apply the rotation and flip as canvas transformations
        ctx.translate(x,y);
        ctx.rotate(rot);
        ctx.scale(Math.cos(flip), 1.0)

        // draw the card; determine which side to display based on the value of
        // flip
        if (Math.cos(flip) > 0) {
            drawCardFront(val, ctx, -w/2, -h/2, w, h, height / Math.sqrt(1 - Math.sin(flip) * Math.sin(flip) ));
        }
        else {
            drawCardBack(val, ctx, -w/2, -h/2, w, h, height / Math.sqrt(1 - Math.sin(flip) * Math.sin(flip) ));
        }
    
        ctx.restore(); // restore the pre-transformation context
    }
// CARD DRAING FUNCTIONS -- END //

/* getMousePos
    get the position of the mouse relative to the top left corner of a canvas

    canvas: the javascript canvas
    evt: a canvas mouse event

    return a dictionary with keys x and y
*/
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/* CardManager
    Manage the visual layout of cards; a CardManager can contain multiple
    card stacks and provides methods for passing cards between stacks
*/
class CardManager {
    /* constructor
        create a CardManager

        canvas: the background javascript canvas that the CardManager draws to
            this is where elements that are mostly static are drawn
        fCanvas: the foreground canvas; this should have the same location as
        the background canvas but have a higher z index
            this is where dynamic (actively animated) elements are drawn
        width: the desired width of the canvas (in pixels)
        height: the desired height of the canvas (in pixels)
    */
    constructor(canvas, fCanvas, width, height) {
        // get the context of the background canvas and set its dimensions
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;

        // get the context of the foreground canvas and set its dimensions
        this.fCanvas = fCanvas;
        this.fctx = fCanvas.getContext("2d");
        this.fctx.canvas.width = width;
        this.fctx.canvas.height = height;

        // save the dimensions of the card manager
        this.width = width;
        this.height = height;

        // set the global card dimensions
        var L = Math.min(width, height);
        CARD_HEIGHT = Math.min(300, L / 2.2 - 60);
        CARD_WIDTH = CARD_HEIGHT * 2 / 3;

        this.lastElementId = 0;
        this.elements = [];
        this.foregroundCards = [];

        // install even listeners for mouse actions
        fCanvas.addEventListener('mousemove', function(evt) {
            drawManager.mouseMoveHandler(evt);
        }, false);
        fCanvas.addEventListener('click', function(evt) {
            drawManager.mouseClickHandler(evt);
        }, false);

        this.currentMouseOver = null;
    }

    /* reset
        clear all the elements from the CardManager (and clear the canvas)
    */
    reset() {
        this.elements = [];
        this.foregroundCards = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /* mouseMoveHandler
        handle a mouse motion on the CardManager's canvas

        evt: the generated javascript event
    */
    mouseMoveHandler(evt) {
        // find what element the mouse is over (if any)
        var pos = getMousePos(this.fCanvas, evt);
        var foundElem = null;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].elem.coordsIn(pos.x, pos.y)) {
                foundElem = this.elements[i];
                break;
            }
        }

        // based on the currently hovered element and the last hovered element,
        // decide which handlers should be called of mouseEnter, mouseExit, and
        // mouseMove
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

        // save the new moused-over element
        this.currentMouseOver = foundElem;
    }

    /* mouseMoveHandler
        handle a mouse click on the CardManager's canvas

        evt: the generated javascript event
    */
    mouseClickHandler(evt) {
        // find what element the mouse is over (if any)
        var pos = getMousePos(this.fCanvas, evt);
        var foundElem = null;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].elem.coordsIn(pos.x, pos.y)) {
                foundElem = this.elements[i];
                break;
            }
        }

        // if an element was identified, call its mouse click function
        if (foundElem) {
            foundElem.elem.mouseClick();
        }
    }
    
    /* addElement
        add an element to the CardManager

        elem: an element that implements the following methods:
            coordsIn(x, y) => bool
            mouseEnter(x, y)
            mouseExit(x, y)
            mouseMove(x, y)
            mouseClick()
            draw()

            Example classes that implement this:
                CardStack
        
        returns an element id, which is unique for this CardManager
    */
    addElement(elem) {
        // get the next sequential id for the element
        var elemId = this.lastElementId;
        this.lastElementId++;

        // add the element to the internal element list
        this.elements.push({
            id: elemId,
            elem: elem
        });

        return elemId;
    }

    /* draw
        redraw the CardManager

        return whether any element requested the scene to be redrawn again (ie
        whether there are outstanding animations that need to finish)
    */
    draw() {
        // clear the list of foregroundCards; the elements are responsible for
        // adding cards back to this list when they are called
        this.foregroundCards = [];
        this.fctx.clearRect(0, 0, this.width, this.height);

        // call each element's draw function; record in redraw if any element 
        // requests a redraw
        var redraw = false;
        for (var i = 0; i < this.elements.length; i++) {
            redraw |= this.elements[i].elem.draw();
        }

        // any cards that the elements requested to be draw in the foreground
        // are now handled
        for (var i = 0; i < this.foregroundCards.length; i++) {
            this.foregroundCards[i].draw(this.fctx);
        }

        return redraw;
    }

    /* createCircularStacks
        create a series of stacks around the outside edge of the draw area

        N: number of stacks to create
        centerStackIndex: the index of the stack that should be placed in the
        bottom center of the screen; if not specified, it is set at zero (ie
        the first stack)

        return an array of the CardStack objects created
    */
    createCircularStacks(N, centerStackIndex) {
        // set cardStackIndex to zero if not specified
        if (!centerStackIndex) {
            centerStackIndex = 0;
        }

        // array of stacks to be returned
        var stacks = [];

        // the dimensions of the draw area
        var W = this.width;
        var H = this.height;

        // create each stack
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

    /* createCenterStack
        create a CardStack in the center of the draw area

        return the CardStack object that was created
    */
    createCenterStack() {
        var W = this.width;
        var H = this.height;

        return new CardStack(this, W / 2, H / 2, 0);
    }
}

/* moveNormal
    move processing function for a normal card animation, one where the card
    moves from one location to another without changing its flip orientation

    info: a dictionary describing the move parameters

    progress: a float between 0 and 1 describing the relative position in time
    that the animation is at

    return an array describing the positioning of the card at this point in the
    animation; it should have the form [x, y, rotation, height, flip]
*/
function moveNormal(info, progress) {

    // p is the progress, but transformed according to a cosine curve so that
    // the card accelerates at the start and decelerates at the end
    var p = (Math.cos(progress * Math.PI) + 1) / 2;

    // calculate the card location based on the animation parameters
    var x = info.moveDestX - (info.moveDestX - info.moveSourceX) * p;
    var y = info.moveDestY - (info.moveDestY - info.moveSourceY) * p;
    var rot = info.moveDestAngle - (info.moveDestAngle - info.moveSourceAngle) * p;
    var flip = info.moveDestFlip - (info.moveDestFlip - info.moveSourceFlip) * p;
    var height = 10;

    return [x,y,rot,height,flip];
}

/* moveNormalFlip
    move processing function for a normal flip card animation, one where the
    card moves from one location to anotherand flips its orientation

    info: a dictionary describing the move parameters

    progress: a float between 0 and 1 describing the relative position in time
    that the animation is at

    return an array describing the positioning of the card at this point in the
    animation; it should have the form [x, y, rotation, height, flip]
*/
function moveNormalFlip(info, progress) {
    // p is the progress, but transformed according to a cosine curve so that
    // the card accelerates at the start and decelerates at the end
    var p = (Math.cos(progress * Math.PI) + 1) / 2;

    // calculate the card location based on the animation parameters
    var x = info.moveDestX - (info.moveDestX - info.moveSourceX) * p;
    var y = info.moveDestY - (info.moveDestY - info.moveSourceY) * p;
    var rot = info.moveDestAngle - (info.moveDestAngle - info.moveSourceAngle) * p;
    var flip = info.moveSourceFlip + (1 - p) * Math.PI;
    var height = 10;

    return [x,y,rot,height,flip];
}

/* Card
    Describes a Card and its current visual state; provides moethods for
    displaying the card
*/
class Card {
    /* constructor
        create a Card object

        value: the value describing the suit and face value of the card
    */
    constructor(value) {
        this.value = value;
        
        // initialize the display parameters with default values
        this.x = 0;
        this.y = 0;
        this.rot = 0;
        this.flip = 0;
        this.height = 5;

        // initialize the animation parameters with default values
        this.moveSourceX = 0;
        this.moveSourceY = 0;
        this.moveDestX = 0;
        this.moveDestY = 0;
        this.moveLength = 0;
        this.moveProgress = 0;
        this.moveOrigin = null;
        this.moveTarget = null;
    }

    /* setView
        set the display parameters of the card

        x: x coordinate of the center of the card (in pixels)
        y: y coordinate of the center of the card (in pixels)
        rot: the rotation of the card counterclockwise in radians, where zero
        means orientated upwards
        flip: the amount the card has been flipped in radians; zero is face up,
        pi is upside down (as in seeing the back of the card)
        height: the height above the playing surface (this affects the intensity
        of the drop shadow)
    */
    setView(x,y, rot, flip, height) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.flip = flip;
        this.height = height;
    }

    /* setOrientation
        set the orientation of the card as either up (value showing) or down
        (back of the card showing)

        orientation: a string that is either "up" or "down"
    */
    setOrientation(orientation) {
        // set the flip variable based on the orientation string
        if (orientation == "up") {
            this.flip = 0;
        }
        else if (orientation == "down") {
            this.flip = Math.PI;
        }
    }

    /* setMove
        set the animation parameters of a card

        source: the current position parameters of the card
        destination: the tager position pamaters of the card
        moveFunction: a move animation function of the form
            (info, progress) => [x,y,rot,height,flip]
    */
    setMove(source, destination, moveFunction) {
        // set source display parameters
        this.moveSourceX = this.x;
        this.moveSourceY = this.y;
        this.moveSourceAngle = this.rot;

        // set destination move parameters
        this.moveDestX = destination.x;
        this.moveDestY = destination.y;
        this.moveDestAngle = destination.angle;
        this.moveDestFlip = this.flip;

        // set animation time parameters
        this.moveStart = Date.now();
        this.moveLength = 300;
        this.moveOrigin = source;
        this.moveTarget = destination;
        this.moveSourceFlip = this.flip;

        // set the animation function
        this.moveFunction = moveFunction;

        // adjust the destination rotation angle to minimize the rotation of the
        // animation
        if (Math.abs(this.moveDestAngle - this.moveSourceAngle) > Math.PI) {
            if (this.moveDestAngle > this.moveSourceAngle) {
                this.moveDestAngle -= 2 * Math.PI;
            }
            else {
                this.moveDestAngle += 2 * Math.PI;
            }
        }
    }

    /* setDistantion
        change the destination location of a card animation

        x: the new x-coordinate of the destination
        y: the new y-coordinate of the destination
    */
    setDestination(x,y) {
        this.moveDestX = x;
        this.moveDestY = y;
    }

    /* move
        move a card that is currently animating

        ctx: unused paramter -- TODO -- remove

        return a boolean of whether the animation has completed
    */
    move(ctx) {
        // compute how far the animation is through its completion; clamp it
        // to a maximum of one
        var progress = (Date.now() - this.moveStart) / this.moveLength;
        if (progress > 1) {
            progress = 1;
        }
        
        // update the cards display parameters based on its animation function
        var pos = this.moveFunction(this, progress);
        this.x = pos[0];
        this.y = pos[1];
        this.rot = pos[2];
        this.height = pos[3];
        this.flip = pos[4];

        // check whether the animation has completed
        if (progress >= 1.0) {
            return true;
        }
        return false
    }

    /* draw
        redraw the card

        ctx: the canvas 2d context that the card should be drawn on
    */
    draw(ctx) {
        drawCard(ctx, this.value, this.x, this.y, this.rot, this.flip, this.height);
    }
}

/* CardStack
    An object that keeps track of a stack of cards, handles UI inputs on that
    stack, and draws the stack to the screen
*/
class CardStack {
    /* constructor
        create a CardStack object

        drawArea: a CardManager object that the CardStack object should be added
        as an element of
        x: the center x coordinate of the bottom card of the stack
        y: the center y coordinate of the bottom card of the stack
        angle: the counter clockwise rotation in radians from being angled
        straight up and down on the screen
    */
    constructor(drawArea, x, y, angle) {
        // store the parameters
        this.drawArea = drawArea;
        this.x = x;
        this.y = y;
        this.angle = angle;

        // the list of cards in the stack
        this.cards = [];

        // add to the CardManager and record its id
        this.id = drawArea.addElement(this);

        // variables marking whether the background, foreground, or both need
        // to be redrawn
        this.waitingRedrawBackground = false;
        this.waitingRedrawForeground = false;
        this.waitingRedrawAll = false;

        // whether the stack's UI state is active (being hover over)
        this.active = false;

        // the modifiable mouse event handlers
        this._mouseEnterFunc = null;
        this._mouseExitFunc = null;
        this._mouseClickFunc = null;

        // additional UI elements: background color, overlay text, and whether
        // to display the overlay text
        this.backgroundColor = null;
        this.text = null;
        this.displayText = false;
    }

    /* mouseEnter
        handler function for when the mouse enters the CardStack's bounding box

        x: the x coordinate of the mouse relative to the draw area
        y: the y coordinate of the mouse relative to the draw area
    */
    mouseEnter(x,y) {
        if (this._mouseEnterFunc) {
            this._mouseEnterFunc(this, x, y);
        }
    }

    /* mouseExit
        handler function for when the mouse leaves the CardStack's bounding box

        x: the x coordinate of the mouse relative to the draw area
        y: the y coordinate of the mouse relative to the draw area
    */
    mouseExit(x,y) {
        if (this._mouseExitFunc) {
            this._mouseExitFunc(this, x, y);
        }
    }

    /* mouseMove
        handler function for when the mouse moves inside the CardStack's
        bounding box

        x: the x coordinate of the mouse relative to the draw area
        y: the y coordinate of the mouse relative to the draw area
    */
    mouseMove(x,y) {
        // TODO -- add a _mouseMoveFunction for completeness
    }

    /* mouseClick
        handler function for when the mouse is clicked on the CardStack
    */
    mouseClick() {
        if (this._mouseClickFunc) {
            this._mouseClickFunc(this);
        }
    }

    /* addCard
        add a card to the top of the stack

        card: a Card object
        type:
    */
    addCard(card, type) {
        // add the card to the card list and signifiy that the stack needs
        // to be redrawn
        this.cards.push({
            type: type,
            card: card
        });
        this.waitingRedrawAll = true;
    }

    /* addCardBottom
        add a card to the bottom of the stack

        card: a Card object
        type: a string representing the card's state: the options are
            "instack" -- card is in the stack
            "incoming" -- card is animating into the stack
            "outgoing" -- card is outgoing from the stack
    */
    addCardBottom(card, type) {
        // add the card to the card list and signifiy that the stack needs
        // to be redrawn
        this.cards.splice(0,0, {
            type: type,
            card: card
        });
        this.waitingRedrawAll = true;
    }

    /* generate52CardDeck
        initialize a CardStack containing all 52 cards in order
    */
    generate52CardDeck() {
        // create all 52 cards, set their state to "in-stack"
        this.cards = [];
        for (var i = 0; i < 52; i++) {
            var card = new Card(52 - i);
            this.addCard(card, "in-stack");
        }
    }

    /* orient
        set the direction of all the cards in the stack to either up or down
        facing

        dir: a string of either "up" and "down"
    */
    orient(dir) {
        // set the flip orientation of each card based on the input dir
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

    /* sendCard
        send a card of a particular value to another stack

        value: the value (representing the suit and face value) of the card to
        send; if this value is not found in the stack, nothing will happend
        destination: the destination CardStack
        moveFunc: the animation function to use
        destLoc: the locaiton in the target card stack; the value should be
            either "top" or "bottom"
    */
    sendCard(value, destination, moveFunc, destLoc) {
        // check if the card is in the stack -- if it's not, ignore the command
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

        // set the card's animation paramaters, and add the card to the
        // destination stack as an "incoming" card
        this.cards[index].card.setMove(this, destination, moveFunc);
        if (!destLoc || destLoc == 'top') {
            destination.addCard(this.cards[index].card, "incoming");
        }
        else if (destLoc == 'bottom') {
            destination.addCardBottom(this.cards[index].card, "incoming");
        }

        // remove the card from the card list
        this.cards.splice(i, 1);

        // indicate that the card stack needs to be redrawn
        this.waitingRedrawAll = true;
        globalRedrawTrigger = true;
    }

    /* coordsIn
        return whether coordinates are in the CardStack's bounding box

        x: the x-coordinate of the draw area to check
        y: the y-coordinate of the draw area to check

        return a boolean value of whether x and y are in the CardStack
    */
    coordsIn(x,y) {
        // remap x and y to be relative to the center of the card stack
        x -= this.x;
        y -= this.y;

        // adjust for the rotation of the card stack
        var newX = x * Math.cos(-this.angle) - y * Math.sin(-this.angle);
        var newY = x * Math.sin(-this.angle) + y * Math.cos(-this.angle);

        // check if the coordinates are within the boundaries of the card stack
        if (newX > - CARD_WIDTH / 2 - 15
            && newX < CARD_WIDTH / 2 + 35
            && newY > - CARD_HEIGHT / 2 - 45
            && newY < CARD_HEIGHT / 2 + 15)
        {
            return true;
        }
        return false;
    }

    /* setBackground:
        set the background color of the card stack

        color: a valid CSS color string
    */
    setBackground(color) {
        // set the color and indicate that the stack needs to be redrawn
        this.backgroundColor = color;
        this.waitingRedrawBackground = true;
    }

    /* drawText
        draw overlay text on a CardStack

        text: the string of text to draw
    */
    drawText(text) {
        // get canvas context
        var ctx = this.drawArea.ctx;

        // get canvas coordinates
        var W = CARD_WIDTH + 46;
        var X = -CARD_WIDTH / 2 - 13;
        var Y = -CARD_HEIGHT * 0.25;
        var XCenter = X + W / 2;

        ctx.save(); // save pre-transformation context

        // set canvas transformation so that we can draw as if the card is
        // oriented normally around the origin
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // get the text width -- shrink the text if it overflows the font size
        ctx.font = '30px Arial';
        var w = ctx.measureText(text).width;
        var fontSize = 30;
        if (w > W * 0.8) {
            fontSize = Math.floor(30 * (W * 0.8) / w);
            ctx.font = String(fontSize) + "px Arial";
        }

        // get the possibly adjusted text width
        w = ctx.measureText(text).width;

        // draw the text
        ctx.fillStyle = 'rgba(40,40,40,0.7)';
        ctx.fillRect(X, Y - 20, W, 40);
        ctx.fillStyle = 'white';
        ctx.fillText(text, XCenter - w / 2, Y + fontSize * 0.4);

        ctx.restore(); // restore pre-transformation context
    }

    /* drawBackground
        draw the card stack pieces that should go on the background canvas of
        draw area
    */
    drawBackground() {

        // get the canvas context
        var ctx = this.drawArea.ctx;

        ctx.save();  // save pre-transformation context

        // set canvas transformation so that we can draw as if the card is
        // oriented normally around the origin
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // draw the background color, or erase the rectangle if no color is
        // specified
        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(- CARD_WIDTH / 2 - 15 + 2, - CARD_HEIGHT / 2 - 45 + 2, CARD_WIDTH + 50 - 4, CARD_HEIGHT + 60 - 4);
        }
        else {
            ctx.clearRect(- CARD_WIDTH / 2 - 15, - CARD_HEIGHT / 2 - 45, CARD_WIDTH + 50, CARD_HEIGHT + 60);
        }
        ctx.restore();  // restore pre-transformation context

        // the backround won't need to be redrawn until another canvas event
        // changes this variable
        this.waitingRedrawBackground = false;

        // get the top card to draw in the background, and find the cutoff card
        // (a max of 5 cards are drawn on the background canvas -- nFound keeps
        // track of how many cards we've found so we can cut off when we hit 5)
        var topCard = -1;
        var cutoff = this.cards.length;
        var nFound = 0;
        // start at the top of the stack and iterate to the bottom
        for (var i = this.cards.length - 1; i >= 0; i--) {
            cutoff = i;

            // if the card is in the stack, count it as a card that will be
            // drawn in the bacground
            if (this.cards[i].type == "in-stack") {
                // if a top card has not been found yet, set this one as the
                // top
                if (topCard == -1) {
                    topCard = i;
                }
                nFound++;
            }

            // break when 5 valid background cards have been found
            if (nFound >= 5) {
                break;
            }
        }

        var cardOff = 5; // offset (pixels) of each stacked card
        var shadow = 10; // size (pixels) of the card's box shadow

        // draw each card from the bottom up
        for (var i = 0; i < this.cards.length; i++) {
            // the offset of the card from it's normal location; applied to the
            // top 5 cards in the stack
            var o = Math.max(0, Math.min(4, (i - cutoff)) );

            // draw only cards that are in the stack
            if (this.cards[i].type == "in-stack") {

                // find the center of the card
                var x = this.x + o * cardOff * (Math.cos(this.angle) + Math.sin(this.angle));
                var y = this.y - o * cardOff * (Math.cos(this.angle) - Math.sin(this.angle));

                // when the deck is active, prop the top card an extra 10 pixels
                // forward to cue the user that they're hovering on the deck
                if (this.active && topCard == i) {
                    y -= 10 * Math.cos(this.angle);
                    x += 10 * Math.sin(this.angle);
                }

                // move the card to the desired location
                this.cards[i].card.setView(x, y, this.angle, this.cards[i].card.flip, shadow);

                // only draw the card if it beyond the cutoff (in the top five
                // cards in the stack)
                if (i >= cutoff) {
                    this.cards[i].card.draw(this.drawArea.ctx);
                }
            }
            else if (this.cards[i].type == "incoming") {
                // do nothing for now;
            }
            else if (this.cards[i].type == "outgoing") {
                // do nothing for now;
            }
        }
        
        // draw the text if that property is currently enabled
        if (this.text && this.displayText) {
            this.drawText(this.text);
        }
    }

    /* drawForeground
        draw all elements of the card stack that should appear on the foreground
        canvas (generally all cards that are currently in animation)
    */
    drawForeground() {
        // get the canvas context
        var ctx = this.drawArea.fctx;

        // the foreground won't need to be redrawn unless something is still
        // animating (which is taken care of later in the function)
        this.waitingRedrawForeground = false;

        // Identify the cutoff for the top 5 cards since these are offset
        // slightly and will need different animation destinations
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

        var cardOff = 5; // offset (pixels) of each stacked card
        var shadow = 10; // size (pixels) of the card's box shadow

        // draw each card that is incoming 
        for (var i = 0; i < this.cards.length; i++) {
            // adjust for how the top 5 cards are offset in the stack
            var o = Math.max(0, Math.min(4, (i - cutoff)) );

            if (this.cards[i].type == "in-stack") {
                // ignore
            }

            // animate the incoming cards
            else if (this.cards[i].type == "incoming") {
                // determine the card's destination
                var x = this.x + o * cardOff * (Math.cos(this.angle) + Math.sin(this.angle));
                var y = this.y - o * cardOff * (Math.cos(this.angle) - Math.sin(this.angle));

                // adjust the card's destination in case the stack
                // characteristics have changed
                this.cards[i].card.setDestination(x,y);
                
                // if the card is not done animating, set that the another
                // foreground raw is waiting
                if (!this.cards[i].card.move(ctx)) {
                    this.waitingRedrawForeground = true;
                }

                // if the animation is done, change the card's status to 
                // "in-stack"
                else {
                    this.cards[i].type = "in-stack";
                    this.waitingRedrawBackground = true;
                }

                // add the card to the foreground cards list so that it will get
                // displayed when the CardManager object redraws
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

    /* draw
        draw function for CardStack

        return a boolean of whether another redraw should occur
    */
    draw() {
        // translate a redraw all request into a redraw request for both the 
        // foreground and the background
        if (this.waitingRedrawAll) {
            this.waitingRedrawBackground = true;
            this.waitingRedrawForeground = true;
            this.waitingRedrawAll = false;
        }

        // redraw the foreground and the background if each is requested
        if (this.waitingRedrawBackground) {
            this.drawBackground();
        }
        if (this.waitingRedrawForeground) {
            this.drawForeground();
        }

        // return whether another background or foreground redraw got requested
        // in the process of this last drawing
        return this.waitingRedrawBackground | this.waitingRedrawForeground;
    }
}

/* whether the drawManager redraw has been enabled */
var globalRedrawTrigger = true;

/* animationFunction
    the animation loop that drives redrawing the game canvas
*/
function animationFunction() {
    // redraw the drawManager
    if (globalRedrawTrigger && drawManager) {
        globalRedrawTrigger = drawManager.draw();
    }

    // request drawing the next frame
    requestAnimationFrame(animationFunction);
}
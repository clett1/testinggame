/**
 * @constructor
 * @param {props} An object containing properties for the actor
 */
function Game(canvas) {
  //Setup our fields
  this.context = canvas.getContext("2d");
  this.dragFocus = null;
  this.width = canvas.width;
  this.height = canvas.height;
  this.grabPointX = 0;
  this.grabPointY = 0;
  this.actors = [];
  
    //Listen for mouseDown Event
    canvas.addEventListener("mousedown", this.pointDispatch.bind(this));
    
    //listen for mouseup event. 
    //if return is false, 
    canvas.addEventListener("mouseup", (function(event){      
        if (!this.dispatchDragFocus(event)){
            this.pointDispatch(event);
    }
    }).bind(this));
    
   canvas.addEventListener("mousemove", (function(event){      
        if (!this.dispatchDragFocus(event)){
            this.pointDispatch(event);
    }
    }).bind(this));
                            
   
}


/**
 * Adds a new actor to the game. Each actor must be an independent object 
 * (new * object). Make sure to properly clone actors if adding multiple 
 * of the same type.
 * @param {Actor} actor to add to the game.
 */
Game.prototype.addActor = function(actor) {
  this.actors.push(actor);
  actor.parent = this;
}

/**
 * Find and return the list of actors whose bounds overlap the given
 * rectangular area.  The actors (if any) in the list should be in reverse
 * drawing order. That is, the actors drawn later should appear earlier in the
 * list.
 * @param {Integer} left position of the rectangle 
 * @param {Integer} top position of the rectangle
 * @param {Integer} width of the rectangle
 * @param {Integer} height of the rectangle
 * @return {Array} A list of actors in reverse drawning order that are under 
 */
Game.prototype.actorsUnder = function(left, top, width, height) {
    

    
    //array to hol actors to be returned
    var overlapActors = [];

    //set rectangle values for x1, x2, y1, y2
    var rectX1 = left;
    var rectX2 = left + width;
    var rectY1 = top;
    var rectY2 = top + height;
    
    //initalize actors values for x1, x2, y1, y2
    var actorX1 = 0;
    var actorX2 = 0;
    var actorY1 = 0;
    var actorY2 = 0;
    //This block of code iterates through all actors of the game, and checks if they are within the bounds of the rectangle   
    for (var i = 0; i < this.actors.length; i++) {
            
        actorX1 = this.actors[i].x;
        actorX2 = actorX1 + 40;
        actorY1 = this.actors[i].y;
        actorY2 = actorY1 + 40;
        
        if(rectX1 > actorX2 ||  rectX2 < actorX1 || rectY1 > actorY2 || rectY2 < actorY1) {
            //There is no overlap

        } else {
            //There is an overlap of regions, add this actor to the array of actors to return
            overlapActors.push(this.actors[i]);
        }
    }
    
    
    var reverseActors = overlapActors.reverse();    
    return reverseActors;
  
};

/**
 * Dispatch the given event to one actor under the given x,y position. When
 * multiple actors are under the position we offer it to them in reverse
 * drawing order. As soon as a actor takes the event (returns true from its
 * deliverEvent() method) we stop offering it to others so that only one actor
 * gets the event.
 * @param {Event} Javascript event object (from an event handler)
 * @return {boolean} True if the event was consumed, false if it was not
 */
Game.prototype.pointDispatch = function(event) {
    
    var savedActors = [];
    
    //Iterate through all actors to determine if any are underneath the point of the mousedown
    for(var i = 0; i < this.actors.length; i++) {

        var actorX1 = this.actors[i].x;
        var actorX2 = actorX1 + this.actors[i].width;
        var actorY1 = this.actors[i].y;
        var actorY2 = actorY1 + this.actors[i].height;
        
        //if mouosedown's coord are within actor's area, offer this event
        if(actorX1 < event.offsetX && actorX2 > event.offsetX && actorY1 < event.offsetY && actorY2 > event.offsetY) {
            //This actor is under point. Push this actor into array of actors to offer event
            savedActors.push(this.actors[i]); 
        } 
    }
    var offerToActors = savedActors.reverse();
    
    //Iterate through reversed array and offer this event to these actors
    for(var k = 0; k < offerToActors.length; k++) {
        
        if(offerToActors[k].deliverEvent(event)){
            return true;
        }
    }
    
    return false;
}


/**
 * Dispatch the given event to one actor whose bounds overlap the given
 * rectangle. When multiple actors are overlapped we offer it to them in
 * reverse drawing order. As soon as a actor takes the event (returns true from
 * its deliverEvent() method) we stop offering it to others so that only one
 * actor gets the event.
 * @param {Object} Javascript object with the following properties
 *  - top: top coordinate of the bounding box
 *  - left: left coordinate of the bounding box
 *  - width: Width of the bounding box
 *  - height: height of the bounding box
 * @param {Event} Javascript event object (from an event handler)
 * @return {boolean} True if the event was consumed, false if it was not
 */
Game.prototype.areaDispatch = function(area, event) {
    
    var allActorsUnder = [];
    
    allActorsUnder = this.actorsUnder(area.left, area.top, area.width, area.height);
    
    if(allActorsUnder == null) {
        //No actors are within the click region
        return false;
    } else {
        //There are actors in the click region. Try and dispatch events to them
                //Iterate through reversed array and offer this event to these actors
        for(var k = 0; k < allActorsUnder.length; k++) {
        
            consumedEvent = allActorsUnder[k].deliverEvent(event);
            
            //event is consumed
            if(consumedEvent){
                return true;
            }
    
        }
        
        //No actors consumed
        return false;
        
    }
        
}

/**
 ￼* Dispatch the given event directly to the evt) given actor
 * @param {Event} Javascript event object (from an event handler)
 * @param {Actor} Actor to dispatch the event to
 * @return {boolean} True if the event was consumed, false if it was not
 */
Game.prototype.directDispatch = function(event, actor) {
  //TODO
     return actor.deliverEvent(event); 
}

/**
 * Dispatch the given event to all actors in reverse drawing order. This
 * dispatch does not stop after the first actor accepts the event, but instead
 * always continues through the list of all actors
 * @param {Event} Javascript event object (from an event handler)
 * @return {boolean} True if the event was consumed by any of the actors
 */
Game.prototype.dispatchToAll = function(event) {
    var consumed = false;
    for(var i  = 0; i < this.actors.length; i++) {
        
        if(this.actors[i].deliverEvent(event)){
            consumed = true;
        }   
    }
    return consumed;
    
}

/**
 * Attempt to dispatch the given event to all actors in reverse drawing order
 * stopping as soon as some actor takes the event (returns true from its
 * deliverEvent() method).
 * @param {Event} Javascript event object (from an event handler)
 * @return {boolean} True if the event was consumed by one of the actors, false
 *  if it was not
 */
Game.prototype.dispatchTryAll = function(event) {
  
    var allActorsReverse = this.actors.reverse();
    
    for(var i = 0; i < allActorsReverse.length; i++) {
        if(allActorsReverse[i].deliverEvent(event))
            return true;
    }
    
    //No actors consumed event in for loop
    return false;
}

/**
 * Dispatch the given event to the current drag focus object (if any). If there
 * is no current drag focus or the current drag focus object rejects the event
 * (returns false from its deliverEvent() method), this method returns false.
 * All events which contain an x,y position will have their x,y position
 * adjusted by (-grabPointX, -grabPointY) prior to being delivered.  In this
 * way the position indicated in the event will reflect where the top-left
 * corner of the dragged actor should be placed, rather than where the cursor
 * was (which will normally be inside the actor; specifically at a distance of
 * (grabPointX, grabPointY) from the top-left of the object).
 * @param {Event} Javascript event object (from an event handler)
 * @return {boolean} True if the event was consumed, false if it was not
 */

Game.prototype.dispatchDragFocus = function(event) {
  //TODO
    
    if(this.dragFocus == null) {
        //No current drag focus, reject events    
        return false;
    } else {
        //Create duplicate event
        
        var newEvent = {type: "dragmove", offsetX: event.offsetX, offsetY: event.offsetY};
        
        if(event.type == "mouseup"){
            newEvent.type = "dragend";
        }
        
        newEvent.offsetX = event.offsetX - this.grabPointX;
        newEvent.offsetY = event.offsetY - this.grabPointY;
        
        var actor = this.dragFocus;
        
        return actor.deliverEvent(newEvent);
    }
    
}

/**
 * This method is responsible for drawing all of the actors
 */
Game.prototype.onDraw = function() {
    
    //This block of code iterates through all actors of the game, and draws them 
    
    this.context.clearRect(0, 0, this.width, this.height);
    
    for (var i = 0; i < this.actors.length; i++) {

        this.actors[i].draw(this.context);
        
    }
    


}

/**
 * Provided methods below this line
 */

/**
 * Switch the current drag focus to the given actor.  The offset values
 * given indicate where inside the given actor the cursor was when the
 * drag was started.  This offset will be applied (negatively) to all 
 * drag events later delivered.  This will allow each of those events to 
 * reflect where the top-left corner of the dragged actor should be 
 * placed, rather than where the cursor currently is.
 * 
 * @param {Actor} actor that is to be the new drag focus.
 * @param {Integer} x distance from the left of the actor that the cursor
 *              was when the drag was started.
 * @param {Integer} y distance from the top of the actor that the cursor
 *              was when the drag was started.
 */
Game.prototype.requestDragFocus = function(actor, x, y) {
  this.dragFocus = actor;
  this.grabPointX = x;
  this.grabPointY = y;
}

/**
 * Clear the current drag focus.
 */
Game.prototype.releaseDragFocus = function() {
  this.dragFocus = null; 
}

/**
 * Creates a new animation to run
 * @param {Actor} movingActor - actor that will be moving
 * @param {Actor} targetActer - target the movingActor will be going to
 * @param {String} endMessage that will be send to targetActor after the
 *  animation completes
 * @param {String} passoverMessage that will be sent to any interactors the
 * movingActor animates over
 * @param {Integer} duration in ms for the animation
 */
Game.prototype.newAnimation = function(movingActor, targetActor, endMessage, passoverMessage, duration) {
  var self = this;
  var start = Date.now();
  var target_x = targetActor.x + (targetActor.width / 2) - (movingActor.width / 2);
  var target_y = targetActor.y + (targetActor.height / 2) - (movingActor.height / 2);
  var x_inc = (target_x - movingActor.x) / duration;
  var y_inc = (target_y - movingActor.y) / duration;
  var x_init = movingActor.x;
  var y_init = movingActor.y;
  self.directDispatch({type: "animstart"}, movingActor)
  var animation = function (timestamp) {
    var curTime = Date.now() - start_time;
    var x = x_init + curTime * x_inc;
    var y = y_init + curTime * y_inc;
    self.directDispatch({type: "animmove", offsetX: x, offsetY: y}, movingActor);
    if (passoverMessage) {
      self.areaDispatch({
        top: y,
        left: x, 
        width: movingActor.width,
        height: movingActor.height
      }, {type: "message", message: passoverMessage});
    }
    if (curTime < duration) {
      window.setTimeout(animation,1);
    } else {
      self.directDispatch({type: "animend", offsetX: x, offsetY: y}, movingActor)
      self.sendMessage(targetActor, endMessage);
    }
  }
  var start_time = Date.now()
  window.setTimeout(animation, 1);
}

/**
 * Starts the game!
 */
Game.prototype.run = function() {
  //Send the init message to all of our actors
  this.dispatchToAll({type: "message", message: "$INIT$"});
  this.onDraw(); 
}

/**
 * Reports damage on a particular actors. Uses a fairly dumb redraw strategy,
 * however a smarter one could be implimented for bells and whistles
 * @param {Actor} an actor that has been damaged through state change
 */
Game.prototype.damageActor = function(actor) {
  this.onDraw(); 
}

/**
 * Sends a message to a particular actor
 * @param {Actor} actor to send the message to
 * @param {String} Message to send
 */ 
Game.prototype.sendMessage = function(actor, message) {
  this.directDispatch({type: "message", message: message}, actor) 
}

/**
 * @constructor
 * @param {props} An object containing properties for the actor
 */
function Actor(props) {
  this.parent = null; //Set in the game.addActor method
    
  //add additional properties for each eactor
    
    this.height = props.height;
    this.width = props.width;
    this.x = props.x;
    this.y = props.y;
    this.img = props.img;

};

/**
 * Sets the FSM for the particular actor. 
 * @param {Object} FSM object as detailed in the instructions
 */
Actor.prototype.setFSM = function(startState, fsm) {
  this.states = fsm;
  this.currentState = fsm[startState];
}

/**
 * Recieves an event from dispatch and transitions the FSM appropriately
 * @param {Event} The event object recieved, which includes certain information
 *  depending on the event type
 * @return {boolean} True if the event was consumed by the actor, false if it
 *  was not consumed
 */
Actor.prototype.deliverEvent = function(event) {
  //TODO    
    var transition = this.currentState[event.type];
    
    if (event.type == "mousemove"){
    }
    
    if (transition == undefined) {
        //Transition does not exist. Return false
        return  false;
        
    } else if (transition.predicate == undefined || transition.predicate(event, this)){
        //Predicate is undefined. Execute Action
        this.makeTransition(event, transition);
        
        return true;
        
    } 
    
    return false;
}

/**
 * Transitions the FMS for a particular transition and event
 * @param {Event} event object recieved, which includes certain information
 *  depending on the event type
 */
Actor.prototype.makeTransition = function(event, transition) {
  //TODO
    //do actions in the transition
    //what state is next?
    
    for (var a in transition.actions) {

        var params = {};
        
        if (transition.actions[a].params != undefined) {
            params = transition.actions[a].params;
        } 
        
        transition.actions[a].func(event, params, this);
        
        this.currentState = this.states[transition.endState];
    }
}

/**
 * Draws the actor on the canvas based on its parameters
 * @param {Context} The HTML5 canvas context object to be drawn on. 
 */
Actor.prototype.draw = function(context) {  
    
    if(this.img != null) {
     context.drawImage(this.img, this.x, this.y, this.width, this.height);

    }
    
}

// Provides the state machine descriptions and creates a new game

//First, load in all of our images
var loadCounter = 0;
var totalImg = 0;

var pig = new Image();
totalImg++;
pig.onload = function() {
  loadCounter++;
}
pig.src = 'pig.png';

var slingshot_image = new Image();
totalImg++;
slingshot_image.onload = function() {
  loadCounter++;
}
slingshot_image.src = 'slingshot.png';

var angry_bird = new Image();
totalImg++;
angry_bird.onload = function() {
  loadCounter++;
}
angry_bird.src = 'angry_bird.png';

var hurt_pig = new Image();
totalImg++;
hurt_pig.onload = function() {
  loadCounter++;
}
hurt_pig.src = 'hurt_pig.png';

var dead_pig = new Image();
totalImg++;
dead_pig.onload = function() {
  loadCounter++;
}
dead_pig.src = 'dead_pig.png';

var crosshair = new Image();
totalImg++;
crosshair.onload = function() {
  loadCounter++;
}
crosshair.src = 'crosshair.png';

var focusCrosshair = new Image();
totalImg++;
focusCrosshair.onload = function() {
  loadCounter++;
}
focusCrosshair.src = 'focusedCrosshair.png';

var ground = new Image();
totalImg++;
ground.onload = function() {
  loadCounter++;
}
ground.src = 'ground.png';

// function for randomly generating position
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Score multiplier, so you get bonuses for multiple hits
var multiplier = 1;

//Create our actors and their FSMs
var slingshot = new Actor({
  height: 50,
  width: 50,
  x: 0,
  y: 250,
  img: slingshot_image
}); 

var sight = new Actor({
  height: 50,
  width: 50,
  x: 175,
  y: 125,
  img: crosshair
}); 

var angry_birdBullet = new Actor({
  height: 25,
  width: 25,
  x: 45,
  y: 251,
  img: null
}); 

var target1 = new Actor({
  height: 50,
  width: 50,
  x: getRandomIntInclusive(0,350),
  y: getRandomIntInclusive(0,200),
  img: pig
}); 

var target2 = new Actor({
  height: 50,
  width: 50,
  x: getRandomIntInclusive(0,350),
  y: getRandomIntInclusive(0,200),
  img: pig
}); 

var target3 = new Actor({
  height: 50,
  width: 50,
  x: getRandomIntInclusive(0,350),
  y: getRandomIntInclusive(0,200),
  img: pig
}); 

var target4 = new Actor({
  height: 50,
  width: 50,
  x: getRandomIntInclusive(0,350),
  y: getRandomIntInclusive(0,200),
  img: pig
}); 

var ground_actor = new Actor({
 height: 10,
 width: 400,
    x: 0,
    y: 290,
    img: ground
});

slingshot.setFSM('start', { 
    'start': { }
});

ground_actor.setFSM('start', {
    'start': { }
});

targetFSM = {
    'ready': {
        'message': {
            predicate: function(event, actor){ 
                return event.message == "boom" },
            actions: [{ func: Actions.changeImg,
                        params: { img: hurt_pig }},
                      { func: function(event, params, actor){
                             var score_ele = document.getElementById("score"); var game_message = document.getElementById("gameMessage");
                             var score = parseInt(score_ele.innerHTML) + (100 * multiplier);
                            game_message.innerHTML = "Nice hit! +100";
                             score_ele.innerHTML = "" + score;},
                      },
                      { func: function(event, params, actor){
                            var coords =  { targetAbsoluteX: getRandomIntInclusive(0,350),
                                            targetAbsoluteY: getRandomIntInclusive(0,200) };
                            Actions.moveTo(event, coords, actor); 
                        }}
                      ],
            endState: 'injured'
        }
    },
    'injured': {
        'message': {
            predicate: function(event, actor){ 
                return event.message == "boom" },
            actions: [{ func: Actions.changeImg,
                        params: { img: dead_pig }},
                      { func: function(event, params, actor){
                             var score_ele = document.getElementById("score");
                             var game_message = document.getElementById("gameMessage");
                             var score = parseInt(score_ele.innerHTML) + (200 * multiplier);
                             score_ele.innerHTML = "" + score;
                             game_message.innerHTML = "You got it! +200";
                      },
                      },
                      { func: function(event, params, actor){
                          multiplier += 1;
                          setTimeout(function(){ 
                              multiplier -= 1;
                          }, 1000);
                          setTimeout(function(){ 
                              actor.parent.directDispatch({type: 'tick'}, actor);
                          }, 300);
                      }}],
            endState: 'dead_pig'
        }
    },
    'dead_pig': {
        'tick': {
            actions: [{ func: Actions.changeImg,
                        params: { img: pig }},
                      { func: function(event, params, actor){
                            var coords =  { targetAbsoluteX: getRandomIntInclusive(0,350),
                                            targetAbsoluteY: getRandomIntInclusive(0,200) };
                            Actions.moveTo(event, coords, actor); 
                        },
                      }],
            endState: 'ready'
        }
    }
};
target1.setFSM('ready', targetFSM);
target2.setFSM('ready', targetFSM);
target3.setFSM('ready', targetFSM);
target4.setFSM('ready', targetFSM);

angry_birdBullet.setFSM('start', { 
    'start': {
        'buttonpress': {
            predicate: function(event, actor){ 
                return event.target.id == "fire" },
            actions: [{ func: Actions.changeImg,
                        params: { img: angry_bird }},
                      { func: Actions.runAnim,
                        params: { movingActor: angry_birdBullet,
                                  targetActor: sight,
                                  duration: 2000,
                                  passOverMessage: "boom",
                                  endMessage: "hit"}}
                        ],
            endState: "start",
        },
        "message": {
            predicate: function(event, actor){ 
                return event.message == "hit" },
            actions: [{ func: Actions.moveTo,
                        params: { targetAbsoluteX: 45,
                                  targetAbsoluteY: 251 }}],
            endState: "start",
        },
        "animstart": {
            actions: [{ func: Actions.changeImg,
                        params: { img: angry_bird }}], 
            endState: "start"
        },
        "animmove": {
            actions: [{ func: Actions.followEventPosition }],
            endState: "start"
        },
        "animend": {
            actions: [{ func: Actions.followEventPosition },
                      { func: Actions.changeImg },
                      { func: Actions.moveTo,
                        params: { targetAbsoluteX: 45,
                                  targetAbsoluteY: 251 }}],
            endState: "start"
        }
        
    }

});

sight.setFSM('unfocused', { 
    'unfocused': {
        "mousedown": {
            actions: [{ func: Actions.getDragFocus }, {func: Actions.changeImg, params: {img: focusCrosshair } }],
            endState: "focused"
        }
    },
    'focused': {
        "dragmove": {
            actions: [{ func: Actions.followEventPosition }],
            endState: "focused"
        },
        "dragend": {
            actions: [{ func: Actions.dropDragFocus  },
                      { func: Actions.changeImg,
                        params: { img: crosshair }}],
            endState: "unfocused"
        }
    }
});

//When the DOM has loaded, actually setup our game
window.onload = function() { 
  var game = new Game(document.getElementById("game"));
  game.addActor(target1);
  game.addActor(target2);
  game.addActor(target3);
  game.addActor(target4);
  game.addActor(angry_birdBullet);
  game.addActor(slingshot);
    game.addActor(ground_actor);
  game.addActor(sight);

  document.getElementById("fire").addEventListener("click", function(event) {
    event = _.clone(event);
    event.type = "buttonpress";
    game.dispatchToAll(event);
  });
  
  //Wait for all of the imaages to load in before we start the game
  var runGame = function() {
    if (loadCounter >= totalImg)
      game.run();
    else
      setTimeout(function() { runGame() }, 200);
  }
  runGame();
};




SSUI - Web Lab
Assignment 3: WebLab Cannon Blast
Courtney Lett

This readme file contains all relevant process work for completing this assignment


Modified Angry Birds:
------------------------------------------
actors:
    angry bird bullet:
        bird will be sling shotted at the targets with "fire
    pig:
        Pig has two forms: injured and dead
            after one hit, the pig is injured
            after two hits, the pig is gone
    crosshair:
        changes from black to red when focused for a shot
    slingshot:

-   I attempted to add a state to the pigs where they would fall after a hit using runAnim, however I couldn't get the states to transition properly after the dead_pig state.

-   I also attempted to have the pigs to be constantly moving across the canvas until they were hit using some type of animation, but had trouble getting that aspect of my game to work
    
    
    



game.js
------------------------------------------
Drawing all actors of the game
    This part was fairly simple, but I realized that I had to create a new Image in order for ALL of the actor's images to appear. Without creating this new instance of an image, only the cannon, crosshair, and one target would show up
    
actorsUnder
    I was having trouble getting "this" (the game object) to pass to actorsUnder using notation like:
    
    canvas.addEventListener("mousedown", function(event) { code here...})
    
    Later, I eventually realized that I had to .bind(this) or use a different workaround which is what I opted to do. 
    
    The event listener inside the constructor calls a function which calls actorsUnder, and saves the return value to an array within this function
    

    

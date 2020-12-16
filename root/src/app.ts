import {State} from '~utils';
import * as util from '~utils';
import {Application} from 'pixi.js'; 
import { Game } from '~scenes/game/game';
import { Home } from '~scenes/home/home';
import { Leaderboard } from '~scenes/leaderboard/leaderboard';
import { Scene } from '~scenes/scene';

// Create the application instance and add it to the page
const app = new Application({
    width: util.GRID_SIZE * util.cols,
    height: util.GRID_SIZE * util.rows + util.topMargin,
    backgroundColor: 0xCC55CC,
    
});

document.body.appendChild(app.view);

// state and scene variable, keeps track of the current state
let state: State;
let scene: Scene;



// Load all the textures and after this run `setup`
app.loader.add(util.images)
    .load(setup);


function setup() {
    // start the application after the images have been loaded
    switchState(State.HOME);

    app.ticker.add(delta => gameLoop(delta))
}

function gameLoop(delta: number) {
    scene.Update(delta);

    if(scene.newState != -1)
        switchState(scene.newState);
}

// Handles the switching of states
function switchState(arg: State){
    state = arg;
    // reset the stage and switch state by initializing a new scene
    while(app.stage.children[0]) app.stage.removeChildAt(0);
    switch(state){
        case State.HOME:
            scene = new Home(app);
        break;
        case State.GAME:
            scene = new Game(app);
        break;
        case State.LEADERBOARD:
            scene = new Leaderboard(app);
        break;
    }
}


// EVENTS
window.onkeydown = function (e: KeyboardEvent) {
    var key = e.key;
    console.log("[KEYPRESSED]: ", key)
    scene.KeyPressed(key);
}
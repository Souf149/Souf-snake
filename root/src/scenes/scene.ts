import {Application, Container, Graphics, Text} from 'pixi.js'; 
import { State } from '~utils';



export abstract class Scene {
    
    app: PIXI.Application;
    container: Container;
    newState: State = -1;


    constructor(_app: PIXI.Application) {
        this.app = _app;
        this.container = new Container();
        this.app.stage.addChild(this.container);
    }

    Update(delta: number){

    }

    KeyPressed(key: string){

    }

}
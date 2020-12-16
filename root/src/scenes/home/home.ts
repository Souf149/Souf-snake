import {Application, Container, Graphics, Sprite, Text} from 'pixi.js'; 
import { Scene } from '~scenes/scene';
import {getSprite, SpriteBuilder, State} from '~utils';

export class Home extends Scene {
    BUTTON_SIZE: number[];
    FIRST_BUTTON_POSITION: number[];
    BUTTON_DISTANCE: number;
    selectedButtonIndex: number= 0;
    buttons: Sprite[] = []
    arrow: Sprite;

    public constructor(_app: Application) {
        super(_app);

        // Calculating the buttons' data
        this.BUTTON_SIZE = [this.app.view.width/5, this.app.view.height/8]
        this.FIRST_BUTTON_POSITION = [this.app.view.width/2 - this.BUTTON_SIZE[0]/2, this.app.view.height/4];
        this.BUTTON_DISTANCE = this.BUTTON_SIZE[1]*1.5;
        
        // Background
        let background = new SpriteBuilder(this.app, "arcade_bg")
            .SetSize(this.app.view.width, this.app.view.height)
            .Build();
        this.container.addChild(background);

        // Adding the buttons
        this.addButton("Play game");
        this.addButton("See leaderboard");
        this.addButton("TEST BUTTON");

        // Arrow
        this.arrow = new SpriteBuilder(this.app, "arrow")
            .SetAnchor(0.5, 0.5)
            .SetY(this.buttons[0].y + this.buttons[0].height / 2)
            .Build();
        this.arrow.x = this.buttons[0].x - this.arrow.width/2;
        this.container.addChild(this.arrow);
        

    }

    KeyPressed(key: string){
        switch(key){
            case "ArrowUp":
                this.MoveArrow(-1);
            break;
            case "ArrowDown":
                this.MoveArrow(1);
            break;
            case "Enter":
            case " ":
                this.UseButton();
            break;
        }
    }

    UseButton(){

        switch(this.selectedButtonIndex){
            case 0:
                this.newState = State.GAME;
            break;
            case 1:
                this.newState = State.LEADERBOARD;
            break;
            case 2:
                console.log("I dont do anything!");
            break;
        }

    }

    MoveArrow(dir: number){

        if(dir > 0){
            if(this.selectedButtonIndex == this.buttons.length - 1) // if it's at the bottom already
                return;
            this.selectedButtonIndex++;
            this.arrow.position.y += this.BUTTON_DISTANCE;
        }else{
            if(this.selectedButtonIndex == 0) // if it's at the top already
                return;
            this.selectedButtonIndex--;
            this.arrow.position.y -= this.BUTTON_DISTANCE;
        }

    }

    addButton(txt:string){
        // The button rectangle
        let w = this.BUTTON_SIZE[0];
        let h = this.BUTTON_SIZE[1]
        let x = this.FIRST_BUTTON_POSITION[0];
        let y = this.FIRST_BUTTON_POSITION[1] + this.buttons.length * this.BUTTON_DISTANCE;
        let margin = 16;

        let button_background = new SpriteBuilder(this.app, "scoreboard")
            .SetPosition(x, y)
            .SetSize(w, h)
            .Build();

        // The text on the rectangle
        let button_txt = new Text(txt, {align : 'center', wordWrap: true});
        button_txt.position.set(x + margin, y + margin);
        button_txt.width = w - margin * 2;
        button_txt.height = h - margin * 2;
        
        this.container.addChild(button_background, button_txt);
        this.buttons.push(button_background);
    }

}

import {Application, Container, Text} from 'pixi.js'; 
import { SpriteBuilder } from '~utils';
import { Game } from './game';

// Singleton class
export class Popup {
    public static instance: Popup | undefined;
    public static popup_container: Container;
    public static game: Game;
    

    private constructor() { }
    
    public static getInstance(_app: Application, _game: Game): Popup {
        if (!Popup.instance) {
            
            // Calculating information and making the popup
            Popup.instance = new Popup();
            this.game = _game;
            this.popup_container = new Container();
            let w = this.game.container.width/2;
            let h = this.game.container.height/1.5;
            let x = this.game.container.width;
            let y = this.game.container.height/2 - h/2;
            let margin = 25;
            this.popup_container.position.set(x, y);
            this.popup_container.width = w;
            this.popup_container.height = h;
            let bg = new SpriteBuilder(_app, "popup_bg")
                .SetSize(w, h)
                .SetPosition(0, 0)
                .Build();
            this.popup_container.addChild(bg);

            // Adding the title text
            let title = new Text("Game over", {align : 'center', fontWeight: 'bold'});
            title.position.set(margin, margin);
            title.width = w - margin*2;
            this.popup_container.addChild(title);

            // Description text
            let txt = "Nice try! Your score was: " + this.game.score + "\n\n Press ESCAPE to go to the home menu. Press ENTER to upload your score to the leaderboard";
            let description = new Text(txt, {align : 'center', wordWrap: true, fontSize: 13});
            description.position.set(margin, margin*2 + title.height);
            description.width = w - margin*2;
            description.height = this.popup_container.height / 1.5;
            this.popup_container.addChild(description);

            this.game.container.addChild(this.popup_container);

        }

        return Popup.instance;
    }

    Update() {

        // If the snake is dead, make the popup appear until it is in the middle.
        if(Popup.popup_container.x > Popup.game.container.width/2 - Popup.popup_container.width/2){
            Popup.popup_container.x -= 4;
            return true;
        }else
            return false;
        
    }
    
}
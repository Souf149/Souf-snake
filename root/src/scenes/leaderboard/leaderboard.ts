import { Sprite, Text } from "pixi.js";
import { Scene } from "~scenes/scene";
import { GetScores, SpriteBuilder, State } from "~utils";
import { PlayerScore } from "./playerScore";


export class Leaderboard extends Scene {

    records: PlayerScore[] = [];
    loading: boolean = true;
    loading_icon: Sprite;


    public constructor(_app: PIXI.Application) {
        super(_app);

        let background = new SpriteBuilder(this.app, "leaderboard_bg")
            .SetSize(this.app.view.width, this.app.view.height)
            .Build();
        this.container.addChild(background);

        let w = this.container.width/2;
        let h = this.container.height/1.3;
        let x = this.container.width/2 - w/2;
        let y = this.container.height/2 - h/2;
        let margin = 6;

        let foreground = new SpriteBuilder(_app, "white_square")
                .SetSize(w, h)
                .SetPosition(x, y)
                .Build();
        this.container.addChild(foreground);

        let infoText = new Text("Loading...", {align : 'left', fontSize : 32, wordWrap: true});
        infoText.position.set(x + margin, y + margin);
        infoText.width = w - margin*2;
        infoText.height = h / 11 - margin*2;
        this.container.addChild(infoText)

        this.loading_icon = new SpriteBuilder(this.app, "circle")
            .SetSize(30, 30)
            .SetAnchor(0.5, 0.5)
            .SetPosition(x, y)
            .Build();
        this.container.addChild(this.loading_icon);

        GetScores()
        .then((response) => {
            infoText.text = "Highscores:"
            this.loading = false;
            this.loading_icon.visible = false;

            for(let record of response){
                this.records.push(new PlayerScore(record));
            }
            
            // Sorting on score, highest on top
            this.records.sort((a, b) => {
                return b.score-a.score
            });


            // Get all the records OR the top 10, whichever gets first
            for(let i = 0; i < this.records.length && i < 10; i++){

                let txt = new Text(`${this.records[i].name} \t\t\t ${this.records[i].score}`);
                txt.position.set(x + margin, infoText.position.y + infoText.height + margin + (txt.height + margin) * i)
                this.container.addChild(txt);
            } 
        })

        .catch(() => {
            infoText.text = "Something went wrong. Try again another time."
        });

    }

    Update(){
        if(this.loading){
            this.loading_icon.rotation += 0.1;
        }
    }

    KeyPressed(key: string){
        if(["Escape", "Enter", " "].indexOf(key) >= 0)
            this.newState = State.HOME;
    }

    

}
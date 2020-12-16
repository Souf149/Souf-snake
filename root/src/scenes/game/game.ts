import {Application, Container, Text} from 'pixi.js'; 
import { Scene } from "~scenes/scene";
import * as util from '~utils';
import { State, cols, rows, topMargin, SpriteBuilder, AddScore, RandomInt } from '~utils';
import { Food } from './Food';
import { Popup } from './popup';
import { Snake } from './Snake';

export class Game extends Scene {
    score: number = 0;
    popup: Container = new Container();
    scoreText: Text;
    snake: Snake;
    food: Food;
    available_squares: number[][] = [];

    public constructor(_app: Application) {
        super(_app);

        // The background
        let background = new SpriteBuilder(this.app, "background")
            .SetSize(this.app.renderer.width, this.app.renderer.height)
            .SetPosition(0, 0)
            .Build();
        this.container.addChild(background);

        // The background where the score will be displayed
        let scoreboard_background = new SpriteBuilder(this.app, "scoreboard")
            .SetPosition(0, 0)
            .SetSize(this.app.renderer.width, topMargin)
            .Build();
        this.container.addChild(scoreboard_background);

        // The text on top of the scoreboard
        this.scoreText = new Text('Score: 0', {fontFamily : 'Arial', fontSize: 24, align : 'center'});
        this.scoreText.y = topMargin - this.scoreText.height*1.5;
        this.scoreText.x = 75;
        this.app.stage.addChild(this.scoreText);

        // Making the Snake
        this.snake = new Snake(
            [[3,2], [4,2], [5,2], [6,2]], 
            () => util.getSprite(this.app, "snake_segment"), 
            this.container
        );

        // Calculating all the spots to put the food
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.available_squares.push([i, j])                
            }
        }
        
        // Making the Food
        this.food = new Food(
            this.GetFreePosition(),
            util.getSprite(this.app, "food"),
            this.container
        );

        // Resetting the singleton in case it exists from a previous session
        Popup.instance = undefined;

    }

    

    Update(delta: number){
        if(this.snake.alive){

            // logic for the snake
            this.snake.Update(delta);
            
            // check if food has been hit
            if (this.food.checkEaten(this.snake)){
                this.snake.fed = true;
                this.food.SetPosition(this.GetFreePosition());
                this.score+=1;
                this.scoreText.text = "Score: " + this.score;
            }
        }else{
            // Singleton: creating the popup and if it already exists, make it move until it is done
            Popup.getInstance(this.app, this).Update();
        }
        

    }

    KeyPressed(key: string){
        if(this.snake.alive)
            this.snake.ChangeDirection(key)
        else if(key == "Enter")
            this.UploadNewScore();
        else if(key == "Escape")
            this.newState = State.HOME;
    }

    GetFreePosition(){
        // Checks for an empty spot to put new food, tries again if the spot is owned already until every square has been tried.
        // Make a copy for the available squares
        let available_squares_copy = JSON.parse(JSON.stringify(this.available_squares));
        
        // Try new spots until all available squares have been used.
        while(available_squares_copy.length > 0){
            let position = available_squares_copy.splice(RandomInt(0, available_squares_copy.length), 1)[0];
            if(!this.snake.CheckCollision(position))
                {console.log(position); return position;}
        }
        this.snake.alive = false;
        console.log("Top score reached!!!!!!!")
    }

    UploadNewScore(){
        let newName: string | null;
        while (true){
            newName = prompt("Enter your name:\n\nYour name will be used to display your score in the leaderboard.");
            if(newName != "" && newName != null)
                break;
        }

        AddScore(newName, this.score)
        .then((response)=>{
            this.newState = State.LEADERBOARD;
            console.log(response);
        })
        .catch(() => {
            console.log("something went wrong...");
            this.newState = State.HOME;
        })
    }

}
import {Container, Sprite} from 'pixi.js';
import { Game } from './game';
import { State, cols, rows, topMargin, GRID_SIZE, NumberToCell } from '~utils';

export class Snake {
    spriteFactory: () => PIXI.Sprite;
    container: Container;
    timeSinceLastUpdate: number = 0;
    speed: number = 1;
    fed: boolean = false;
    gotNewDirection: boolean = false;
    alive: boolean = true;

    sprites: PIXI.Sprite[];
    direction: string = "R" //[R]ight, [L]eft, [U]p, [D]own


  public constructor(segments: number[][], _spriteFactory: () => PIXI.Sprite, _container: Container) {
    this.spriteFactory = _spriteFactory;
    this.container = _container;
    this.sprites = [];
    // adding the sprite for every segment
    for(let segment of segments){
        let sprite = this.spriteFactory();
        sprite.position.set(segment[0] * GRID_SIZE, segment[1] * GRID_SIZE + topMargin);
        sprite.width = GRID_SIZE;
        sprite.height = GRID_SIZE;
        
        this.sprites.push(sprite);
        this.container.addChild(sprite);
    }

  }

  Update(delta: number){
    
    if(this.timeSinceLastUpdate > 10/this.speed){

      let newSegment : Sprite;
      // If the snake has recently eaten, it shouldnt remove the tail
      if(this.fed){
        newSegment = this.spriteFactory();
        this.fed = false;
      }else{
        newSegment = this.sprites.splice(0, 1)[0];
      }

      
      let lastSegment = this.sprites[this.sprites.length - 1];
      newSegment.position.x = lastSegment.position.x;
      newSegment.position.y = lastSegment.position.y;
      newSegment.width = GRID_SIZE;
      newSegment.height = GRID_SIZE;
      
      switch(this.direction){
        case "U":
          newSegment.position.y -= GRID_SIZE;
        break;
        case "R":
          newSegment.position.x += GRID_SIZE;
        break;
        case "D":
          newSegment.position.y += GRID_SIZE;
        break;
        case "L":
          newSegment.position.x -= GRID_SIZE;
        break;
      }
      this.sprites.push(newSegment);
      this.container.addChild(newSegment)

      // Setting this to false so a new input can be given again
      this.gotNewDirection = false;

      // // Check if snake has died
      // Check if the snake hit itself.
      let column = NumberToCell(newSegment.x)
      let row = NumberToCell(newSegment.y - topMargin)

      for(let i = 0; i < this.sprites.length - 1; i++){
        let segment = this.sprites[i];
        if(NumberToCell(segment.position.x) == column && NumberToCell(segment.position.y - topMargin) == row){
          this.Die();
        }
      }

      // Check if the snake hit the side
      if (column >= cols || column < 0 || row >= rows || row < 0){
        this.Die();
      }
      
      
      this.timeSinceLastUpdate = 0;
    }
    this.timeSinceLastUpdate += delta;
  }

  ChangeDirection(key:string){
    // If the snake already got a new direction this 'update', dont change it.
    if(this.gotNewDirection)
      return;

    // valid keys: "ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"
    const d = this.direction;
    if(key == "ArrowUp" && d != "D")
      this.direction = "U"
    else if(key == "ArrowRight" && d != "L")
      this.direction = "R"
    else if(key == "ArrowDown" && d != "U")
      this.direction = "D"
    else if(key == "ArrowLeft" && d != "R")
      this.direction = "L"
    
    // Setting this to true so no new input can be given again until the snake moves
    this.gotNewDirection = true;
  }

  CheckCollision(position: number[]){
    // Checks for every sprite if it collides with the given position, returns true if it does
    for(let sprite of this.sprites)
      if (sprite.position.x == position[0] * GRID_SIZE && sprite.position.y == position[1] * GRID_SIZE + topMargin)
        return true;

    return false;
  }

  Die(){
    // Remove the final segment of the snake
    this.container.removeChild(this.sprites[this.sprites.length - 1]);
    this.alive = false;
  }

}
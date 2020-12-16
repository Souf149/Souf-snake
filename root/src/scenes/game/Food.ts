import {Container, Sprite} from 'pixi.js';
import { State, cols, topMargin, GRID_SIZE, NumberToCell } from '~utils';
import { Snake } from './Snake';

export class Food {
    container: Container;
    sprite: PIXI.Sprite;


    public constructor(_position: number[], _sprite: PIXI.Sprite, _container: Container) {
      this.container = _container;
      this.sprite = _sprite;
      this.sprite.width = GRID_SIZE;
      this.sprite.height = GRID_SIZE;
      this.SetPosition(_position);
      this.container.addChild(this.sprite);
      
    }
    
    SetPosition(_position: number[]){
      if(_position)
        this.sprite.position.set(_position[0] * GRID_SIZE, _position[1] * GRID_SIZE + topMargin);
    }

    
    checkEaten(snake : Snake) {
      // Check if the column and row of the snake is the same as the food. Returns true if it does
      let column = NumberToCell(this.sprite.position.x);
      let row = NumberToCell(this.sprite.position.y);
      let position = snake.sprites[snake.sprites.length - 1].position;
      return NumberToCell(position.x) == column && NumberToCell(position.y) == row;
    }

}
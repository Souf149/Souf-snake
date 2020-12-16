import * as PIXI from 'pixi.js';

export const GRID_SIZE = 42;
export const cols = 15;
export const rows = 12;
export const topMargin = 50;

const URL = "https://soufsnake-35c7.restdb.io/rest/snake-scores";
const API_KEY = '5fd74a4cff9d670638140565';

export const enum State {
    HOME,
    GAME,
    LEADERBOARD
}

export const images = [
    "data/bg.png", 
    "data/square.png",
    "data/food.png",
    "data/scoreboard.png",
    "data/arcade_bg.png",
    "data/arrow.png",
    "data/leaderboard_bg.png",
    "data/popup_bg.png",
    "data/circle.png",
    "data/white_square.jpg"
]

export const sprites: Record<string, string> = {
    "background": images[0],
    "snake_segment": images[1],
    "food": images[2],
    "scoreboard": images[3],
    "arcade_bg": images[4],
    "arrow": images[5],
    "leaderboard_bg": images[6],
    "popup_bg": images[7],
    "circle": images[8],
    "white_square": images[9]
};

export function getSprite(app: PIXI.Application, name: string){
    const path = sprites[name]
    return new PIXI.Sprite(app.loader.resources[path].texture)
}

// Random Adapter
export function RandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function NumberToCell(num: number) {
    return Math.floor(num / GRID_SIZE);
}

export async function GetScores(){
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            'x-apikey': API_KEY,
            'cache-control': 'no-cache',
        } 
    });
    return response.json();
}

export async function AddScore(_name: string | null, _score: number){
    const data = { name: _name, score: _score };
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'x-apikey': API_KEY,
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;

}

// Builder with methods to edit the most commonly used attributes
export class SpriteBuilder{
    sprite: PIXI.Sprite;
    app: PIXI.Application;

    public constructor( _app: PIXI.Application, _spriteName: string){
        this.sprite = getSprite(_app, _spriteName)
        this.app = _app;
    }

    SetX(x:number){
        this.sprite.x = x;
        return this;
    }
    
    SetY(y:number){
        this.sprite.y = y;
        return this;
    }

    SetPosition(x:number, y:number){
        this.SetX(x);
        this.SetY(y);
        return this;
    }

    SetWidth(w:number){
        this.sprite.width = w;
        return this;
    }

    SetHeight(h:number){
        this.sprite.height = h;
        return this;
    }

    SetSize(w:number, h:number){
        this.SetWidth(w);
        this.SetHeight(h);
        return this;
    }

    SetAnchor(x:number, y:number){
        this.sprite.anchor.set(x, y);
        return this;
    }

    Build(){
        return this.sprite;
    }
}
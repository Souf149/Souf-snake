

export class PlayerScore {
    name: string;
    score: number;

    public constructor(_json){
        this.name = _json.name;
        this.score = _json.score;

    }
}
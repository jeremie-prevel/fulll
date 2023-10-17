export class Location{
    #lat:string;
    #lng:string;
    #alt:string;

    constructor(lat:string,lng:string,alt:string){
        this.#lat=lat;
        this.#lng=lng;
        this.#alt=alt;
    }

    toString(){
        return `${this.#lat} ${this.#lng} ${this.#alt}`;
    }
}
import { Brains, NeuralNetwork } from "../network/neuralNetwork";
import { polyIntersection, polyIntersectionWithSegments } from "../utils/utils";
import { Control, ControlType } from "./control";
import { Point } from "./point";
import { Segment } from "./segment";
import { Sensor } from "./sensor";

export class Car{
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    speed: number = 0;
    accelerarion: number = 0.2;
    maxSpeed: number = 3;
    maxReverseSpeed: number = -1.5;
    friction: number = 0.05;
    isDamaged: boolean = false;
    controlType: ControlType;

    angle: number = 0;
    angleSpeed: number = 0.03;

    controls: Control;
    sensor: Sensor|undefined=undefined;
    polygon: Point[] = [];//les points doivent être dans l'ordre
    private _brain: NeuralNetwork|undefined=undefined;

    constructor(x: number, y: number, width: number, height: number, {controlType = ControlType.DUMMY, useBrain= Brains.DUMMY, maxSpeed=3} = {}){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxSpeed = maxSpeed;
        this.controlType = controlType;

        this.controls = new Control(controlType);
        if(controlType!=ControlType.DUMMY){
            this.sensor = new Sensor(this);
            if(useBrain==Brains.AI)
                this._brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);            
        }
    }

    set brain(receivedBrain: NeuralNetwork){
        if(!this._brain) return;
        for (let l = 0; l < this._brain.levels.length; l++) {
            //biais
            for (let b = 0; b < this._brain.levels[l].biases.length; b++) {
                this._brain.levels[l].biases[b] = receivedBrain.levels[l].biases[b];
            }
            //weight
            for (let i = 0; i < this._brain.levels[l].weights.length; i++) {
                for (let j = 0; j < this._brain.levels[l].weights[i].length; j++) {
                    this._brain.levels[l].weights[i][j] = receivedBrain.levels[l].weights[i][j];
                }                
            }
        }
    }

    get brain(): NeuralNetwork|undefined{
        return this._brain;
    }

    update(borders: Segment[], traffic: Car[]){
        if(!this.isDamaged){
            this.move();
            this.polygon = this.createPolygon();
            this.isDamaged = this.assesDamage(borders, traffic);
        }
        if(this.sensor){
            this.sensor.update(borders, traffic);
            const offsets: number[] = this.sensor.rayReadings.map(
                p => p==undefined ? 0 : p.offset
            );
            //console.log(offsets);
            if(this._brain){
                const output = NeuralNetwork.feedFoward(offsets, this._brain);
                if(this.controlType==ControlType.AI){
                    this.controls.foward = output[0]==1;
                    this.controls.left = output[1]==1;
                    this.controls.right = output[2]==1;
                    this.controls.reverse = output[3]==1;
                }
                //console.log(output);
            }
        }
    }

    private assesDamage(borders: Segment[], traffic: Car[]): boolean{
        if(
            polyIntersectionWithSegments(this.polygon, borders)
        ) return true;
        for (let i = 0; i < traffic.length; i++) {
            if(
                polyIntersection(this.polygon, traffic[i].polygon)
            ) return true;
        }
        return false;
    }

    private createPolygon(): Point[]{
        const diagonale = Math.hypot(this.width, this.height);
        const rad = diagonale/2;
        const angle = Math.atan2(this.width, this.height);
        const points: Point[] = [];
        points.push(
            {x: this.x+Math.sin(this.angle+angle)*rad, y: this.y+Math.cos(this.angle+angle)*rad}
        );
        points.push(
            {x: this.x+Math.sin(this.angle-angle)*rad, y: this.y+Math.cos(this.angle-angle)*rad}
        );
        points.push(
            {x: this.x+Math.sin(Math.PI+this.angle+angle)*rad, y: this.y+Math.cos(Math.PI+this.angle+angle)*rad}
        );
        points.push(
            {x: this.x+Math.sin(Math.PI+this.angle-angle)*rad, y: this.y+Math.cos(Math.PI+this.angle-angle)*rad}
        );
        return points;
    }

    private move(){
        //réponse aux controles
        if(this.controls.foward)
            this.speed+=this.accelerarion;
        if(this.controls.reverse)
            this.speed-=this.accelerarion;

        //limitation de la vitesse
        if(this.speed>this.maxSpeed)
            this.speed = this.maxSpeed;
        if(this.speed<this.maxReverseSpeed)
            this.speed = this.maxReverseSpeed;

        //définition de la friction dans le sens opposé.
        if(this.speed>0)
            this.speed-=this.friction;
        if(this.speed<0)
            this.speed+=this.friction;

        //empêche de tourner sans vitesse
        if(this.speed!=0){
            //réponse aux controles
            const flip = this.speed>0?1:-1;
            if(this.controls.left)
                this.angle+=this.angleSpeed*flip;
            if(this.controls.right)
                this.angle-=this.angleSpeed*flip;
        }  
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    /**
     * Déssine de sorte que la voiture soit centré sur (x,y)
     * @param context 
     * @returns 
     */
    draw(context: CanvasRenderingContext2D|null, {drawSensor=true, color="black"}={}){
        if(context==null) return;
        context.fillStyle = this.isDamaged ? "red":color;
        context.beginPath();
        context.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            const p = this.polygon[i];
            context.lineTo(p.x, p.y);
        }
        context.fill();
        if(this.sensor && drawSensor)
            this.sensor.draw(context);
    }
}
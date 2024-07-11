import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { Car } from './primitives/car';
import { Road } from './primitives/road';
import { ControlType } from './primitives/control';
import { Brains, NeuralNetwork } from './network/neuralNetwork';
import { Visualizer } from './network/visualizer';

@Component({
    selector: 'app-driving-car',
    standalone: true,
    template: `
        <div class="container">
            <canvas id="car_canvas" #car_canvas></canvas>
            <div id="verticalButton">
                <button (click)="save()">💾</button>
                <button (click)="discard()">🗑️</button>
            </div>
            <canvas id="network_canvas" #network_canvas></canvas>
        </div>
    `,
    styles: `
        .container{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        #car_canvas{
            background: lightgray;
        }
        #network_canvas{
            background: black;
        }
        #verticalButton{
            display: flex;
            flex-direction: column;
        }
        button{
            border: none;
            border-radius: 5px;
            padding: 5px 5px 7px 5px;
            margin: 2px;
            cursor: pointer;
        }
        button:hover{
            background: blue;
        }
    `
})
export class DrivingCarComponent implements OnInit {

    carCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>("car_canvas");
    networkCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>("network_canvas");
    carContext!: CanvasRenderingContext2D|null;
    networkContext!: CanvasRenderingContext2D|null;
    cars: Car[] = [];
    road!: Road;
    traffic: Car[] = [];

    constructor() { }

    ngOnInit(): void {
        const carCanvas: HTMLCanvasElement = this.carCanvas().nativeElement;
        carCanvas.width = 200;
        const networkCanvas: HTMLCanvasElement = this.networkCanvas().nativeElement;
        networkCanvas.width = 400;

        this.road = new Road(carCanvas.width/2, carCanvas.width*0.9);
        this.traffic.push(
            new Car(this.road.getLaneCenter(1), -200,30,50, {maxSpeed: 2}),
            //new Car(this.road.getLaneCenter(2), -200,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(0), -400,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(2), -600,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(0), -800,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(2), -800,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(1), -1100,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(0), -1300,30,50, {maxSpeed: 2}),
            new Car(this.road.getLaneCenter(1), -1300,30,50, {maxSpeed: 2}),
        );

        this.cars = this.generateCars(700);

        const bestBrainString = localStorage.getItem("bestBrain");
        if(bestBrainString){
            const bestBrain = JSON.parse(bestBrainString) as NeuralNetwork;
            for (let i = 0; i < this.cars.length; i++) {
                this.cars[i].brain = bestBrain;
                if(i>0){
                    NeuralNetwork.mutate(this.cars[i].brain, 0.5);
                }
            }
        }

        this.carContext = carCanvas.getContext("2d");
        this.networkContext = networkCanvas.getContext("2d");
        this.animate(0);
    }

    save(){
        const bestCar = this.getBestCar();
        if(bestCar)
        localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    }

    discard(){
        localStorage.removeItem("bestBrain");
    }

    generateCars(n: number){
        const cars: Car[] = [];
        for (let i = 0; i < n; i++) {
            cars.push(
                new Car(this.road.getLaneCenter(1), 100, 30, 50,
                    {controlType: ControlType.AI, useBrain: Brains.AI,}
                )
            );
        }
        return cars;
    }

    getBestCar(): Car|undefined{
        return this.cars.find(
            car => car.y==Math.min(...this.cars.map(c => c.y))
        );
    }

    /**
     * Cette fonction calcule l'état actuel et prépare l'état suivant
     */
    animate(time: number){
        
        this.traffic.forEach(
            car => car.update(this.road.borders, [])
        );

        this.cars.forEach(
            car => car.update(this.road.borders, this.traffic)
        );
        const bestCar = this.getBestCar();

        this.carCanvas().nativeElement.height = window.innerHeight;
        this.networkCanvas().nativeElement.height = window.innerHeight;

        this.carContext?.save();
        this.carContext?.translate(0, -(bestCar?.y??0)+this.carCanvas().nativeElement.height*0.7);

        this.road.draw(this.carContext);

        this.traffic.forEach(
            trafficCar => trafficCar.draw(this.carContext, {color: "blue"})
        );

        if(this.carContext) this.carContext.globalAlpha = 0.2;
        this.cars.forEach(
            car => car.draw(this.carContext, {drawSensor: false})
        );
        if(this.carContext) this.carContext.globalAlpha = 1;
        bestCar?.draw(this.carContext);

        if(bestCar?.brain && this.networkContext){
            this.networkContext.lineDashOffset = -time/50;
            Visualizer.drawNetwork(this.networkContext, bestCar.brain);
        }
        
        this.carContext?.restore();
        //Cette fonction calcule la frame suivante avant le rafraichissement
        //Au prochain rafraichissement il fait juste un affichage
        requestAnimationFrame(this.animate.bind(this));
    }
}

//arrêté à 1h7
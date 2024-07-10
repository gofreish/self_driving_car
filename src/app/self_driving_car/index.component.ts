import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { Car } from './primitives/car';
import { Road } from './primitives/road';
import { ControlType } from './primitives/control';
import { Brains } from './network/neuralNetwork';
import { Visualizer } from './network/visualizer';

@Component({
    selector: 'app-driving-car',
    standalone: true,
    template: `
        <div class="container">
            <canvas id="car_canvas" #car_canvas></canvas>
            <canvas id="network_canvas" #network_canvas></canvas>
        </div>
    `,
    styles: `
        .container{
            display: flex;
            flex-direction: row;
        }
        #car_canvas{
            background: lightgray;
        }
        #network_canvas{
            background: black;
        }
    `
})
export class DrivingCarComponent implements OnInit {

    carCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>("car_canvas");
    networkCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>("network_canvas");
    carContext!: CanvasRenderingContext2D|null;
    networkContext!: CanvasRenderingContext2D|null;
    car!: Car;
    road!: Road;
    traffic: Car[] = [];

    constructor() { }

    ngOnInit(): void {
        const carCanvas: HTMLCanvasElement = this.carCanvas().nativeElement;
        carCanvas.width = 200;
        const networkCanvas: HTMLCanvasElement = this.networkCanvas().nativeElement;
        networkCanvas.width = 400;

        this.road = new Road(carCanvas.width/2, carCanvas.width*0.9);
        /*this.traffic.push(
            new Car(this.road.getLaneCenter(0), -100,30,50, 
                {maxSpeed: 1}
            )
        );*/
        this.car = new Car(this.road.getLaneCenter(1),100,30,50, 
            {controlType: ControlType.AI, useBrain: Brains.AI,}
        );

        this.carContext = carCanvas.getContext("2d");
        this.networkContext = networkCanvas.getContext("2d");
        this.animate(0);
    }

    /**
     * Cette fonction calcule l'état actuel et prépare l'état suivant
     */
    animate(time: number){
        
        this.traffic.forEach(
            car => car.update(this.road.borders, [])
        );

        this.carCanvas().nativeElement.height = window.innerHeight;
        this.networkCanvas().nativeElement.height = window.innerHeight;

        this.carContext?.save();
        this.carContext?.translate(0, -this.car.y+this.carCanvas().nativeElement.height*0.7);

        this.road.draw(this.carContext);

        this.traffic.forEach(
            car => car.draw(this.carContext, {color: "blue"})
        );

        this.car.update(this.road.borders, this.traffic);
        this.car.draw(this.carContext);

        if(this.car.brain && this.networkContext){
            this.networkContext.lineDashOffset = time/50;
            Visualizer.drawNetwork(this.networkContext, this.car.brain);
        }
        
        this.carContext?.restore();
        //Cette fonction calcule la frame suivante avant le rafraichissement
        //Au prochain rafraichissement il fait juste un affichage
        requestAnimationFrame(this.animate.bind(this));
    }
}

//arrêté à 1h7
import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { Car } from './primitives/car';
import { Road } from './primitives/road';
import { ControlType } from './primitives/control';

@Component({
    selector: 'app-driving-car',
    standalone: true,
    template: `
        <div>
            <canvas wid id="driving_car" #driving_car></canvas>
        </div>
    `,
    styles: `
        #driving_car{
            background: lightgray;
        }
    `
})
export class DrivingCarComponent implements OnInit {

    canvas = viewChild.required<ElementRef<HTMLCanvasElement>>("driving_car");
    contexte!: CanvasRenderingContext2D|null;
    car!: Car;
    road!: Road;
    traffic: Car[] = [];

    constructor() { }

    ngOnInit(): void {
        const canvas: HTMLCanvasElement = this.canvas().nativeElement;
        canvas.width = 200;
        this.road = new Road(canvas.width/2, canvas.width*0.9);
        this.traffic.push(
            new Car(this.road.getLaneCenter(0), -100,30,50, ControlType.DUMMY, 1)
        );
        this.car = new Car(this.road.getLaneCenter(1),100,30,50, ControlType.KEYS)
        this.contexte = canvas.getContext("2d");
        this.animate();
    }

    /**
     * Cette fonction calcule l'état actuel et prépare l'état suivant
     */
    animate(){
        
        this.traffic.forEach(
            car => car.update(this.road.borders, [])
        );

        this.canvas().nativeElement.height = window.innerHeight;

        this.contexte?.save();
        this.contexte?.translate(0, -this.car.y+this.canvas().nativeElement.height*0.7);

        this.road.draw(this.contexte);

        this.traffic.forEach(
            car => car.draw(this.contexte, {color: "blue"})
        );

        this.car.update(this.road.borders, this.traffic);
        this.car.draw(this.contexte);
        
        this.contexte?.restore();
        //Cette fonction calcule la frame suivante avant le rafraichissement
        //Au prochain rafraichissement il fait juste un affichage
        requestAnimationFrame(this.animate.bind(this));
    }
}

//arrêté à 1h7
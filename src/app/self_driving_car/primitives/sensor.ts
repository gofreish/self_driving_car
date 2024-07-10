import { getIntersection, lerp, polyIntersectionWithSegments } from "../utils/utils";
import { Car } from "./car";
import { IntersectionPoint, Point } from "./point";
import { Segment } from "./segment";

export class Sensor{

    car: Car;
    rayCount: number = 4;
    rayLength: number = 150;
    raySpread: number = Math.PI/2;
    rays: Segment[] = [];
    rayReadings: (IntersectionPoint|undefined)[] = [];

    constructor(car: Car, rayCount: number = 4){
        this.car = car;
        this.rayCount = rayCount;
    }

    update(borders: Segment[], traffic: Car[]){
        this.castRays();
        this.rayReadings = [];
        this.rays.forEach(
            ray => {
                this.rayReadings.push(
                    this.getReading(ray, borders, traffic)
                );
            }
        );
    }

    private getReading(ray: Segment, borders: Segment[], traffic: Car[]): IntersectionPoint|undefined{
        const touches: IntersectionPoint[] = [];
        borders.forEach(
            border => {
                const touche = getIntersection(ray, border);
                if(touche!=null)
                    touches.push(touche);
            }
        );
        traffic.forEach(
            car => {
                for (let i = 0; i < car.polygon.length; i++) {
                    const seg: Segment = {
                        p1: car.polygon[i], 
                        p2: car.polygon[(i+1)%car.polygon.length]
                    };
                    const touche = getIntersection(ray, seg);
                    if(touche!=null)
                        touches.push(touche);
                }
            }
        );
        if(touches.length==0)
            return undefined;
        else{
            const offsets = touches.map(e => e.offset);
            const min = Math.min(...offsets);
            return touches.find(e => e.offset==min);
        }
    }

    private castRays(){
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const percent = this.rayCount==1?0.5:i/(this.rayCount-1);
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                percent
            )+this.car.angle;
            const start: Point = {x: this.car.x, y: this.car.y};
            const end: Point = {
                x: this.car.x-Math.sin(rayAngle)*this.rayLength, 
                y: this.car.y-Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push({p1: start, p2: end});
        }
    }

    private drawSegment(
        context: CanvasRenderingContext2D,
        segment: Segment,
        {color='yellow'} = {}
    ){
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = color;
        context.moveTo(segment.p1.x, segment.p1.y);
        context.lineTo(segment.p2.x, segment.p2.y);
        context.stroke();
    }

    draw(context: CanvasRenderingContext2D){
        this.rays.forEach(
            (ray, index) => {
                const int = this.rayReadings[index];
                if(int!=undefined){
                    const seg1: Segment = {p1: ray.p1, p2: {x:int.x, y:int.y}};
                    this.drawSegment(context, seg1);
                    const seg2: Segment = {p1: {x:int.x, y:int.y}, p2: ray.p2};
                    this.drawSegment(context, seg2, {color: "black"});
                }else{
                    this.drawSegment(context, ray);
                }
            }
        );
    }
}
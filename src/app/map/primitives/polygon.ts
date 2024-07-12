import { Point } from "./point";

export class Polygon{
    points: Point[];

    constructor(points: Point[]){
        this.points = points;
    }

    draw(context: CanvasRenderingContext2D|null, {stroke="blue", lineWidth=2, fill="rgba(0,0,255,0.3)"}={}){
        if(!context) return;
        if(this.points.length==0) return;
        context.beginPath();
        context.lineWidth = lineWidth;
        context.strokeStyle = stroke;
        context.fillStyle = fill;
        context.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.closePath();
        context.fill();
        context.stroke();
    }
}
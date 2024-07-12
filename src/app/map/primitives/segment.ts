import { Point } from "./point";

export class Segment{
    p1: Point;
    p2: Point;

    constructor(p1: Point, p2: Point){
        this.p1 = p1;
        this.p2 = p2;
    }

    equals(seg: Segment): boolean{
        return this.includes(seg.p1) && this.includes(seg.p2);
    }

    includes(p: Point): boolean{
        return this.p1.equals(p) || this.p2.equals(p);
    }

    draw(context: CanvasRenderingContext2D|null, {width=2, color="black", dashed=[0,0]}={}){
        if(!context) return;
        context.beginPath();
        context.lineWidth = width;
        context.strokeStyle = color;
        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);
        context.setLineDash(dashed);
        context.stroke();
    }
}
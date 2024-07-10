import { lerp } from "../utils/utils";
import { Point } from "./point";
import { Segment } from "./segment";

export class Road{
    
    x: number;
    width: number;
    laneCount: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    borders: Segment[];

    constructor(x: number, width: number, laneCount: number=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.left = x-width/2;
        this.right = x+width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft: Point = {x:this.left, y:this.top};
        const bottomLeft: Point = {x:this.left, y:this.bottom};
        const topRight: Point = {x:this.right, y:this.top};
        const bottomRight: Point = {x:this.right, y:this.bottom};
        this.borders = [
            {p1: topLeft, p2: bottomLeft},
            {p1: topRight, p2: bottomRight}
        ];
    }

    /**
     * Donne le centre d'une ligne
     * @param laneIndex 
     */
    getLaneCenter(laneIndex: number){
        if(laneIndex>=this.laneCount)
            laneIndex = this.laneCount-1;
        if(laneIndex<0)
            laneIndex = 0;
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2 + laneIndex*laneWidth;
    }

    private drawLine(
        context: CanvasRenderingContext2D,
        start: Point,
        end: Point,
        {isDashed = false} = {}
    ){
        if(isDashed)
            context.setLineDash([20,20]);
        else
            context.setLineDash([]);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }

    draw(context: CanvasRenderingContext2D|null){
        if(context==null) return;
        context.lineWidth = 5;
        context.strokeStyle = "white";
        for (let i = 1; i < this.laneCount; i++) {
            const x = lerp(this.left, this.right, i/this.laneCount);
            this.drawLine(
                context,
                {x: x, y: this.top},
                {x: x, y: this.bottom},
                {isDashed: true}
            );   
        }
        this.borders.forEach(
            seg => {
                this.drawLine(
                    context,
                    seg.p1,
                    seg.p2,
                    {isDashed: false}
                );
            }
        );
    }
}
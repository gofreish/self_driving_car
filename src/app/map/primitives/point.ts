export class Point{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    equals(p: Point): boolean{
        return this.x==p.x && this.y==p.y;
    }

    draw(context: CanvasRenderingContext2D|null, {size=18, color="black", outline = false}={}){
        if(!context) return;
        const rad = size/2;
        context.beginPath();
        context.fillStyle = color;
        context.arc(this.x, this.y, rad, 0, Math.PI*2);
        context.fill();

        if(outline){
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "yellow";
            context.arc(this.x, this.y, rad*0.6, 0, Math.PI*2);
            context.stroke();
        }
    }
}
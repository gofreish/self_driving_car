import { lerp } from "../../self_driving_car/utils/utils";
import { angle, subtract, translate } from "../utils/utils";
import { Point } from "./point";
import { Polygon } from "./polygon";
import { Segment } from "./segment";

export class Envelope{
    skeleton: Segment;
    polygon: Polygon;

    constructor(segment: Segment, {width=50, roundness=1}={}){
        this.skeleton = segment;
        this.polygon = this.generatePolygon(width, roundness);
    }

    private generatePolygon(width: number, roundness: number): Polygon{
        const {p1, p2} = this.skeleton;
        const radius = width/2;
        const alpha = angle(subtract(p1,p2));
        const alpha_cw = alpha + Math.PI/2;
        const alpha_ccw = alpha - Math.PI/2;

        const points: Point[] = [];
        const alpha_step = Math.PI/Math.max(1, roundness);
        const eps = alpha_step/2;
        for (let i = alpha_ccw; i <= alpha_cw+eps; i+=alpha_step) {
            points.push(translate(p1, i, radius));
        }
        for (let i = alpha_ccw; i <= alpha_cw+eps; i+=alpha_step) {
            points.push(translate(p2, Math.PI+i, radius));
        }
        

        return new Polygon(points);
    }

    draw(context: CanvasRenderingContext2D|null, {stroke="blue", lineWidth=2, fill="rgba(0,0,255,0.3)"}={}){
        this.polygon.draw(context);
    }
}
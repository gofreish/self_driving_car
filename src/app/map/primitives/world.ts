import { Envelope } from "./envelope";
import { Graph } from "./graph";

export class World{

    graph: Graph;
    envelopes: Envelope[];
    roadWidth: number;
    roundness: number;

    constructor(graph: Graph, {roadWidth=100, roundness=3}={}){
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roundness = roundness;
        this.envelopes = [];
    }

    generate(){
        this.envelopes.length = 0;
        for (const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, {width: 50, roundness: 5})
            );
        }
    }

    draw(context: CanvasRenderingContext2D|null){
        for(const env of this.envelopes){
            env.draw(context);
        }
    }
}
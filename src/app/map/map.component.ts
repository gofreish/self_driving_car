import { Component, effect, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { Graph } from './primitives/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import { GraphEditor } from './primitives/graph-editor';
import { Viewport } from './primitives/viewport';
import { VIEWPORT_MODE } from './utils/utils';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [],
    template: `
        <div class="container">
            <canvas id="map_canvas" #map_canvas></canvas>
            <div id="controls">
                <button [disabled]="viewportMode()==0" (click)="viewportMode.set(0)">edit</button>
                <button [disabled]="viewportMode()==1" (click)="viewportMode.set(1)">zoom</button>
            </div>
        </div>
    `,
    styles: `
        .container{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        #map_canvas{
            background: green;
            margin-bottom: 10px;
        }
        #controls{
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 5px;
        }
    `
})
export class MapComponent implements OnInit {

    mapCanvasViewCHild = viewChild.required<ElementRef<HTMLCanvasElement>>("map_canvas");
    mapContext: CanvasRenderingContext2D|null = null;
    graph: Graph|undefined;
    graphEditor: GraphEditor|undefined;
    viewport: Viewport|undefined;
    viewportMode = signal<VIEWPORT_MODE>(VIEWPORT_MODE.EDIT);
    
    constructor() {
        effect(()=>{
            if(this.graphEditor && this.viewport){
                this.graphEditor.mode = this.viewportMode();
                this.viewport.mode = this.viewportMode();
            }
        });
    }
 
    ngOnInit(): void { 
        const mapCanvas: HTMLCanvasElement = this.mapCanvasViewCHild().nativeElement;
        this.mapContext = mapCanvas.getContext("2d");
        mapCanvas.width = 600;
        mapCanvas.height = 600;

        const p1 = new Point(100,100);
        const p2 = new Point(200,200);
        const p3 = new Point(200,100);
        const seg1 = new Segment(p1, p2);
        const seg2 = new Segment(p1, p3);

        this.graph = new Graph([p1,p2,p3], [seg1,seg2]);
        this.viewport = new Viewport(mapCanvas);
        this.graphEditor = new GraphEditor(this.mapCanvasViewCHild().nativeElement, this.graph, this.viewport);
        console.log(this.viewportMode());
        this.animate();
    }

    animate(){
        if(!this.mapContext || !this.graphEditor || !this.viewport) return;
        this.mapContext.clearRect(0, 0, this.mapCanvasViewCHild().nativeElement.width, this.mapCanvasViewCHild().nativeElement.height);
        this.mapContext.save();
        this.mapContext.translate(this.viewport.center.x, this.viewport.center.y);
        this.mapContext.scale(1/this.viewport.zoom, 1/this.viewport.zoom);
        const offset = this.viewport.getOffset();
        this.mapContext.translate(offset.x, offset.y);
        this.graphEditor.display();
        this.viewport.display();
        this.mapContext.restore();
        requestAnimationFrame(this.animate.bind(this));
    }

}

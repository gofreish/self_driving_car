import { Component, effect, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { Graph } from './primitives/graph';
import { GraphEditor } from './primitives/graph-editor';
import { Viewport } from './primitives/viewport';
import { VIEWPORT_MODE } from './utils/utils';
import { World } from './primitives/world';

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
                <button (click)="save()">U+1F4BE</button>
                <button (click)="dispose()">U+1F5D1</button>
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
    world: World|undefined;
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

        this.graph = this.load();
        this.world = new World(this.graph);
        this.viewport = new Viewport(mapCanvas);
        this.graphEditor = new GraphEditor(this.mapCanvasViewCHild().nativeElement, this.graph, this.viewport);
        console.log(this.viewportMode());
        this.animate();
    }

    animate(){
        if(!this.mapContext || !this.graphEditor || !this.viewport || !this.world) return;
        this.viewport.reset();

        this.world.generate();
        this.world.draw(this.mapContext);
        this.graphEditor.display();
        this.viewport.display();

        requestAnimationFrame(this.animate.bind(this));
    }


    private load():Graph{
        const graphStr = localStorage.getItem("map_graph");
        if(graphStr)
            return Graph.load(JSON.parse(graphStr) as Graph);
        else
            return new Graph([],[]);
    }

    save(){
        localStorage.setItem("map_graph", JSON.stringify(this.graph));
    }

    dispose(){
        localStorage.removeItem("map_graph");
    }

}

//Arêté a 2h:23
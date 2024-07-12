import { getNearestPoint, MouseButtons, VIEWPORT_MODE } from "../utils/utils";
import { Graph } from "./graph";
import { Point } from "./point";
import { Segment } from "./segment";
import { Viewport } from "./viewport";

export class GraphEditor{
    canvas: HTMLCanvasElement;
    graph: Graph;
    context: CanvasRenderingContext2D|null;
    selected: Point|undefined;
    hovered: Point|undefined;
    isDragging: boolean = false;
    mouse: Point = new Point(0,0);
    mode: VIEWPORT_MODE;
    viewport: Viewport;

    constructor(canvas: HTMLCanvasElement, graph: Graph, viewport: Viewport, mode: VIEWPORT_MODE = VIEWPORT_MODE.EDIT){
        this.canvas = canvas;
        this.graph = graph;
        this.context = this.canvas.getContext("2d");
        this.mode = mode;
        this.addEventListener();
        this.viewport = viewport;
    }

    private addEventListener(){
        this.canvas.addEventListener("contextmenu", evt => evt.preventDefault());
        this.canvas.addEventListener("mousedown", this.mouseDownEventListener.bind(this));
        this.canvas.addEventListener("mousemove", this.mouseMoveEventListener.bind(this));
        this.canvas.addEventListener("mouseup", ()=>this.isDragging = false);
    }

    private selectPoint(p: Point){
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, p));
        }
        this.selected = p;
    }

    private mouseMoveEventListener(evt: MouseEvent){
        if(this.mode!=VIEWPORT_MODE.EDIT) return;
        this.mouse = this.viewport.getMouse(evt);
        this.hovered = getNearestPoint(this.graph.points, this.mouse, 10*this.viewport.zoom);
        if(this.isDragging && this.selected){
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    private mouseDownEventListener(evt: MouseEvent){
        if(this.mode!=VIEWPORT_MODE.EDIT) return;
        switch(evt.button){
            case MouseButtons.LEFT:
                this.onMouseLeftButtonDown(evt);
                break;
            case MouseButtons.RIGHT:
                this.onMouseRightButtonDown(evt);
                break;
            default: 
                break;
        }
    }

    private onMouseLeftButtonDown(evt: MouseEvent){
        if(this.hovered){
            this.selectPoint(this.hovered);
            this.isDragging = true;
        }else{
            const p = new Point(this.mouse.x, this.mouse.y);
            this.graph.tryAddPoint(p);
            this.selectPoint(p);
            this.hovered = p;
        }
    }

    private onMouseRightButtonDown(evt: MouseEvent){
        if(this.selected){
            this.selected = undefined;
        }else if(this.hovered){
            this.graph.tryRemovePoint(this.hovered);
            this.hovered = undefined;
        }
    }

    display(){
        this.graph.draw(this.context);
        if(this.hovered) 
            this.hovered.draw(this.context, {outline: true});
        if(this.selected){
            this.selected.draw(this.context, {outline: true});
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(this.context, {dashed: [3,3]});
        }
    }
}
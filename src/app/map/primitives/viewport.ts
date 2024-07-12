import { add, MouseButtons, scale, subtract, VIEWPORT_MODE } from "../utils/utils";
import { Point } from "./point";

interface Drag{
    start: Point,
    end: Point,
    offset: Point,
    active: boolean
}

export class Viewport{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D|null;
    zoom: number = 1;
    mode: VIEWPORT_MODE;

    zoomSelected: Point|undefined;
    mouse: Point = new Point(0,0);
    center: Point;
    offset: Point;
    drag: Drag;

    getMouse(evt: MouseEvent){
        return new Point(
            (evt.offsetX-this.center.x)*this.zoom - this.offset.x,
            (evt.offsetY-this.center.y)*this.zoom - this.offset.y
        );
    }

    getOffset(){
        return add(this.offset, this.drag.offset);
    }

    constructor(canvas: HTMLCanvasElement, mode: VIEWPORT_MODE = VIEWPORT_MODE.EDIT){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.mode = mode;
        this.drag = {
            start: new Point(0,0),
            end: new Point(0,0),
            offset: new Point(0,0),
            active: false
        };
        this.center = new Point(this.canvas.width/2, this.canvas.height/2);
        this.offset = scale(this.center, -1);
        this.addEventListener();
    }

    reset(){
        if(!this.context) return;
        this.context.restore();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(this.center.x, this.center.y);
        this.context.scale(1/this.zoom, 1/this.zoom);
        const offset = this.getOffset();
        this.context.translate(offset.x, offset.y);
    }

    private addEventListener(){
        this.canvas.addEventListener("mousemove", this.mouseMouveEvent.bind(this));
        this.canvas.addEventListener("mousedown", this.mouseDownEvent.bind(this));
        this.canvas.addEventListener("mouseup", this.mouseUpEvent.bind(this));
    }

    private mouseMouveEvent(evt: MouseEvent){
        if(this.mode != VIEWPORT_MODE.ZOOM) return;
        this.mouse = this.getMouse(evt);
        this.zooming();
        if(this.drag.active){
            this.drag.end = this.getMouse(evt);
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }

    private mouseUpEvent(evt: MouseEvent){
        if(this.mode != VIEWPORT_MODE.ZOOM) return;
        switch(evt.button){
            case MouseButtons.LEFT:
                this.zoomSelected = undefined;
                break;
            case MouseButtons.RIGHT:
                if(this.drag.active){
                    this.offset = add(this.offset, this.drag.offset);
                    this.drag = {
                        start: new Point(0,0),
                        end: new Point(0,0),
                        offset: new Point(0,0),
                        active: false
                    };
                }
                break;
            default: 
                break;
        }
    }

    private mouseDownEvent(evt: MouseEvent){
        if(this.mode != VIEWPORT_MODE.ZOOM) return;
        switch(evt.button){
            case MouseButtons.LEFT:
                this.zoomSelected = this.getMouse(evt);//new Point(evt.offsetX, evt.offsetY);
                break;
            case MouseButtons.RIGHT:
                this.drag.active = true;
                this.drag.start = this.getMouse(evt);
                break;
            default: 
                break;
        }
    }

    private zooming(){
        if(!this.zoomSelected) return;
        const distance = Math.hypot(this.zoomSelected.x-this.mouse.x, this.zoomSelected.y-this.mouse.y);
        const direction = Math.sign(this.zoomSelected.y-this.mouse.y);
        this.zoom += direction*distance*0.0001;
        this.zoom = Math.max(1, Math.min(this.zoom, 5));
    }

    display(){
        if(!this.context) return;
        if(!this.zoomSelected) return;
        this.context.beginPath();
        this.context.fillStyle = "black";
        this.context.font = '2rem Arial';
        this.context.fillText('\u{1F50D}', this.zoomSelected.x, this.zoomSelected.y);
    }
}
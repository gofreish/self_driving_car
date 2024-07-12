import { Point } from "./point";
import { Segment } from "./segment";

/**
 * Classe représentant le graphe
 */
export class Graph{
    points: Point[];
    segments: Segment[]

    constructor(points: Point[], segments: Segment[]){
        this.points = points;
        this.segments = segments;
    }

    /**
     * Tente d'ajouter un segment et retourne un booléen
     * indiquant si c'est un succès
     * @param seg 
     * @returns boolean
     */
    tryAddSegment(seg: Segment): boolean{
        if(!this.containsSegment(seg) && !seg.p1.equals(seg.p2)){
            this.segments.push(seg);
            return true;
        }
        return false;
    }

    /**
     * Tente de supprimer et segment et retourne un
     * booléen indiquant si c'est un succès
     * @param index 
     * @returns boolean
     */
    tryRemoveSegmentById(index: number): boolean{
        if(this.segments.length==0) return false;
        if(index>=this.segments.length) return false;
        this.segments.splice(index, 1);
        return true;
    }

    /**
     * Tente d'ajouter un point et indique si c'est un
     * succès en retournant un booléen
     * @param point 
     * @returns boolean
     */
    tryAddPoint(point: Point): boolean{
        if(!this.containsPoint(point)){
            this.points.push(point);
            return true;
        }
        return false;
    }

    /**
     * Tente de supprimer un point en se basant sur son id 
     * dans le tableau de points et retourne un
     * booléen indiquant si c'est un succès
     * @param id 
     * @returns boolean
     */
    tryRemovePointById(id: number): boolean{
        if(this.points.length==0) return false;
        if(id>=this.points.length) return false;
        
        this.segments = this.segments.filter(
            s => !s.includes(this.points[id])
        );
        this.points.splice(id, 1);
        return true;
    }

    /**
     * Tente de supprimer un point et retourne un
     * booléen indiquant si c'est un succès
     * @param point
     * @returns boolean
     */
    tryRemovePoint(point: Point): boolean{
        const id = this.points.findIndex(
            p => p.equals(point)
        );
        if(id==-1) return false;
        return this.tryRemovePointById(id);
    }

    /**
     * indique si le graphe contient déjà le
     * segment en paramètre
     * @param seg Segment
     * @returns boolean
     */
    containsSegment(seg: Segment): Segment|undefined{
        return this.segments.find(s => s.equals(seg));
    }

    /**
     * Indique si le graphe contient déjà le point
     * @param point 
     * @returns boolean
     */
    containsPoint(point: Point): Point|undefined{
        return this.points.find(p => p.equals(point));
    }

    /**
     * supprime tout les points et segments
     * du graphe
     */
    dispose(){
        this.points.length = 0;
        this.segments.length = 0;
    }

    /**
     * déssine tout le contenu du graphe
     * @param context CanvasRenderingContext2D|null
     */
    draw(context: CanvasRenderingContext2D|null){
        this.segments.forEach(
            seg => seg.draw(context)
        );

        this.points.forEach(
            p => p.draw(context)
        );
    }
}
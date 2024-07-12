import { Point } from "../primitives/point";

export enum MouseButtons{
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
}
export enum VIEWPORT_MODE{
    EDIT,
    ZOOM
}

/**
 * Retourne la distance entre deux points
 * @param p1 Point
 * @param p2 Point
 * @returns number
 */
export function getDistance(p1: Point, p2: Point): number{
    return Math.hypot(p1.x-p2.x, p1.y-p2.y);
}

export function getNearestPoint(points: Point[], p: Point, threshold = Number.MAX_SAFE_INTEGER): Point|undefined{
    let minDist = threshold;
    let nearest: Point|undefined;
    points.forEach(
        point => {
            const distance = getDistance(point, p);
            if( distance < minDist ){
                minDist = distance;
                nearest = point;
            }
        }
    );
    return nearest;
}

export function subtract(p1: Point, p2: Point): Point{
    return new Point(p1.x-p2.x, p1.y-p2.y);
}

export function add(p1: Point, p2: Point): Point{
    return new Point(p1.x+p2.x, p1.y+p2.y);
}

export function scale(p: Point, scaler: number){
    return new Point(scaler*p.x, scaler*p.y);
}

export function translate(p: Point, alpha: number, radius: number): Point{
    return new Point(
        p.x + Math.cos(alpha)*radius,
        p.y + Math.sin(alpha)*radius
    );
}

export function angle(p: Point){
    return Math.atan2(p.y, p.x);
}
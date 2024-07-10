import { IntersectionPoint, Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

/**
 * Interpolation linéaire entre start et end
 * @param start 
 * @param end 
 * @param percent 
 * @returns 
 */
export function lerp(start: number, end: number, percent: number){
    return start+(end-start)*percent;
}

export function getIntersection(segment1: Segment, segment2: Segment): IntersectionPoint | null {
    const { p1: p1, p2: p2 } = segment1;
    const { p1: p3, p2: p4 } = segment2;
  
    const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  
    if (denominator === 0) {
      return null; // Les segments sont parallèles ou colinéaires
    }
  
    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
  
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      const intersectionX = p1.x + ua * (p2.x - p1.x);
      const intersectionY = p1.y + ua * (p2.y - p1.y);
      return { x: intersectionX, y: intersectionY, offset: ua };
    }
    return null; // Pas d'intersection
}

/**
 * Retourne true s'il y a intersection entre le polygone que forme
 * l'ensemble des points et les segments
 * @param polygon 
 * @param border 
 * @returns 
 */
export function polyIntersectionWithSegments(polygon: Point[], borders: Segment[]){
    for (let i = 0; i < borders.length; i++) {
        for (let j = 0; j < polygon.length; j++) {
            const seg: Segment = {
                p1: polygon[i], 
                p2: polygon[(j+1)%polygon.length]
            };
            const touch = getIntersection(seg, borders[i]);
            if(touch) return true;
        }
    }
    return false;
}

/**
 * Indique s'il y a intersection entre deux polygones
 * @param poly1 
 * @param poly2 
 * @returns 
 */
export function polyIntersection(poly1: Point[], poly2: Point[]){
    for (let i = 0; i < poly1.length; i++) {
        const segPoly1: Segment = {
            p1: poly1[i], 
            p2: poly1[(i+1)%poly1.length]
        };
        for (let j = 0; j < poly2.length; j++) {
            const segPoly2: Segment = {
                p1: poly2[j], 
                p2: poly2[(j+1)%poly2.length]
            };
            const touch = getIntersection(segPoly1, segPoly2);
            if(touch) return true;
        }        
    }
    return false;
}
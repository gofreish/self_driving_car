export interface Point{
    x: number,
    y: number
}

/**
 * Cette interface ajoute le offset qui représente la distante 
 * qu'il y a entre le debut du segment et l'intersection sous 
 * la forme d'un pourcentage de la longueur du segment
 */
export interface IntersectionPoint{
    x: number,
    y: number,
    offset: number //représente un pourcentage
}

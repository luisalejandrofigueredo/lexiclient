import { Injectable } from '@angular/core';
interface Point {
  x: number,
  y: number
}
@Injectable({
  providedIn: 'root'
})
export class TrigonometryService {
  constructor() { }

  /**
   * 
   * @param x 
   * @param y 
   * @param angle 
   * @param distance 
   * @returns 
   */
  move(x: number, y: number, angle: number, distance: number): Point {
    return { x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance }
  }

  /**
   * 
   * @param x 
   * @param y 
   * @param xx 
   * @param yy 
   * @returns 
   */
  angle(x: number, y: number, xx: number, yy: number): number {
    const deltaY = yy - y;
    const deltaX = xx - x;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    return angleInRadians
  }

  /**
   * 
   * @param x 
   * @param y 
   * @param xx 
   * @param yy 
   * @returns 
   */
  distance(x: number, y: number, xx: number, yy: number): number {
    return Math.pow(Math.pow(x - xx, 2) + Math.pow(y - yy, 2), 1 / 2);
  }

  inLine(positionX: number, positionY: number, x: number, y: number, xx: number, yy: number): boolean {
    const distance = this.distance(x, y, xx, yy);
    const distanceToFist = this.distance(x, y, positionX, positionY);
    const distanceToLast = this.distance(positionX, positionY, xx, yy);
    if ((distanceToFist + distanceToLast - distance)< 20) {
      return true;
    }
    else {
      return false;
    }
  }
}

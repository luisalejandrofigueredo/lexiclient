import { Injectable } from '@angular/core';
interface Point{
  x:number,
  y:number
}
@Injectable({
  providedIn: 'root'
})
export class TrigonometryService {
  constructor() { }
  move(x:number,y:number,angle:number,distance:number):Point{
    return {x:x+Math.cos(angle)*distance,y:y+Math.sin(angle)*distance}
  }

  angle(x:number,y:number,xx:number,yy:number):number {
    const deltaY = yy - y;
    const deltaX = xx - x;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    return angleInRadians
  }

  distance(x: number, y: number, xx: number, yy: number): number {
    return Math.pow(Math.pow(x - xx, 2) + Math.pow(y - yy, 2), 1 / 2);
  }
}

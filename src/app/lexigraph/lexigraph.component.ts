import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-lexigraph',
  templateUrl: './lexigraph.component.html',
  styleUrls: ['./lexigraph.component.scss']
})
export class LexigraphComponent implements OnInit,AfterViewInit {
  context!: CanvasRenderingContext2D;
  menuTopLeftPosition =  {x: '0', y: '0'};
  @ViewChild( 'myCanvas',{static:true } ) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger!: MatMenuTrigger; 
  private ctx: CanvasRenderingContext2D | undefined;
  constructor() { }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
     this.ctx = canvas.getContext( '2d' )!;
      this.ctx.beginPath();
      this.ctx.rect(0,0,640,400);
      this.ctx.stroke();
      this.ctx.fillText('Hola mundo',50,50);

      // draw stuff
  }

  menu(event:MouseEvent){
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px'; 
    this.menuTopLeftPosition.y = event.clientY + 'px'; 
    this.matMenuTrigger.openMenu();
  }

  addNode(){

  }

  addConnection(){
    
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NodeService } from '../node.service';
import { SelectNodeComponent } from '../select-node/select-node.component';
@Component({
  selector: 'app-lexigraph',
  templateUrl: './lexigraph.component.html',
  styleUrls: ['./lexigraph.component.scss']
})
export class LexigraphComponent implements OnInit, AfterViewInit {
  context!: CanvasRenderingContext2D;
  menuTopLeftPosition = { x: '0', y: '0' };
  canvasContext: any;
  cursor = { x: 0, y: 0 };
  @ViewChild('myCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  private ctx!: CanvasRenderingContext2D;
  scale = 1
  constructor(private nodeService: NodeService, public dialog: MatDialog) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement;
    this.ctx = this.canvasContext.getContext('2d')!;
    this.beginDraw();
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, 640, 400);
  }

  beginDraw() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, 640, 400);
    this.ctx.stroke();
    this.ctx.fillText("Hello word", 50, 50);
  }

  menu(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.cursor = { x: event.clientX - rect.left, y: event.clientY-rect.top };
    this.ctx.beginPath();
    this.ctx.arc(this.cursor.x, this.cursor.y, 10, 0, 360);
    this.ctx.stroke();
    this.matMenuTrigger.openMenu();
  }

  addNode() {
    const dialogRef = this.dialog.open(SelectNodeComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null)
        console.log('entre ')
      this.ctx.beginPath();
      this.ctx.arc(this.cursor.x, this.cursor.y, 10, 0, 360);
      this.ctx.closePath();
      this.ctx.stroke();
    });
  }

  addConnection() {

  }

  zoom_in() {
    this.scale += 1;
    this.clear();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(640 / 2, 200 / 2)
    this.ctx.scale(this.scale, this.scale)!;
    this.beginDraw();
  }

  zoom_out() {
    this.clear();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.scale > 1) this.scale -= 1;
    this.ctx.scale(this.scale, this.scale)!;
    this.beginDraw();
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NodeService } from '../node.service';
import { SelectNodeComponent } from '../select-node/select-node.component';
import { Node } from '../interfaces/node';
import { ReplaySubject } from 'rxjs';
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
  @ViewChild('Trigger', { static: true }) matMenuTrigger!: MatMenuTrigger;
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
    this.nodeService.getAllVisible(localStorage.getItem('project')!).then((nodes) => {
      (<Node[]>nodes).forEach(element => {
        if (element.visible === true) {
          this.ctx.beginPath();
          this.ctx.arc(element.coord.x, element.coord.y, 10, 0, 360);
          this.ctx.fillText(element.name, element.coord.x + 10, element.coord.y - 10);
          this.ctx.closePath();
          this.ctx.stroke();
        }
      });
    });
  }

  menu(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    this.inNode().then((accept)=>{}).catch(()=>{
      this.matMenuTrigger.openMenu();
    })
  }

  menuOutside(event:MouseEvent){
    
  }

  addNode() {
    const dialogRef = this.dialog.open(SelectNodeComponent, {
      width: '250px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.selectNode(result);
    });
  }

  selectNode(id: string) {
    this.nodeService.getOneById(localStorage.getItem('project')!, id).then((node) => {
      this.setVisibleNode(node as Node);
    });
  }

  async setVisibleNode(node: Node) {
    node.coord = { x: this.cursor.x, y: this.cursor.y };
    node.visible = true;
    await this.nodeService.nodeSetVisible(node).then((resolve) => {
      console.log('Resolve:', resolve);
      this.ctx.beginPath();
      this.ctx.arc(this.cursor.x, this.cursor.y, 10, 0, 360);
      this.ctx.fillText(node.name, this.cursor.x + 10, this.cursor.y - 10);
      this.ctx.closePath();
      this.ctx.stroke();
    });
  }

  async inNode(): Promise<boolean> {
    return new Promise (async (accept,reject)=>{
      await this.nodeService.getAllVisible(localStorage.getItem('project')!).then((node) => {
        const exist = (<Node[]>node).find(element => this.distance(element.coord.x, element.coord.y, this.cursor.x, this.cursor.y) < 20)
        if (exist) accept(true);
      });
      reject(false);
    })
  }

  hiddenNode() {

  }

  distance(x: number, y: number, xx: number, yy: number): number {
    return Math.pow(Math.pow(x - xx, 2) + Math.pow(y - yy, 2), 1 / 2);
  }

  setVisibleNodeFalse(node: Node) {
    node.visible = false;
    this.nodeService.nodeSetVisible(node).then((resolve) => {
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

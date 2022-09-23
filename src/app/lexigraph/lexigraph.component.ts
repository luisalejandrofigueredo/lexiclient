import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NodeService } from '../node.service';
import { NodeConnectionsService } from "../node-connections.service";
import { SelectNodeComponent } from '../select-node/select-node.component';
import { Node } from '../interfaces/node';
import { TrigonometryService } from "../trigonometry.service";
import { Point } from "../interfaces/point";
@Component({
  selector: 'app-lexigraph',
  templateUrl: './lexigraph.component.html',
  styleUrls: ['./lexigraph.component.scss']
})
export class LexigraphComponent implements OnInit, AfterViewInit {
  context!: CanvasRenderingContext2D;
  menuTopLeftPosition = { x: '0', y: '0' };
  canvasContext: any;
  typeMenu: number = 0;
  cursor: Point = { x: 0, y: 0 };
  @ViewChild('myCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  private ctx!: CanvasRenderingContext2D;
  scale = 1
  cacheNode!: Node;
  constructor(private ngZone: NgZone, private connectionsService: NodeConnectionsService, private tr: TrigonometryService, private nodeService: NodeService, public dialog: MatDialog) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement;
    this.ctx = this.canvasContext.getContext('2d')!;
    this.beginDraw();
  }



  fillCircle(x: number, y: number, radius: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = 'black';
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
          this.drawNode(element.coord.x, element.coord.y, element.name);
        }
      });
    });
  }

  drawNode(x: number, y: number, name: string) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, 360);
    this.ctx.fillText(name, x + 10, y - 10);
    this.ctx.closePath();
    this.ctx.stroke();
    this.fillCircle(x, y, 10, 'red');
  }

  async menu(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    await this.inNode().then((accept) => {
      console.log('innode');
      this, this.typeMenu = 1;
      this.cacheNode = <Node>accept;
      this.matMenuTrigger.openMenu();
    }).catch(async () => {
      await this.inLine(this.cursor).then((_accept) => {
        console.log('inline');
        this.typeMenu = 2;
        this.matMenuTrigger.openMenu();
      }).catch((_reject) => {
        console.log('offline');
        this.typeMenu = 0;
        this.matMenuTrigger.openMenu();
      });
    })
  }

  async inLine(cursor: Point): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        var retResolve: boolean = false;
        await this.nodeService.getAll(localStorage.getItem('project')!).then(async (nodes) => {
          for (let index = 0; index < (<Node[]>nodes).length; index++) {
            const element = (<Node[]>nodes)[index];
            let prom=await this.verifyPosition(element, cursor).then((_accept) => {
              console.log('retResolve===true');
              retResolve = true;
            }).catch((_reject)=>{console.log('outside line');}) 
            console.log('ret promise',prom)
          }
        }).catch(() => console.log('error en get all'));
        console.log('ret resolve', retResolve);
        if (retResolve) {
          console.log('resolve inline')
          resolve(true);
        } else {
          console.log('reject inline')
          reject(false);
        }
      } catch (error) {
         console.log('error in promise')
      }
    });
  }

  verifyPosition(node: Node, cursor: Point): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        for (let index = 0; index < node.nodeConnection.length; index++) {
          const element = node.nodeConnection[index];
          await this.nodeService.getOneByName(localStorage.getItem('project')!, element.toName).then((nodeToName) => {
            if (this.tr.inLine(cursor.x, cursor.y, node.coord.x, node.coord.y, (<Node>nodeToName).coord.x, (<Node>nodeToName).coord.y) === true) {
              resolve(true);
            }
          }).catch(() => console.log('not found'))
        }
        reject(true);
      } catch (error) {
       console.log('Error en promise')  
      }
    })
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

  menuViewConnections() {
    this.nodeService.getOneById(localStorage.getItem('project')!, <string>this.cacheNode._id).then((node) => {
      this.viewConnections(node as Node);
    });
  }

  selectNodeHide() {
    this.nodeService.getOneById(localStorage.getItem('project')!, <string>this.cacheNode._id).then((node) => {
      this.setHideNode(node as Node);
    });
  }

  async setVisibleNode(node: Node) {
    node.coord = { x: this.cursor.x, y: this.cursor.y };
    node.visible = true;
    await this.nodeService.nodeSetVisible(node).then((_resolve) => {
      this.drawNode(this.cursor.x, this.cursor.y, node.name);
    });
  }

  async setHideNode(node: Node) {
    node.visible = false;
    await this.nodeService.nodeSetVisible(node).then((_resolve) => {
      this.clear();
      this.beginDraw();
    });
  }

  viewConnections(node: Node): void {
    node.nodeConnection?.forEach(element => {
      this.nodeService.getOneByName(localStorage.getItem('project')!, element.name).then((node) => {
        if ((<Node>node).visible === true) {
          this.nodeService.getOneByName(localStorage.getItem('project')!, element.toName).then((toNode) => {
            this.drawConnection(<Node>node, <Node>toNode);
            this.beginDraw();
          })
        }
      });
    })
  }

  drawConnection(node: Node, toNode: Node) {
    if (node.visible === true && toNode.visible === true) {
      const nodeAngle = this.tr.angle(node.coord.x, node.coord.y, toNode.coord.x, toNode.coord.y);
      const toNodeAngle = this.tr.angle(toNode.coord.x, toNode.coord.y, node.coord.x, node.coord.y);
      const moveNode = this.tr.move(node.coord.x, node.coord.y, nodeAngle, 20);
      const moveToNode = this.tr.move(toNode.coord.x, toNode.coord.y, toNodeAngle, 20);
      this.ctx.beginPath();
      this.ctx.moveTo(moveNode.x, moveNode.y);
      this.ctx.lineTo(moveToNode.x, moveToNode.y);
      this.ctx.stroke();
      this.fillCircle(moveNode.x, moveNode.y, 3, 'black');
      this.fillCircle(moveToNode.x, moveToNode.y, 3, 'black');
    }
  }

  async inNode(): Promise<Node | boolean> {
    return new Promise(async (accept, reject) => {
      await this.nodeService.getAllVisible(localStorage.getItem('project')!).then((node) => {
        const exist = (<Node[]>node).find(element => this.tr.distance(element.coord.x, element.coord.y, this.cursor.x, this.cursor.y) < 20)
        if (exist) accept(exist);
      });
      reject(false);
    })
  }

  setVisibleNodeFalse(node: Node) {
    node.visible = false;
    this.nodeService.nodeSetVisible(node).then((_resolve) => {
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

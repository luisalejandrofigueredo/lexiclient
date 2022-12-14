import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodenewComponent } from './nodenew/nodenew.component';
import { ViewnodesComponent } from './viewnodes/viewnodes.component'
import { DeleteAllNodesComponent } from './delete-all-nodes/delete-all-nodes.component'
import { NewConnectionComponent } from './new-connection/new-connection.component';
import { NodeEditComponent } from './node-edit/node-edit.component';
import { ViewConnectionsComponent } from './view-connections/view-connections.component';
import { EditConnectionComponent } from './edit-connection/edit-connection.component';
import { DeleteAllConnectionsComponent } from './delete-all-connections/delete-all-connections.component';
import { ViewNodeConnectionsComponent } from './view-node-connections/view-node-connections.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RunMachineComponent } from './run-machine/run-machine.component';
import { CopyProjectComponent } from "./copy-project/copy-project.component";
import { ViewNodesDirectConnectionsComponent } from "./view-nodes-direct-connections/view-nodes-direct-connections.component";
import { LexigraphComponent } from "./lexigraph/lexigraph.component";
const routes: Routes = [
  { path: 'newNode', component: NodenewComponent },
  { path: 'viewNodes', component: ViewnodesComponent },
  { path: 'deleteAllNodes', component: DeleteAllNodesComponent },
  { path: 'addConnection/:action/:id', component: NewConnectionComponent },
  { path: 'viewConnections', component: ViewConnectionsComponent },
  { path: 'nodeEdit/:name', component: NodeEditComponent },
  { path: 'editConnection/:id', component: EditConnectionComponent },
  { path: 'deleteAllConnections', component: DeleteAllConnectionsComponent },
  { path: 'viewNodeConnections', component: ViewNodeConnectionsComponent },
  { path: 'newProject', component: NewProjectComponent },
  { path: 'viewProjects', component: ViewProjectsComponent },
  { path: 'projectEdit/:id', component: ProjectEditComponent },
  { path: 'runMachine', component: RunMachineComponent },
  { path:'contentCopy/:id',component:CopyProjectComponent},
  { path: 'viewNodesDirectConnection/:id',component:ViewNodesDirectConnectionsComponent},
  { path:'graph',component:LexigraphComponent},
  { path: '', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

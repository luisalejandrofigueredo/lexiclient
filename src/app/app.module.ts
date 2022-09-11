import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigatorComponent } from './navigator/navigator.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from '../environments/environment';
import { NodenewComponent } from './nodenew/nodenew.component';
import { ViewnodesComponent } from './viewnodes/viewnodes.component';
import { DeleteAllNodesComponent } from './delete-all-nodes/delete-all-nodes.component';
import { NewConnectionComponent } from './new-connection/new-connection.component';
import { NodeEditComponent } from './node-edit/node-edit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewConnectionsComponent } from './view-connections/view-connections.component';
import { EditConnectionComponent } from './edit-connection/edit-connection.component';
import { DeleteAllConnectionsComponent } from './delete-all-connections/delete-all-connections.component';
import { YesNoComponent } from './yes-no/yes-no.component';
import { ViewLanguageComponent } from './view-language/view-language.component';
import { AddLanguageComponent } from './add-language/add-language.component';
import {InterceptorInterceptor} from './interceptor.interceptor';
import { ViewNodeConnectionsComponent } from './view-node-connections/view-node-connections.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RunMachineComponent } from './run-machine/run-machine.component';
import { CopyProjectComponent } from './copy-project/copy-project.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ViewNodesConnectionsComponent } from './view-nodes-connections/view-nodes-connections.component';
import { ViewNodesDirectConnectionsComponent } from './view-nodes-direct-connections/view-nodes-direct-connections.component';
import { ViewNodesDirectConnectionsInverseComponent } from './view-nodes-direct-connections-inverse/view-nodes-direct-connections-inverse.component';
@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    NodenewComponent,
    ViewnodesComponent,
    DeleteAllNodesComponent,
    NewConnectionComponent,
    NodeEditComponent,
    ViewConnectionsComponent,
    EditConnectionComponent,
    DeleteAllConnectionsComponent,
    ViewLanguageComponent,
    AddLanguageComponent,
    ViewNodeConnectionsComponent,
    NewProjectComponent,
    ViewProjectsComponent,
    ProjectEditComponent,
    MainPageComponent,
    RunMachineComponent,
    CopyProjectComponent,
    ViewNodesConnectionsComponent,
    ViewNodesDirectConnectionsComponent,
    ViewNodesDirectConnectionsInverseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTooltipModule,
    FlexLayoutModule,
    YesNoComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

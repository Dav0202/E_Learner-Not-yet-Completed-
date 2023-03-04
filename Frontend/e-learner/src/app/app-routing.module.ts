import { Error404Component } from './error404/error404.component';
import { AssignmentEditGuard } from './guard/assignment-edit.guard';
import { MaterialViewComponent } from './material-view/material-view.component';
import { MaterialsComponent } from './materials/materials.component';
import { GradedAssignmentComponent } from './graded-assignment/graded-assignment.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { DetailAssignmentComponent } from './detail-assignment/detail-assignment.component';
import { AssignmentResolverService } from './services/assignment-resolver.service';
import { GuardsGuard } from './guard/guards.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'homepage' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'assignment',
    component: AssignmentComponent,
    canActivate: [GuardsGuard],
  },
  {
    path: 'create-assignment',
    component: CreateAssignmentComponent,
    canActivate: [GuardsGuard],
  },
  {
    path: 'scores',
    component: GradedAssignmentComponent,
    canActivate: [GuardsGuard],
  },
  {
    path: `assignment/:id`,
    component: DetailAssignmentComponent,
    resolve: { assignment: AssignmentResolverService },
    canDeactivate:[AssignmentEditGuard],
    canActivate: [GuardsGuard],
  },
  {
    path: 'material-upload',
    component: MaterialsComponent,
    canActivate: [GuardsGuard],
  },
  {
    path: `material`,
    component: MaterialViewComponent,
    canActivate: [GuardsGuard],
  },
  { path: '**', component: Error404Component, canActivate: [GuardsGuard], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

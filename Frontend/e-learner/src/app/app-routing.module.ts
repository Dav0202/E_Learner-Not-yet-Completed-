import { MaterialsComponent } from './materials/materials.component';
import { GradedAssignmentComponent } from './graded-assignment/graded-assignment.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { DetailAssignmentComponent } from './detail-assignment/detail-assignment.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'homepage' },
  { path: 'homepage', component: HomepageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'assignment', component: AssignmentComponent},
  { path: 'create-assignment', component: CreateAssignmentComponent},
  { path: 'scores', component: GradedAssignmentComponent},
  { path: `assignment/:id`, component: DetailAssignmentComponent},
  { path: 'material', component: MaterialsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

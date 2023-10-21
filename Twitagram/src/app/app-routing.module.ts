import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',component: HomeComponent ,pathMatch: 'full' },
  { path: 'home',component: HomeComponent },
  { path: 'posts', loadChildren: () => import('./post/post.module').then(m => m.PostModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

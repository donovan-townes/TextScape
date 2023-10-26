import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserModule } from './user/user.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './user/profile/profile.component';

const routes: Routes = [
  { path: '',component: HomeComponent ,pathMatch: 'full' },
  { path: 'home',component: HomeComponent },
  { path: 'posts', loadChildren: () => import('./post/post.module').then(m => m.PostModule) },
  { path: 'users/:username/profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

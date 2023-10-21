import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed/feed.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostRoutingModule } from './post-routing/post-routing.module';

@NgModule({
  declarations: [
    FeedComponent,
    PostDetailComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PostRoutingModule
  ]
})
export class PostModule { }

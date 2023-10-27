import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed/feed.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostRoutingModule } from './post-routing/post-routing.module';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FeedComponent,
    PostDetailComponent,
    CreateComponent,
    CommentComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PostRoutingModule,
    FormsModule
  ]
})
export class PostModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private API_URL = `http://localhost:8000/api`; // Django API URL
  constructor(private http: HttpClient) { }

  // Post Operations
  getPosts(): Observable<any> {
    return this.http.get(`${this.API_URL}/posts/`);
  }

  getPostDetail(id:number): Observable<any> {
    return this.http.get(`${this.API_URL}/posts/${id}/`);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/posts/`, postData);
  }

  updatePost(id: number, postData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/posts/${id}/`, postData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/posts/${id}/`);
  }

  // Like Operations
  likePost(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/posts/${id}/like/`, {});
  }

  unlikePost(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/posts/${id}/like/`);
  }
  // Comment Operations
  listComments(postId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/posts/${postId}/comments/`);
  }
  
  createComment(postId: number, commentData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/posts/${postId}/comment/`, commentData);
  }

  deleteComment(postId: number, commentId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/posts/${postId}/comment/${commentId}/`);
  }

  // User Operations
  getUserDetail(username: string): Observable<any> {
    return this.http.get(`${this.API_URL}/users/${username}/`);
  }

  followUser(username: string): Observable<any> {
    return this.http.post(`${this.API_URL}/users/${username}/follow/`, {});
  }

  unfollowUser(username: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${username}/follow/`);
  }

  followers(username: string): Observable<any> {
    return this.http.get(`${this.API_URL}/users/${username}/followers/`);
  }

  getUserFeed(username: string): Observable<any> {
    return this.http.get(`${this.API_URL}/users/${username}/feed/`);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private API_URL = `http://localhost:8000/api`; // Django API URL

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get(`${this.API_URL}/posts/`); // assuming posts/ is endpoint
  }

  getPostDetail(id:number): Observable<any> {
    return this.http.get(`${this.API_URL}/posts/${id}/`);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/posts/`, postData);
  }
}

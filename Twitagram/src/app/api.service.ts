import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  username: string;
  email: string;
  password: string;
  password2?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = 'http://localhost:8000'; //Django API URL

  constructor(private http: HttpClient) { }

  register(userData: User): any {
    return this.http.post(`${this.API_URL}/api/register/`, userData);
  }

  login(loginData: {username: string, password: string}): any {
    return this.http.post(`${this.API_URL}/api/token/`, loginData);
  }
}
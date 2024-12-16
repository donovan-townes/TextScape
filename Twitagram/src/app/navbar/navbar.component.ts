import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  openUserMenu() {
    console.log("Opening User Menu")
    let element= document.getElementById('dropdown-menu')
    element?.classList.toggle("md:hidden")

  }
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}

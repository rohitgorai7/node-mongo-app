import { Component, OnInit } from '@angular/core';
import { MainApiService } from '../services/main-api.service';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any = [];

  constructor(private mainApiService: MainApiService, private mainService: MainService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers() {
    try {
      const response: any = await this.mainApiService.getUsers();
      this.users = response['users'];
    } catch (error) {
      console.log(error);
    }
  }

}

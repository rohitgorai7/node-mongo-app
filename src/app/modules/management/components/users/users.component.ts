import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainApiService } from 'src/app/modules/main/services/main-api.service';
import { MainService } from 'src/app/modules/main/services/main.service';
import { NotificationService } from 'src/app/notification.service';
import { MESSAGES } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any = [];

  constructor(private mainApiService: MainApiService, private mainService: MainService, private ngxSpinnerService: NgxSpinnerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers() {
    try {
      this.ngxSpinnerService.show();
      const response: any = await this.mainApiService.getUsers();
      this.users = response['users'];
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG );
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

}

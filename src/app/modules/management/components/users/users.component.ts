import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainApiService } from 'src/app/modules/main/services/main-api.service';
import { MainService } from 'src/app/modules/main/services/main.service';
import { NotificationService } from 'src/app/notification.service';
import { MESSAGES, USER_STATUS } from 'src/app/shared/constants/constants';
import { ManagementApiService } from '../../services/management-api.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any = [];

  constructor(private commonService: CommonService, private router: Router, private mainApiService: MainApiService, public mainService: MainService, private managementApiService: ManagementApiService, private ngxSpinnerService: NgxSpinnerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  async updateUser(user: any) {
    try {
      this.ngxSpinnerService.show();
      const payload = {
        _id: user._id,
        action: 'status',
        status: user.status === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE
      }
      const response: any = await this.managementApiService.updateUser(payload);
      this.notificationService.success(response["message"]);
      this.getUsers();
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG);
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  async getUsers() {
    try {
      this.ngxSpinnerService.show();
      const response: any = await this.mainApiService.getUsers();
      this.users = response['users'];
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG);
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  navigateToChat(user: any) {
    this.commonService.currentChatData = user;
    this.router.navigate(['management/chat']);
  }

}

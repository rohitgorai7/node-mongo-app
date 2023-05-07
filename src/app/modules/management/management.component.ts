import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { WebApiService } from 'src/app/shared/services/web-api.service';
import { MainService } from '../main/services/main.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private webApiService: WebApiService, private notificationService: NotificationService, private mainService: MainService) { }

  ngOnInit(): void {
    this.continuousApis();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  continuousApis() {
    if(this.mainService.user && this.mainService.user.isLoggedIn) {
      this.subscription = interval(30000).subscribe(() => {
        if(this.mainService.user && this.mainService.user.isLoggedIn) {
          this.getUserData();
        }
      });
    }
  }

  async getUserData() {
    try {
      const params = {
        cached: true
      }
      const response = await this.webApiService.getLoggedInData(params);
      this.mainService.setUser(response);
    } catch (error) {
      this.notificationService.error(error.error.message || error.message);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { WebApiService } from 'src/app/shared/services/web-api.service';
import { MainService } from '../main/services/main.service';
import { Subscription, map, timer } from 'rxjs';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  timerSubscription: Subscription;

  constructor(private webApiService: WebApiService, private notificationService: NotificationService, private mainService: MainService) { }

  ngOnInit(): void {
    // if(this.mainService.user) {
    //   this.timerSubscription = timer(0, 10000).pipe(
    //     map(() => {
    //       console.log(this.mainService.user.isLoggedIn);
    //       if(this.mainService.user.isLoggedIn) {
    //         this.getUserData();
    //       }
    //     })
    //   ).subscribe();
    // }
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from 'src/app/modules/main/services/main.service';
import { NotificationService } from 'src/app/notification.service';
import { MESSAGES } from 'src/app/shared/constants/constants';
import { WebApiService } from 'src/app/shared/services/web-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private webApiService: WebApiService, private ngxSpinnerService: NgxSpinnerService,private router: Router, public mainService: MainService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  async logout() {
    try {
      this.ngxSpinnerService.show();
      const response: any = await this.webApiService.logout();
      this.mainService.clearSession();
      this.notificationService.success(response.message);
      this.navigateTo('/');
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG );
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  navigateTo(path = '') {
    this.router.navigate([path]);
  }

  activeIf(path= '') {
    console.log(this.router.url === path)
    return this.router.url === path || this.router.url.includes(path);
  }

}

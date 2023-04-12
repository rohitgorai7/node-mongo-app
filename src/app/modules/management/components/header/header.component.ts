import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from 'src/app/modules/main/services/main.service';
import { NotificationService } from 'src/app/notification.service';
import { WebApiService } from 'src/app/shared/services/web-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private webApiService: WebApiService, private ngxSpinnerService: NgxSpinnerService,private router: Router, private mainService: MainService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  async logout() {
    try {
      this.ngxSpinnerService.show();
      const response: any = await this.webApiService.logout();
      this.mainService.clearSession();
      this.notificationService.success(response.message);
      this.router.navigate(['/']);
    } catch (error) {
      this.notificationService.error(error['message']);
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

}

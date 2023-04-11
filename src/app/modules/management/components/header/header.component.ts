import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from 'src/app/modules/main/services/main.service';
import { WebApiService } from 'src/app/shared/services/web-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private webApiService: WebApiService, private ngxSpinnerService: NgxSpinnerService,private router: Router, private mainService: MainService) { }

  ngOnInit(): void {
  }

  async logout() {
    try {
      this.ngxSpinnerService.show();
      const response = await this.webApiService.logout();
      console.log(response);
      this.mainService.clearSession();
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

}

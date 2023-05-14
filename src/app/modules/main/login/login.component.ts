import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { MainApiService } from '../services/main-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { MESSAGES } from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  showSpinner: boolean = false;

  constructor(public commonService: CommonService, private fb: FormBuilder, private router: Router, private mainService: MainService, private mainApiService: MainApiService, private activatedRoute: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService, private notificationService: NotificationService) {
    if(this.mainService.user && mainService.user.token) {
      this.navigate('/management/chat');
    }
    this.generateForm();
   }

  ngOnInit(): void {}

  generateForm() {
    this.loginForm = this.fb.group({
      username: [this.activatedRoute.snapshot.paramMap.get('username') || null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async login() {
    try {
      this.ngxSpinnerService.show();
      if(this.loginForm.status !=="VALID") {
        return;
      }
      const payload = {
        username: this.loginForm.controls['username'].value,
        password: btoa(this.loginForm.controls['password'].value)
      }
      const response: any = await this.mainApiService.login(payload);
      this.loginForm.reset();
      this.mainService.setUser(response['user']);
      this.notificationService.success(response['message']);
      this.navigate('management/chat');
    } catch (error) {
      this.notificationService.error(error.error?.message || MESSAGES.WENT_WRONG );
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

}

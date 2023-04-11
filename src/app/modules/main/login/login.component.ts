import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { MainApiService } from '../services/main-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  showSpinner: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private mainApiService: MainApiService, private activatedRoute: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) {
    this.generateForm();
   }

  ngOnInit(): void {
    const user = this.mainService.getUserData();
    if(user.token) {
      this.navigate('management/users');
    }
  }

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
      const response = await this.mainApiService.login(payload);
      this.mainService.setSessionStorage(response);
      this.navigate('management/users');
      this.loginForm.reset();
    } catch (error) {
      console.log(error);
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

}

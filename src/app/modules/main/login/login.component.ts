import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { MainApiService } from '../services/main-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private mainApiService: MainApiService) {
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
      username:[ null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async login() {
    try {
      if(this.loginForm.status !=="VALID") {
        return;
      }
      const payload = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value
      }
      const response = await this.mainApiService.login(payload);
      this.mainService.setSessionStorage(response);
      this.navigate('management/users');
    } catch (error) {
      console.log(error);
    }
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

}

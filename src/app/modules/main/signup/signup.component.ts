import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainApiService } from '../services/main-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private mainApiService: MainApiService, private ngxSpinnerService: NgxSpinnerService) {
    this.generateForm();
  }

  ngOnInit(): void { }

  generateForm() {
    this.signupForm = this.formBuilder.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  async signup() {
    try {
      if(this.signupForm.status !== 'VALID') {
        return;
      }
      this.ngxSpinnerService.show();
      const payload = {
        "name": this.signupForm.controls["name"].value,
        "username": this.signupForm.controls["username"].value,
        "email": this.signupForm.controls["email"].value,
        "password": btoa(this.signupForm.controls["password"].value)
      }
      await this.mainApiService.signup(payload);
      const params = {
        username: this.signupForm.controls['username'].value
      }
      this.signupForm.reset();
      this.navigate('login', params);
    } catch (error) {
      console.log(error);
    } finally {      
      this.ngxSpinnerService.show();
    }
  }

  navigate(path: string, params: any = {}) {
    this.router.navigate([path, params]);
  }

}

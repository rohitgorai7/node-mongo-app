import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService) {
    this.generateForm();
   }

  ngOnInit(): void {
    this.mainService.clearSession();
  }

  generateForm() {
    this.loginForm = this.fb.group({
      email: null,
      username: null,
      password: [null, Validators.required]
    });
  }

  login() {

  }

  navigate(url: string) {
    this.router.navigate([`${url}`]);
  }

}

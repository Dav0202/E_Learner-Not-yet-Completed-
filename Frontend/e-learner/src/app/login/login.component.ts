import { Directive, Renderer2, ElementRef, OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NewUserService } from '../services/new-user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  constructor(
    private renderer: Renderer2, private el: ElementRef,
    private formBuilder: FormBuilder,
    private router: Router,
    private ns: NewUserService
    ) { }

  ngOnInit(): void {

  }
  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    //password2: ['', [Validators.required, Validators.minLength(6)]],
    username: ['',[Validators.required]],
    first_name: ['',[Validators.required]],
    last_name: ['',[Validators.required]],
    is_student: [null, [Validators.required]],
    is_educator: [null, [Validators.required]],
  });

  signup(){
    this.ns.newUsers(this.signupForm.value).subscribe()
    console.log(this.signupForm.value)
    this.signupForm.reset()
  }

  onClickeducator(){
    this.signupForm.patchValue({
      is_student: false,
      is_educator: true
    });
  }

  onClickstudent(){
    this.signupForm.patchValue({
      is_student: true,
      is_educator: false
    });
  }

  switch_right(){
    const container = document.getElementById('container');
    this.renderer.addClass(container, "right-panel-active");
  }

  switch_left(){
    const container = document.getElementById('container');
    this.renderer.removeClass(container, "right-panel-active");
  }
}



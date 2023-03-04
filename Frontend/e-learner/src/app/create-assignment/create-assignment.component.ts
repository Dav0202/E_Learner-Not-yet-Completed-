import { NewUserService } from './../services/new-user.service';
import { CookieService } from 'ngx-cookie-service';
import { AssignmentService } from './../services/assignment.service';
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';

import { FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators} from '@angular/forms';


@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css']
})
export class CreateAssignmentComponent implements OnInit {

  questionForm!: FormGroup;

  class_list = [
    { name: 'Primary 1', value: 'Pry 1'},
    { name: 'Primary 2', value: 'Pry 2'},
    { name: 'Primary 3', value: 'Pry 3'},
    { name: 'Primary 4', value: 'Pry 4'},
    { name: 'Primary 5', value: 'Pry 5'},
    { name: 'Primary 6', value: 'Pry 6'},
  ];

  subject_list = [
    { name: 'Basic Science', value: 'BSC'},
    { name: 'English', value: 'ENG'},
    { name: 'Mathematics', value: 'MAT'},
    { name: 'Geography', value: 'GEO'},
    { name: 'History', value: 'HSY'},
  ];


  get question(): FormArray {
    return this.questionForm.get("question") as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private as: AssignmentService,
    private cookieservice: CookieService,
    public ns: NewUserService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.questionForm = new FormGroup({
      title: new FormControl('',[Validators.required]),
      subject: new FormControl('',[Validators.required]),
      classes: new FormControl('',[Validators.required]),
      educator: new FormControl('',[Validators.required]),
      question: this.fb.array([this.buildQuestion()]),
    });
  }

  onTouched: () => void = () => {};

  buildQuestion(): FormGroup {
    return this.fb.group({
      question: "",
      answer: "",
      choices: this.fb.array([this.buildChoices()])
    });
  }

  buildChoices(): FormControl {
    return new FormControl();
  }

  choices(groupName: string, i: number): Array<FormControl> {
    return this.choiceFormArray(groupName, i).controls as Array<FormControl>;
  }

  choiceFormArray(groupName: string, i: number) {
    return (this.questionForm.get(groupName) as FormArray).controls[i].get(
      "choices"
    ) as FormArray;
  }

  addChoices(groupName: string, i = 0): void {
    this.choiceFormArray(groupName, i).push(this.buildChoices());
    console.log(this.choiceFormArray)
  }

  removeChoices(groupName: string, i = 0): void {
    const choice = this.choiceFormArray(groupName, i)
    if (choice.length > 1) choice.removeAt(i);
    console.log(this.choiceFormArray)
  }

  addQuestion(): void {
    this.question.push(this.buildQuestion());
    console.log(this.question)
  }

  removeQuestion(index: number){
    if (this.question.length > 1) this.question.removeAt(index);
   // else this.question.patchValue([{question: null, answer: null, choices:new Array}]);
   console.log(this.question)
  }

  setteacher(){
    let decryptcookies = this.ns.toDecryptStudentEducator()
    console.log(decryptcookies)
    if (decryptcookies.educator === "true" && decryptcookies.student === "false") {
      this.questionForm.patchValue({
        educator: JSON.parse(decryptcookies.email)
      });
    }
  }

  submitQ(){
    this.setteacher()
    console.log(this.questionForm.value)
    this.as.createAssignment(this.questionForm.value).subscribe()
  }

  @HostListener('window:scroll', ['$event'])
  scrollFunction(event:any){
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      const container = document.getElementById('navbar');
      this.renderer.addClass(container, "fixed-top");
      this.renderer.addClass(document.body, "header-small")
      this.renderer.addClass(document.body, "body-top-padding");
    } else {
      const container = document.getElementById('navbar');
      this.renderer.removeClass(container,"fixed-top" )
      this.renderer.removeClass(document.body, "header-small")
      this.renderer.removeClass(document.body,"body-top-padding" )
    }
  }



  @HostListener('window:resize', ['$event'])
  onResize(event:any){
    const container = document.getElementById('navbarSupportedContent');
    let w = event.target.innerWidth;
    if(w>=992) {
      this.renderer.removeClass(document.body,'sidebar-open')
      this.renderer.removeClass(container, "show")
    }
  }
}

import { Router } from '@angular/router';
import { NewUserService } from './../services/new-user.service';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { MaterialService } from './../services/material.service';
import { Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

  constructor(
    private uploadService: MaterialService,
    private formBuilder: FormBuilder,
    public ns: NewUserService,
    private renderer: Renderer2,
    private router: Router
  ) { }

  fileName = '';
  uploadProgress!:number;
  uploadSub!: Subscription;


  ngOnInit(): void {

  }

  myForm = new FormGroup({
    uploader: new FormControl(''),
    material: new FormControl(''),
    description: new FormControl('')
  });

  get f(){
    return this.myForm.controls;
  }

  setstudent(){
    let decryptcookies = this.ns.toDecryptStudentEducator()
    if (decryptcookies.educator === "true" && decryptcookies.student === "false") {
      return JSON.parse(decryptcookies.email)
    }
  }

  onFileChange(event:any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        uploader: this.setstudent(),
        material: file
      });
    }
  }

  submit(){
    const formData = new FormData();
    formData.append('material', this.myForm.get('material')!.value);
    formData.append('uploader', this.myForm.get('uploader')!.value);
    formData.append('description', this.myForm.get('description')!.value);
    console.log(this.myForm.value);
    this.uploadService.postdata(formData).subscribe(res => {
        if (res.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (res.loaded / res.total));
        }
        this.router.navigate(['/', 'homepage'])
    })
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null as any;
    this.uploadSub = null as any;
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

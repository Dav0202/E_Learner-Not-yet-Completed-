import { NewUserService } from './../services/new-user.service';
import { Component, ElementRef, HostBinding, HostListener, OnInit, Renderer2, Directive,  } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(
    public ns: NewUserService,
    private renderer: Renderer2, private el: ElementRef,
  ) { }


  private unlistener!: () => void;

  ngOnInit(): void {
  }

  @HostBinding('navbarSupportedContent') shown!: any;
  @HostBinding('navbarSupportedContent') hidden!:any;

  @HostListener('click') sideBar() {
    this.shown = this.showmenu()
    this.hidden = this.closemenu()
  }

  @HostBinding()
  openMenu(event:any){
      const container = document.getElementById('body');
      this.renderer.addClass(container,"sidebar-open");
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

  showmenu(){

  }

  closemenu(){
    const container2 = document.getElementById('navbarSupportedContent');
    const container = document.getElementById('body');
    container2?.onclick
    this.renderer.removeClass(container,"sidebar-open");
  }



}

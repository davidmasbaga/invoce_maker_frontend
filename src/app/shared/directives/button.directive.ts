import { Directive, ElementRef, Input, OnInit, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[customButton]',
})
export class ButtonDirective implements OnInit {
  @Input() hoverAnimation: 'animation1' | 'animation2' = 'animation1';

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit(): void {

    this.applyHoverAnimation();
  }

  private applyHoverAnimation() {
    const button = this.el.nativeElement;
    this.renderer.addClass(button, 'hover-button'); 

    if (this.hoverAnimation === 'animation1') {
      this.renderer.addClass(button, 'hover-animation1');
    } else if (this.hoverAnimation === 'animation2') {
      this.renderer.addClass(button, 'hover-animation2');
    }
  }

  @HostListener('mouseover') onMouseOver() {
    const button = this.el.nativeElement;
    if (this.hoverAnimation === 'animation1') {
      this.renderer.addClass(button, 'hover-animation1-active');
    } else if (this.hoverAnimation === 'animation2') {
      this.renderer.addClass(button, 'hover-animation2-active');
    }
  }

  @HostListener('mouseout') onMouseOut() {
    const button = this.el.nativeElement;
    this.renderer.removeClass(button, 'hover-animation1-active');
    this.renderer.removeClass(button, 'hover-animation2-active');
  }
}

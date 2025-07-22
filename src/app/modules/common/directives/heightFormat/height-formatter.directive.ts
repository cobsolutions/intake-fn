import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appHeightFormatter]'
})
export class HeightFormatterDirective {
  private regex = /^\d{0,1}(\.\d{0,2})?$/; // max 1 digit before and 2 digits after decimal
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    let input = this.el.nativeElement.value.replace(/\D/g, '');
    
    let formatted = '';
    if (input.length <= 1) {
      formatted = input;
    } else if (input.length <= 3) {
      const feet = input.charAt(0);
      const inches = input.slice(1);
      formatted = `${feet}'${inches}"`;
    } else {
      const feet = input.slice(0, input.length - 2);
      const inches = input.slice(-2);
      formatted = `${feet}'${inches}"`;
    }

    // Update input value visually
    this.el.nativeElement.value = formatted;

    // Update the underlying form control with raw or formatted value
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}

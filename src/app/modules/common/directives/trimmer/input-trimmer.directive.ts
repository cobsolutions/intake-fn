import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[input-trimmer]'
})
export class InputTrimmerDirective {

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('blur', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const trimmedValue = input.value.trim();
    this.control?.control?.setValue(trimmedValue, { emitEvent: false });
  }

}

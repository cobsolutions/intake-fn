import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appHeightFormatter]'
})
export class HeightFormatterDirective {
  private regex = /^\d{0,1}(\.\d{0,2})?$/; // max 1 digit before and 2 digits after decimal
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (!value) return;

    // Remove all non-digit and extra dots
    let cleaned = value.replace(/[^0-9.]/g, '');

    // Only allow one dot
    const parts = cleaned.split('.');
    const integer = parts[0].slice(0, 3); // up to 3 digits
    const decimal = parts[1]?.slice(0, 2); // up to 2 decimal digits

    const formatted = decimal !== undefined ? `${integer}.${decimal}` : integer;

    // Set value to the form control without emitting extra event
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}

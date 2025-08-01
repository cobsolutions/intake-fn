import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heightFormat'
})
export class HeightFormatPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    if (value == null) return '';

    // Convert to string and remove non-digits
    let digits = value.toString().replace(/\D/g, '');

    if (digits.length === 0) return '';
    if (digits.length <= 1) {
      return `${parseInt(digits)}'`;
    }

    if (digits.length <= 3) {
      const feet = digits.slice(0, 1);
      const inches = digits.slice(1);
      return inches ? `${parseInt(feet)}'${parseInt(inches)}"` : `${parseInt(feet)}'`;
    }

    const feet = digits.slice(0, digits.length - 2);
    const inches = digits.slice(-2);
    return `${parseInt(feet)}'${parseInt(inches)}"`;
  }

}

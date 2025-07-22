import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weightFormat'
})
export class WeightFormatPipe implements PipeTransform {

  transform(value: any): string {
    if (value == null) return '';

    // Convert to string and normalize input
    let str = String(value);

    // Remove all non-digit and non-dot characters
    str = str.split('').filter((ch, i) => {
      return /[0-9]/.test(ch) || (ch === '.' && str.indexOf('.') === i);
    }).join('');
    
    // Split integer and decimal
    const [intPart, decimalPart] = str.split('.');

    const cleanInt = intPart.slice(0, 3);
    const cleanDecimal = decimalPart ? decimalPart.slice(0, 2) : '';
    var dd= cleanDecimal ? `${cleanInt}.${cleanDecimal}` : cleanInt
    console.log(dd)
    return dd;
  }
}

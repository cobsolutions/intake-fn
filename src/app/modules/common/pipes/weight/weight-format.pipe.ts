import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weightFormat'
})
export class WeightFormatPipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value == null || value === '') return '';

    const raw = value.toString().replace(/[^\d.]/g, '');
    const weight = parseFloat(raw);

    return isNaN(weight) ? '' : weight.toString();
  }

}

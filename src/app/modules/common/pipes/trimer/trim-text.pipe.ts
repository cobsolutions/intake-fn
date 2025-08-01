import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimmer'
})
export class TrimTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    console.log(value)
    return value ? value.trim() : null;
  }

}

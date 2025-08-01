import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value:any) {
    var val: string;
    if (value === undefined || value === null) {
        return ""
    } else {
        val = value.replace(/\D/g, "")
    }
    var len: number = val.length;
    if (len < 3) {
        return val;
    }
    if (len > 3 && len <= 6) {
        return "(" + val.substr(0, 3) + ")" + ' ' + val.substr(3, 3)
    } else {
        return "(" + val.substr(0, 3) + ")" + ' ' + val.substr(3, 3)  + "-" + val.substr(6, 4);
    }

}

}

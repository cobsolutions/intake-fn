import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FailedPatientService {
  key: string = 'failed_patients';
  constructor() {
   }
  getList(): any[] {
    const list = localStorage.getItem(this.key);
    return list ? JSON.parse(list) : [];
  }
  addToList(item: any): void {
    const list = this.getList();
    list.push(item);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}

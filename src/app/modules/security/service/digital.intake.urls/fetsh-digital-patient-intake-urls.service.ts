import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FetshDigitalPatientIntakeUrlsService {
  constructor(private router: Router) { }
  isDigitalIntakeURLS() {
    var url: string = this.router.routerState.snapshot.url;
    return  /^\/digital-intake/.test(url);;    
  }
}

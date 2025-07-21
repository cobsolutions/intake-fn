import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalService } from 'src/app/modules/common/services/local.service';

@Injectable({
  providedIn: 'root'
})
export class CacheClinicService {

  constructor(private localService: LocalService
    , private route: ActivatedRoute
    , private router: Router) { }

  public getClinic(): string {
    var sendClinic: string | null = this.pickURLClinic();
    console.log(sendClinic)
    if (sendClinic === null)
      return this.getCachedClinic();
    else
      return this.cahceClinic(sendClinic);
  }
  // public setClinic(clinicId: number) {
  //   var encryptClinicId = this.localService.encrypt(clinicId.toString())
  //   localStorage.setItem('clinicId', encryptClinicId);
  // }
  private getCachedClinic(): any {
    var cahcedClinicId = localStorage.getItem('clinicId');
    if (cahcedClinicId === null)
      throw new Error('no  clinic');
    else {
      if ((localStorage.getItem('clinicId') || '{}') === '')
        throw new Error('corrupted clinic');
      else
        return localStorage.getItem('clinicId') || '{}';
    }

  }
  private cahceClinic(clinicId: string): string {
    localStorage.setItem('clinicId', clinicId);
    return clinicId;
  }
  private pickURLClinic(): string | null {
    console.log(this.route.snapshot.queryParamMap.get('clinicId'))
    var clinicId: string | null = this.route.snapshot.queryParamMap.get('clinicId');
    if ( clinicId === undefined || clinicId === null) {
      return null;
    } else {
      // this.router.navigate([], {
      //   queryParams: {
      //     'clinicId': null,
      //   },
      //   queryParamsHandling: 'merge'
      // })
      return clinicId;
    }
  }
}

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

  public getClinic(): number {
    var sendClinic: number | null = this.pickURLClinic();
    if (sendClinic === null)
      return this.getCachedClinic();
    else
      return this.cahceClinic(sendClinic);
  }
  // public setClinic(clinicId: number) {
  //   var encryptClinicId = this.localService.encrypt(clinicId.toString())
  //   localStorage.setItem('clinicId', encryptClinicId);
  // }
  private getCachedClinic(): number {
    var cahcedClinicId = localStorage.getItem('clinicId');
    if (cahcedClinicId === null)
      throw new Error('no  clinic');
    else {
      if (this.localService.decrypt(localStorage.getItem('clinicId') || '{}') === '')
        throw new Error('corrupted clinic');
      else
        return Number(this.localService.decrypt(localStorage.getItem('clinicId') || '{}'));
    }

  }
  private cahceClinic(clinicId: number): number {
    var encryptClinicId = this.localService.simpleEncrypt(clinicId.toString())
    localStorage.setItem('clinicId', encryptClinicId);
    return clinicId;
  }
  private pickURLClinic(): number | null {
    var clinicId: number = Number(this.route.snapshot.queryParamMap.get('clinicId'));
    if (clinicId === 0 || clinicId === undefined || clinicId === null) {
      return null;
    } else {
      this.router.navigate([], {
        queryParams: {
          'clinicId': null,
        },
        queryParamsHandling: 'merge'
      })
      return clinicId;
    }
  }
}

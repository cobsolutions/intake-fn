import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, Observable, tap } from 'rxjs';
import { QuickIntakeService } from 'src/app/modules/patient.admin/services/quick.intake/quick-intake.service';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';


@Component({
  selector: 'pre-create-quick-intake',
  templateUrl: './pre-create-quick-intake.component.html',
  styleUrls: ['./pre-create-quick-intake.component.css']
})
export class PreCreateQuickIntakeComponent implements OnInit {
  state: 'waiting' | 'done' = 'waiting';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private quickIntakeService: QuickIntakeService,
    private fingerprintService: FingerprintService) {
    setTimeout(() => {
      this.state = 'done';
    }, 4000);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      var token: string = param['token'];
      var type: string = param['type'];
      var requester: string = '';
      switch (type) {
        case 'mail':
          this._callServiceWithId(token, 'Mail_Submission').subscribe(dd => {
            this.createNavigate(token);
          })
          break;
        case 'device':
          this._callService(token, 'Device_Submission').subscribe(dd => {
            this.createNavigate(token);
          })
          break;
      }
    })
  }
  private createNavigate(token: string) {
    this.router.navigate(['/digital-intake/quick/create'], {
      queryParams: {
        'token': token,
        'type':'QS'
      }
    });    
  }
  private _callService(token: string, requester: string, device?: string): Observable<any> {
    return this.quickIntakeService.preCreate(token, requester, device);
  }
  private _callServiceWithId(token: string, requester: string) {
    return this._callGetFinderPrint().pipe(
      tap(data => console.log('First observable emitted:', data)),
      concatMap(deviceId => this._callService(token, requester, deviceId))
    )
  }
  private _callGetFinderPrint(): Observable<any> {
    return this.fingerprintService.get()
  }
}

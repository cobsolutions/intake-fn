import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, tap } from 'rxjs';
import { TrustDevice } from '../../../models/trust.device/trust.device';
import { TrustDeviceService } from '../../../services/trust.device/trust-device.service';
import { WebsocketService } from '../../../services/web.socket/websocket.service';

@Component({
  selector: 'app-list-trust-devices',
  templateUrl: './list-trust-devices.component.html',
  styleUrls: ['./list-trust-devices.component.css']
})
export class ListTrustDevicesComponent implements OnInit {
  isError: boolean = false;
  errorMessage: string;
  trustDevices!: Observable<TrustDevice[]>;
  genertaeRequestVisibility: boolean = false;
  constructor(private trustDeviceService: TrustDeviceService,
    private websocketService: WebsocketService,
    private cdRef: ChangeDetectorRef,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.list();
    this.listenToWebSocket()

  }
  toggleGenertaeRequest() {
    this.genertaeRequestVisibility = !this.genertaeRequestVisibility;
  }
  openGenertaeRequest() {
    this.genertaeRequestVisibility = true;
  }
  private listenToWebSocket() {
    this.websocketService.listen((response: any) => {
      if (response.isTrust) {
        this.isError = false;
        this.genertaeRequestVisibility = false;
        this.list()
      }
    });
  }
  private list() {
    this.trustDevices = this.trustDeviceService.list();
    this.trustDevices.subscribe((result: any) => {
      if (result.length === 0)
        this.isError = true;
      else
        this.isError = false;
    }, error => {
      if (error.error !== undefined)
        this.errorMessage = error.error.message;
    })
  }
  public revoke(deviceId:string){
    this.trustDeviceService.revoke(deviceId).subscribe(result=>{
      this.list();
      this.toastrService.success('Device deleted');
    },error=>{
      this.toastrService.success('Error during revoke device');
    })
  }
}

import { Component, OnInit } from '@angular/core';
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
  constructor(private trustDeviceService: TrustDeviceService, private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.listenToWebSocket()
    this.list();
  }
  toggleGenertaeRequest() {
    this.genertaeRequestVisibility = !this.genertaeRequestVisibility;
  }
  openGenertaeRequest() {
    this.genertaeRequestVisibility = true;
  }
  private listenToWebSocket() {
    this.websocketService.listen((response: any) => {
      console.log(JSON.stringify(response))
      if (response.isTrust) {
        console.log('TT')
        this.genertaeRequestVisibility = false;
        this.list()
      }
    });
  }
  private list() {
    this.trustDevices! = this.trustDeviceService.list();
    this.trustDevices!.subscribe(result => {
    }, error => {
      this.isError = true;
      if (error.error !== undefined)
        this.errorMessage = error.error.message;
      console.log(error)
    })
  }
}

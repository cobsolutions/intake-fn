import { Injectable } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { DeviceTokenResponse } from '../../models/trust.device/device.token.response';
import { TrustDevice } from '../../models/trust.device/trust.device';
export type ListenerCallBack = (message: TrustDevice) => void;
export interface SendTask {
  name: string;
  days: number;
}
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private connection: CompatClient | undefined = undefined;
  private subscription: StompSubscription | undefined;
  constructor() {
    this.connection = Stomp.client('ws://localhost:8090/intake-service/api/websocket');
    this.connection.connect({}, () => { });
  }
  public send(trustDevice: TrustDevice): void {
    if (this.connection && this.connection.connected) {
      this.connection.send('/register/add', {}, JSON.stringify(trustDevice));
    }
  }
  public listen(fun: ListenerCallBack): void {
    if (this.connection) {
      this.connection.connect({}, () => {
        this.subscription = this.connection!.subscribe('/devices/added', message => fun(JSON.parse(message.body)));
      });
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeOTTService {
  private tokenId: string | null = null;
  private requester: string | null = null;
  private submissionType: string | null = null;
  constructor() { }
  setToken(token: string) {
    this.tokenId = token;
  }

  getToken(): string | null {
    return this.tokenId;
  }
  evictToken() {
    this.tokenId = null;
  }
  setRequester(requester: string|null) {
    this.requester = requester;
  }

  getRequester(): string | null {
    return this.requester;
  }
  evictRequester() {
    this.requester = null;
  }
}

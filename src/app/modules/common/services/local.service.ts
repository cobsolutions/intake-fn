import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LocalService {
  key = "secret";
  secretKey = "YourSecretKeyForEncryption&Descryption";
  constructor() { }
  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }
  public getData(key: string) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public encrypt(txt: string): string {
    var hash = CryptoJS.SHA1('0123456789123456');
    var key = CryptoJS.lib.WordArray.create(hash.words.slice(0, 16 / 4));
    let encrypted = CryptoJS.AES.encrypt(txt, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encrypted.toString();
  }

  public simpleEncrypt(txt: string): string {
    // var hash = CryptoJS.SHA1('0123456789123456');
    // var key = CryptoJS.lib.WordArray.create(hash.words.slice(0, 16 / 4));
    // let encrypted = CryptoJS.AES.encrypt(txt, key, {
    //   mode: CryptoJS.mode.ECB,
    // });
    // return encrypted.toString();
    // //return CryptoJS.AES.encrypt(txt, this.key).toString();
    return CryptoJS.AES.encrypt(txt, this.secretKey.trim()).toString();
  }
  public decrypt(txtToDecrypt: string) {
    // var hash = CryptoJS.SHA1('0123456789123456');
    // var key = CryptoJS.lib.WordArray.create(hash.words.slice(0, 16 / 4));
    // return CryptoJS.AES.decrypt(txtToDecrypt, key).toString();
    return CryptoJS.AES.decrypt(txtToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}

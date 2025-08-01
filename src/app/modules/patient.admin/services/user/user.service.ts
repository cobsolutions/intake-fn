import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/modules/security/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.baseURL + 'user'
  constructor(private http: HttpClient) { }
  create(user: User) {
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${this.userUrl}`+ '/create', JSON.stringify(user), { 'headers': headers, observe: 'response' })
  }

  get() {
    return this.http.get<User[]>(`${this.userUrl}` + '/find', { observe: 'response' })
  }
  delete(id:string | null) {
    return this.http.delete(`${this.userUrl}` + '/delete/userId/' + id)
  }
  update(user: User){
    const headers = { 'content-type': 'application/json' }
    var updateUserURL = this.userUrl + '/update'
    return this.http.put(updateUserURL, JSON.stringify(user), { 'headers': headers, observe: 'response' })
  }
  getById(id:string | null) {
    return this.http.get<User>(`${this.userUrl}` + '/find/' + id)
  }

  checkUserName(userName:string){
    var url = this.userUrl +'/check/username/' + userName
    return this.http.get(url);
  }
  checkEmail(email:string){
    var url = this.userUrl +'/check/email/' + email
    return this.http.get(url);
  }
}

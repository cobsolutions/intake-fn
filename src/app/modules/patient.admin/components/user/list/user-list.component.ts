import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/modules/common';
import { User } from 'src/app/modules/security/model/user';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isLoggedIn: boolean;
  users: User[] = new Array();
  original: any[] = [];
  isCreateUSer: boolean = false;
  isEditUser: boolean = false;
  selectedUser: string;
  // Search criteria
  searchName: string = '';
  searchEmail: string = '';
  searchRole: string = '';
  constructor(private router: Router, private userService: UserService, private kcAuthServiceService: KcAuthServiceService) { }

  ngOnInit(): void {
    this.getUsers();
  }
  private getUsers() {
    this.users = []
    this.userService.get().subscribe(response => {
      response.body?.forEach(element => {
        this.users?.push(element)
        this.original.push(element) 
      });
    },
      error => {
        console.log(error)
      },
    )
  }
  create() {
    this.router.navigateByUrl('/admin/user/creation');
  }
  update(userId: string | undefined | null) {
    this.router.navigate(['/admin/user/update', userId])
  }
  delete(userId: string | undefined | null) {
    console.log(userId);
    this.userService.delete(userId || '{}').subscribe(() => {
      location.reload();
    })
  }
  isLoggedInUser(id: string | null | undefined) {
    var userId: string | undefined = this.kcAuthServiceService.getLoggedUser()?.sub;
    this.isLoggedIn = userId == id ? true : false;
    return this.isLoggedIn;
  }
  showCreateUser() {
    this.isCreateUSer = true;
  }
  toggleCreateUser() {
    this.isCreateUSer = !this.isCreateUSer;
  }
  showEditUser(userId: string) {
    this.selectedUser = userId
    this.isEditUser = true;
  }
  toggleEditUser() {
    this.isEditUser = !this.isEditUser;
  }
  changeClinicVisibility(event: any) {
    if (event === 'close-create')
      this.isCreateUSer = false;
    if (event === 'close-edit')
      this.isEditUser = false;
    this.getUsers();
  }
  searchUsers(): void {
    this.users = this.users.filter(user => {
      const matchesName =
        !this.searchName || user.name?.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesEmail =
        !this.searchEmail || user.email?.toLowerCase().includes(this.searchEmail.toLowerCase());
      const matchesRole =
        !this.searchRole || user.userRole?.toLowerCase().includes(this.searchRole.toLowerCase());

      // AND logic – all criteria must match
      return matchesName && matchesEmail && matchesRole;
    });
  }
  clearSearch(): void {
    this.searchName = '';
    this.searchEmail = '';
    this.searchRole = '';
    this.users = [...this.original];
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { LocalService } from 'src/app/modules/common';
import { countries } from 'src/app/modules/common/components/address/country-data-store';
import { Countries } from 'src/app/modules/common/components/address/model/country.model';
import { states } from 'src/app/modules/common/components/address/state-data-store';
import { User } from 'src/app/modules/security/model/user';
import { Clinic } from '../../../models/clinic.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { UserService } from '../../../services/user/user.service';
interface UserRole {
  name: string;
  value: string
}
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  isRoleChanges: boolean = false;
  currentRole: string | undefined = undefined;
  countries: Countries[] = countries;
  states: string[] = states;
  userRoles: UserRole[] = [
    { name: "Administrator", value: "administrator" },
    { name: "Normal User", value: "normal" }
  ]
  resetpassword: boolean = false;
  userId: string | null;
  errorMessage: string | null;
  returnClinics: Clinic[] = new Array();
  @ViewChild('userCreateForm') userCreateForm: NgForm;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private clinicService: ClinicService,
    private router: Router,
    private localService: LocalService) { }

  form = {
    uuid: '',
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    useraddress: {},
    useraddresscountry: '',
    useraddressstate: '',
    useraddressprovince: '',
    useraddresscity: '',
    useraddresszipcode: '',
    userrole: '',
    selectedClinics: [1]
  };
  capitalizeFirstLetter(value: string) {
    var v: string = value[0].toUpperCase() +
      value.slice(1)
    return v;
  }
  minusculeFirstLetter(value: string) {
    var v: string = value[0].toLowerCase() +
      value.slice(1)
    return v;
  }
  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId') !== null ? this.activatedRoute.snapshot.paramMap.get('userId') : '';
    this.userService.getById(this.userId).subscribe((result: any) => {
      this.form.uuid = result.uuid;
      this.form.name = result.name !== null ? result.name : '';
      this.form.firstName = result.firstName !== null ? result.firstName : '';
      this.form.lastName = result.lastName !== null ? result.lastName : '';
      this.form.email = result.email !== null ? result.email : '';
      this.form.password = result.password !== null ? result.password : '';
      this.form.useraddress = result.address.address;
      this.form.useraddressstate = result.address.state;
      this.form.useraddresscity = result.address.city;
      this.form.useraddresszipcode = result.address.zipCode;
      this.form.userrole = result.userRole ;
      this.currentRole = this.form.userrole;
      var clinicIds: number[] = _.map(result.clinics, (clinic) => {
        return clinic.id !== null ? clinic.id : 0;
      });
      this.clinicService.get().subscribe(response => {
        response.body?.forEach(element => {
          if (element.id !== null) {
            if (clinicIds.includes(element.id)) {
              element.selected = true;
            } else {
              element.selected = false;
            }
          }
          this.returnClinics?.push(element)
        });
      },
        error => {
          console.log(error)
        },
      )
    })
  }
  create() {
    var user: User = {
      id: null,
      uuid: this.form.uuid,
      name: this.form.name,
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      password: this.resetpassword ? this.localService.encrypt(this.form.password !== null ? this.form.password : '') : null,
      address: this.createAddressModel(),
      userRole: this.minusculeFirstLetter(this.form.userrole),
      clinics: this.createClinics(this.form.selectedClinics),
    }
    if (this.isRoleChanges)
      user.currentRole = this.currentRole;
    if (this.userCreateForm.valid) {
      this.userService.update(user).subscribe(
        (response) => {
          this.router.navigateByUrl('admin/user/list')
        },
        (error) => { this.errorMessage = error.error.error; });
    } else {
      console.log('not valid')
      this.errorMessage = 'Please enter valid data';
    }
  }
  createAddressModel(): any {
    return {
      address: this.form.useraddress,
      state: this.form.useraddressstate,
      city: this.form.useraddresscity,
      zipCode: this.form.useraddresszipcode
    }
  }
  createClinics(ids: number[] | null) {

    var clinics: Clinic[] = new Array();
    ids?.forEach(element => {
      var clinic: Clinic = {
        id: Number(element),
        name: null,
        address: "",
        selected: false,

      }
      clinics.push(clinic)
    });
    return clinics;
  }
  resetError() {

  }
  converStringToAddress(address: string | null) {
    var result: string[] | undefined = address?.split(",")
    return result !== undefined ? result : ['']
  }
  ocRoleChange() {
    this.isRoleChanges = true;
    if (this.form.userrole === this.currentRole)
      this.currentRole = undefined
  }
}

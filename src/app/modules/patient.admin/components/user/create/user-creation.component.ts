import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from 'src/app/modules/common';
import { states } from 'src/app/modules/common/components/address/state-data-store';
import { noSpecialCharactersValidator } from 'src/app/modules/patient.digital.intake/components/create/validators/custom.validation/special.characters.validator';
import { Clinic } from '../../../models/clinic.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { UserService } from '../../../services/user/user.service';
import { EmailValidator } from 'src/app/modules/patient.digital.intake/components/create/validators/custom.validation/email.validator';
import { User } from 'src/app/modules/security/model/user';
import { debounceTime, filter, finalize, map, mergeMap, Observable, switchMap, tap, toArray } from 'rxjs';

interface UserRole {
  name: string;
  value: string
}
@Component({
  selector: 'user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css']
})
export class UserCreationComponent implements OnInit {
  @Input() selectedUser: string
  @Output() changeVisibility = new EventEmitter<string>()
  states: string[] = states;
  userForm: FormGroup
  isValidForm: boolean = false;
  validEmail: boolean | undefined = undefined;
  validUserName: boolean | undefined = undefined;
  validUserNameMessage: string | undefined = undefined
  validEmailMessage: string | undefined = undefined
  userRoles: UserRole[] = [
    { name: "Administrator", value: "administrator" },
    { name: "Normal User", value: "normal" }
  ]
  clinics$!: Observable<Clinic[]>;
  user: User
  mode: string = 'create';
  constructor(private clinicService: ClinicService,
    private userService: UserService,
    private router: Router,
    private localService: LocalService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.userOptMode()
    this.createUserForm();
    if (this.mode === 'edit') {
      this.getSelectedUser();
    } else {
      this.getClinics();
      this.checkUserName();
      this.checkEmail()
    }
  }

  userOptMode() {
    if (this.selectedUser !== undefined)
      this.mode = 'edit';
    else
      this.mode = 'create';
  }
  private getSelectedUser() {
    this.userService.getById(this.selectedUser).subscribe(result => {
      console.log(JSON.stringify(result))
      this.user = result;
      this.fillUserForm();
      this.userForm.controls['username'].disable();
      this.userForm.controls['email'].disable();
      this.getClinics();
    })
  }
  private getClinics() {
    this.clinics$ = this.clinicService.getActive().pipe(
      mergeMap(data => data.body),
      map((clinic: any) => {
        if (this.selectedUser) {
          var isClinicFound = this.user.clinics?.some(user_clinic => {
            return  clinic.id === user_clinic.id;
          })
          if (isClinicFound) {
            clinic.selected = true
          }
        }
        return clinic;
      }), toArray()
    );
  }
  private createUserForm() {
    const zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
    this.userForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
      'firstName': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
      'lastName': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
      'email': new FormControl(null, [Validators.required, EmailValidator()]),
      'password': new FormControl(null, this.mode !== 'edit' ? Validators.required : null),
      'first-address': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
      'second-address': new FormControl(null, noSpecialCharactersValidator()),
      'city-address': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
      'state-address': new FormControl(null, [Validators.required]),
      'zipcode-address': new FormControl(null, [Validators.required, Validators.min(10), Validators.pattern(zipCodeRgx)]),
      'userRole': new FormControl(null, [Validators.required]),
      'clinics': new FormControl(null, [Validators.required]),
    })
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.userForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  create() {
    if (this.selectedUser) {
      if (this.userForm?.valid) {
        this.fillUserModel();
        this.userService.update(this.user).subscribe(result => {
          this.isValidForm = false;
          this.changeVisibility.emit('close-edit');
          this.toastrService.success('User Updated');
        })
      } else {
        this.isValidForm = true;
        this.isValidForm = true;
        Object.keys(this.userForm.controls).forEach(field => {
          const control = this.userForm.get(field);
          control?.markAsTouched({ onlySelf: true });
        });
        this.scrollUp()
      }

    } else {
      if (this.userForm?.valid && (this.validUserName && this.validEmail)) {
        this.fillUserModel();
        console.log(JSON.stringify(this.user))
        this.userService.create(this.user).subscribe(result => {
          this.isValidForm = false;
          this.changeVisibility.emit('close-create');
          this.toastrService.success('User Created');
        })
      } else {
        this.isValidForm = true;
        this.isValidForm = true;
        Object.keys(this.userForm.controls).forEach(field => {
          const control = this.userForm.get(field);
          control?.markAsTouched({ onlySelf: true });
        });
        this.scrollUp()
      }
    }
  }
  private scrollUp() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.scrollTo(0, 0);
      }
    })();
  }
  private fillUserModel() {
    this.user = {
      id: null,
      uuid: this.user?.uuid,
      name: this.userForm.get('username')?.value,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      password: this.localService.encrypt(this.userForm.get('password')?.value !== null ? this.userForm.get('password')?.value : ''),
      userRole: this.userForm.get('userRole')?.value,
      address: {
        firstAddress: this.userForm.controls['first-address'].value,
        secondAddress: this.userForm.controls['second-address'].value,
        city: this.userForm.controls['city-address'].value,
        state: this.userForm.controls['state-address'].value,
        zipCode: this.userForm.controls['zipcode-address'].value
      },
      clinics: this.createClinics(this.userForm.get('clinics')?.value),
      createdAt: this.user?.createdAt
    }
  }
  private createClinics(ids: string[] | null) {
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
  private checkUserName() {
    this.userForm.get('username')?.valueChanges
      .pipe(
        filter(text => {
          if (text === '') {
            this.validUserName = undefined;
            return false;
          }
          if (text === undefined) {
            return false;
          }
          if (text.length > 1) {
            return true
          } else {
            return false;
          }
        }),
        debounceTime(1800),
        tap((value) => {
        }),
        switchMap((value: any) => {
          return this.userService.checkUserName(value)
            .pipe(
              finalize(() => {
              }),
            )
        }
        )
      ).subscribe((check: any) => {
        this.validUserName = check;
        if (!check) {
          this.validUserNameMessage = 'Username already exists';
        }
      },
        () => {
        });
  }
  private checkEmail() {
    this.userForm.get('email')?.valueChanges
      .pipe(
        filter(text => {
          if (text === '') {
            this.validEmail = undefined;
            return false;
          }
          if (text === undefined) {
            return false;
          }
          if (text.length > 1) {
            return true
          } else {
            return false;
          }
        }),
        debounceTime(1800),
        tap((value) => {
        }),
        switchMap((value) => {
          return this.userService.checkEmail(value)
            .pipe(
              finalize(() => {
              }),
            )
        }
        )
      ).subscribe((check: any) => {
        this.validEmail = check;
        if (!check) {
          this.validEmailMessage = 'Email already exists';
        }
      },
        error => {
        });
  }
  private fillUserForm() {
    this.userForm.get('username')?.setValue(this.user.name)
    this.userForm.get('firstName')?.setValue(this.user.firstName)
    this.userForm.get('lastName')?.setValue(this.user.lastName)
    this.userForm.get('email')?.setValue(this.user.email)
    this.userForm.get('password')?.setValue(this.user.password)
    this.userForm.get('first-address')?.setValue(this.user.address?.firstAddress)
    this.userForm.get('second-address')?.setValue(this.user.address?.secondAddress)
    this.userForm.get('city-address')?.setValue(this.user.address?.city)
    this.userForm.get('state-address')?.setValue(this.user.address?.state)
    this.userForm.get('zipcode-address')?.setValue(this.user.address?.zipCode)
    this.userForm.get('userRole')?.setValue(this.user.userRole)
  }
}

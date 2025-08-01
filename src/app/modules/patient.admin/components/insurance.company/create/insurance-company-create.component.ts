import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, finalize, map, mergeMap, Observable, switchMap, tap, toArray } from 'rxjs';
import { noSpecialCharactersValidator } from 'src/app/modules/patient.digital.intake/components/create/validators/custom.validation/special.characters.validator';
import { Clinic } from '../../../models/clinic.model';
import { InsuranceCompany } from '../../../models/insurance.company.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { InsuranceCompanyService } from '../../../services/insurance.company/insurance-company.service';

@Component({
  selector: 'insurance-company-create',
  templateUrl: './insurance-company-create.component.html',
  styleUrls: ['./insurance-company-create.component.css']
})
export class InsuranceCompanyCreateComponent implements OnInit {
  @Output() changeVisibility = new EventEmitter<string>()
  @Input() selectedCompany: number
  insuranceCompanyForm: FormGroup
  isValidForm: boolean = false;  
  clinics$!: Observable<Clinic[]>;
  insuranceCompany: InsuranceCompany
  validName: boolean | undefined = undefined;
  validNameMessage: string;
  constructor(
    private clinicService: ClinicService,
    private insuranceCompanyService: InsuranceCompanyService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.createInsuranceCompanyform();
    if (this.selectedCompany !== undefined) {
      this.getSelectedInsuranceCompany(this.selectedCompany);
    } else {
      this.checkUserName();
      this.getClinics();
    }
    
  }
  private getSelectedInsuranceCompany(id: number) {
    this.insuranceCompanyService.getById(id).subscribe((result: any) => {
      this.insuranceCompany = result.body;
      this.insuranceCompanyForm.controls['insurance-company-name'].disable();
      this.getClinics();
      this.fillInsuranceCompanyForm();
    }, error => {
      console.log('error getting selected insurance comapny')
    })
  }
  private getClinics() {
    this.clinics$ = this.clinicService.getActive().pipe(
      mergeMap(data => data.body),
      map((clinic: any) => {
        if (this.selectedCompany) {
          var isClinicFound = this.insuranceCompany.clinics?.some(in_clinic => {
            var dd: boolean = clinic.id === in_clinic.id
            return dd;
          })
          if (isClinicFound) {
            clinic.selected = true
          }
        }
        return clinic;
      }), toArray()
    );
  }
  private createInsuranceCompanyform() {
    this.insuranceCompanyForm = new FormGroup({
      'insurance-company-name': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
      'clinic': new FormControl(null, [Validators.required]),
      'insurance-company-status': new FormControl(true, [Validators.required]),
    })
  }
  create() {
    if (this.selectedCompany) {
      if (this.insuranceCompanyForm?.valid) {
        this.isValidForm = false;
        this.fillInsuranceCompanyModel();
        this.insuranceCompanyService.create(this.insuranceCompany).subscribe(result => {
          this.changeVisibility.emit('close-edit');
          this.toastrService.success('Insurance Company Updated.')

        }, error => {
          this.toastrService.success('Erro during updating insurance company')
        })
      }else{
        this.isValidForm = true;
      }
    } else {
      if (this.insuranceCompanyForm?.valid && !this.validName) {
        this.isValidForm = false;
        this.fillInsuranceCompanyModel();
        this.insuranceCompanyService.create(this.insuranceCompany).subscribe(result => {
          this.changeVisibility.emit('close-create');
          this.toastrService.success('Insurance Company Created.')

        }, error => {
          this.toastrService.success('Erro during creating insurance company')
        })
      } else {
        this.isValidForm = true;
        Object.keys(this.insuranceCompanyForm.controls).forEach(field => {
          const control = this.insuranceCompanyForm.get(field);
          control?.markAsTouched({ onlySelf: true });
        });
        this.scrollUp()
      }
    }
  }
  private fillInsuranceCompanyModel() {
    this.insuranceCompany = {
      id: this.selectedCompany !== undefined ? this.insuranceCompany.id : null,
      name: this.insuranceCompanyForm.get('insurance-company-name')?.value,
      address: null,
      clinics: this.createClinics(this.insuranceCompanyForm.get('clinic')?.value),
      status: this.insuranceCompanyForm.get('insurance-company-status')?.value,
      createdAt:this.insuranceCompany?.createdAt!
    }
    console.log(JSON.stringify(this.insuranceCompany))
  }
  private fillInsuranceCompanyForm() {
    this.insuranceCompanyForm.get('insurance-company-name')?.setValue(this.insuranceCompany.name);
    this.insuranceCompanyForm.get('insurance-company-status')?.setValue(this.insuranceCompany.status);
  }
  private scrollUp() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.scrollTo(0, 0);
      }
    })();
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
    this.insuranceCompanyForm.get('insurance-company-name')?.valueChanges
      .pipe(
        filter(text => {
          if (text === '') {
            this.validName = undefined;
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
        debounceTime(500),
        tap((value) => {
        }),
        switchMap((value: any) => {
          return this.insuranceCompanyService.checkName(value)
            .pipe(
              finalize(() => {
              }),
            )
        }
        )
      ).subscribe((response: any) => {
        this.validName = response.body;
        if (this.validName) {
          this.validNameMessage = 'name is already exists';
        }
      },
        () => {
        });
  }
}

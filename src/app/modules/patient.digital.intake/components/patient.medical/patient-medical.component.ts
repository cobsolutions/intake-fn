import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import entityValues from 'src/app/modules/patient.admin/components/reports/_entity.values';
import { Provider } from '../../models/provider';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { CheckInvalidForm } from '../../util/invalid.form';
import { ValidationExploder } from '../create/validators/validation.exploder';


@Component({
  selector: 'patient-medical',
  templateUrl: './patient-medical.component.html',
  styleUrls: ['./patient-medical.component.css']
})
export class PatientMedicalComponent implements OnInit {
  @Input() form: FormGroup;
  provider: Provider = {}
  providers: Observable<Provider[]> | undefined;
  test: Provider[];
  entityValues = entityValues;
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  isReferringSearchNotValid: boolean = false;
  referringSearchErrorMessage: string | undefined;
  loadingProvider: boolean = false;
  constructor(private digitalIntakeService: DigitalIntakeService) { }


  ngOnInit(): void {
    this.form.get('medical')?.get('providerSearch')?.valueChanges.subscribe(res => {
      if (this.form.get('medical')?.get('providerNPI')?.value)
        this.form.get('medical')?.get('providerNPI')?.setValue(null)
      if (this.form.get('medical')?.get('providerName')?.value)
        this.form.get('medical')?.get('providerName')?.setValue(null)
    })

    this.providers?.subscribe(data => {
      if (data === null) {
        this.form.get('medical')?.get('providerName')?.setValue(null);
        this.form.get('medical')?.get('providerNPI')?.setValue(null);
      }
    })
  }
  search() {
    this.unpickProvider();
    var referringType: string = this.form.get('medical')?.get('referringSearchType')?.value;
    var referringSearch: string = this.form.get('medical')?.get('referringSearch')?.value;
    this.loadingProvider = true
    if (referringSearch === null || referringSearch === '') {
      this.isReferringSearchNotValid = true;
      this.referringSearchErrorMessage = 'Type Before hit'
      this.loadingProvider = false
    } else {
      switch (referringType) {
        case 'l-name':
          this.providers = this.digitalIntakeService.findProviderByLastName(referringSearch)
          this.providers.subscribe(rr => {
            this.loadingProvider = false
          })
          break;
        case 'f-name':
          this.providers = this.digitalIntakeService.findProviderByLastName(referringSearch)
          this.providers.subscribe(rr => {
            this.loadingProvider = false
          })
          break;
        case 'full-name':
          var fullName: string[] = referringSearch.split(',');
          if (fullName.length === 1) {
            this.loadingProvider = false
            this.isReferringSearchNotValid = true;
            this.referringSearchErrorMessage = 'Please follow search criteria structure'
          }
          else {
            this.providers = this.digitalIntakeService.findProviderByFullName(fullName[0], fullName[1])
            this.providers.subscribe(rr => {
              this.loadingProvider = false
            })
            this.isReferringSearchNotValid = false;
            this.referringSearchErrorMessage = undefined;
          }
          break;
        case 'npi':
          var npi: number = Number(referringSearch);
          if (!Number.isNaN(referringSearch)) {
            this.loadingProvider = false
            this.isReferringSearchNotValid = true;
            this.referringSearchErrorMessage = 'Doctor NPI must be numbers only'
          }
          else {
            this.providers = this.digitalIntakeService.findProviderByNPI(Number(referringSearch))
            this.providers.subscribe(rr => {
              this.loadingProvider = false
            })
            this.isReferringSearchNotValid = false;
            this.referringSearchErrorMessage = undefined;
          }
          break;
      }
      this.isReferringSearchNotValid = false;
      this.referringSearchErrorMessage = undefined;
    }
  }
  next() {
    var insuranceForm: FormGroup = this.form.get('medical') as FormGroup
    CheckInvalidForm.check(insuranceForm);
    if (this.form.get('medical')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'medical')
    }
  }
  pickProvider(event: any) {
    this.form.get('medical')?.get('providerName')?.setValue(event.split(':')[0]);
    this.form.get('medical')?.get('providerNPI')?.setValue(event.split(':')[1]);
  }
  unpickProvider() {
    this.form.get('medical')?.get('providerName')?.setValue(null);
    this.form.get('medical')?.get('providerNPI')?.setValue(null);
  }
}

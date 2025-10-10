import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { filter } from 'rxjs';
import { states } from 'src/app/modules/common/components/address/state-data-store';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-address',
  templateUrl: './patient-address.component.html',
  styleUrls: ['./patient-address.component.css']
})
export class PatientAddressComponent implements OnInit {
  @Input() form: FormGroup;
  states: string[] = states;
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  addressForm: FormGroup;
  constructor(private fb: FormBuilder,
    private digitalIntakeService: DigitalIntakeService) {
    this.addressForm = this.fb.group({
      address: [''],
      city: [''],
      state: [''],
      zip: ['']
    });
  }

  ngOnInit(): void {
    this.digitalIntakeService.loadedPatient$.pipe(
      filter(data => data !== null)
    ).subscribe(patient => {
      const address: any = patient.patientAddress
      if (address !== null) {

        this.form.get('address')?.get('firstAddress')?.setValue(address.firstAddress)
        this.form.get('address')?.get('secondAddress')?.setValue(address.secondAddress)
        this.form.get('address')?.get('city')?.setValue(address.city)
        this.form.get('address')?.get('state')?.setValue('NY - New York')
        this.form.get('address')?.get('zipCode')?.setValue(address.zipCode)
      }
    })
  }
  next() {
    if (this.form.get('address')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'address')
    }
  }
  onAddressSelected(data: { address: string; city: string; state: string; zip: string }) {
    this.addressForm.patchValue({
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/models/patient/address.info.model';
import { AddressInformation } from 'src/app/models/validation/new/address.information';
import { PatientAddressValidator } from 'src/app/validators/patient.validator/patient.address.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { PatientStoreService } from '../../service/store/patient-store.service';
@Component({
  selector: 'app-address-information',
  templateUrl: './address-information.component.html',
  styleUrls: ['./address-information.component.css']
})
export class AddressInformationComponent implements OnInit {
  patientAddress?: Address = new Address()
  @Input() requiredFields?: AddressInformation;
  constructor(private patientStoreService: PatientStoreService) { }

  ngOnInit(): void {
    if (this.patientStoreService.patientAddress === undefined)
      this.patientAddress = new Address();
    else
      this.patientAddress = this.patientStoreService?.patientAddress;
  }
  public validate(): ValidatorContainer {
    var patientValidator = new PatientAddressValidator(this.requiredFields!, this.patientAddress || {});
    return patientValidator.validate();
  }
}

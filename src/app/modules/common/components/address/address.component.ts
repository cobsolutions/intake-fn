import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/models/patient/address.info.model';
import { AddressInformation } from 'src/app/models/validation/new/address.information';
import { countries } from './country-data-store';
import { Countries } from './model/country.model';
import { states } from './state-data-store';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  countries: Countries[] = countries;
  states: string[] = states;
  @Input() pateintAddressInfo: Address
  @Input() requiredFields: AddressInformation;
  constructor() { }

  ngOnInit(): void {
  }
  isRequiredField(name: string): boolean {
    var field: boolean = false;
    Object.entries(this.requiredFields)
      .forEach(([key, value]) => {
        if (key === name) {
          field = value;
        }
      })
    return field;
  }
}

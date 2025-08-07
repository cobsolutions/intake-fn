import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
declare var google: any;
@Component({
  selector: 'app-auto-complete-address',
  templateUrl: './auto-complete-address.component.html',
  styleUrls: ['./auto-complete-address.component.css']
})
export class AutoCompleteAddressComponent implements OnInit {
  @ViewChild('addressInput') addressInput!: ElementRef;
  @Output() addressSelected = new EventEmitter<{
    address: string;
    city: string;
    state: string;
    zip: string;
  }>();
  constructor() { }

  ngOnInit(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const components: any = {};
      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes('locality')) components.city = component.long_name;
        if (types.includes('administrative_area_level_1')) components.state = component.short_name;
        if (types.includes('postal_code')) components.zip = component.long_name;
      }

      this.addressSelected.emit({
        address: place.formatted_address,
        city: components.city || '',
        state: components.state || '',
        zip: components.zip || ''
      });
    });
  }

}

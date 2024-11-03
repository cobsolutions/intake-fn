import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { FindLocationService } from 'src/app/modules/common/services/geolocation/find-location.service';
import { DeviceLocation } from '../../../models/trust.device/geolocation';
import { ClinicService } from '../../../services/clinic/clinic.service';

@Component({
  selector: 'edit-clinic-location',
  templateUrl: './edit-clinic-location.component.html',
  styleUrls: ['./edit-clinic-location.component.css']
})
export class EditClinicLocationComponent implements OnInit {
  center: google.maps.LatLngLiteral;
  markerPositions: google.maps.LatLngLiteral[]
  zoom: number = 14
  @Input() clinicId: number
  @Output() changeVisibility = new EventEmitter<string>()
  constructor(private clinicService: ClinicService , private findLocationSerivce:FindLocationService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.clinicService.getById(this.clinicId.toString()).subscribe((result:any) => {
      var lat : number = result.geolocation.latitude
      var lng : number = result.geolocation.longitude
      this.center = { lat: lat, lng: lng };
      this.markerPositions = [
        { lat: 30.01716655369117, lng: lng },
      ];
      this.loadNearbyLocations(lat,lng)
    })
  }
  loadNearbyLocations(lat: number, lng: number) {
    const location = new google.maps.LatLng(lat, lng);
    const map = new google.maps.Map(document.createElement('div'), {
      center: location,
      zoom: this.zoom
    });

    const placesService = new google.maps.places.PlacesService(map);

    const request:any = {
      location: location,
      radius: 1000, // Adjust the radius as needed (in meters)
      type: ['hospital', 'clinic', 'pharmacy'] // Specify types of places to show
    };

    placesService.nearbySearch(request, (results:any, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place:any) => {
          if (place.geometry && place.geometry.location) {
            const position = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            this.markerPositions.push(position);
          }
        });
      }
    });
  }
  updateLocation() {
    this.findLocationSerivce.find().pipe(
      map(geolocation => {
        var deviceLocation: DeviceLocation = {
          accuracy: 0,
          latitude: geolocation.coords.latitude,
          longitude: geolocation.coords.longitude
        }
        return  deviceLocation;
      }), switchMap((location: any) => {
        return this.clinicService.updateClinicLocation(this.clinicId, location)
      })).subscribe((result:any) => {
        console.log(JSON.stringify(result))
        const lat = result.body.latitude;
        const lng = result.body.longitude;
  
        // Update the map's center and marker positions
        this.center = { lat: lat, lng: lng };
        this.markerPositions = [{ lat: lat, lng: lng }];
  
        // Reload nearby locations based on the updated clinic location
        this.loadNearbyLocations(lat, lng);  
      })
  }
}

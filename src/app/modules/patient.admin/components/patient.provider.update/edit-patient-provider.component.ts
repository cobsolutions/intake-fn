import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/modules/patient.digital.intake/models/provider';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { ActionTaker } from '../../models/one.time.token/monitor/action.taker';
import { PatientProviderEditableRequest } from '../../models/patient/patient.provider.editable.request';
import { FindPatientProviderService } from '../../services/patient.find.provider/find-patient-provider.service';
import { UpdatePatientProviderService } from '../../services/patient.update.provider/update-patient-provider.service';

@Component({
  selector: 'edit-patient-provider',
  templateUrl: './edit-patient-provider.component.html',
  styleUrls: ['./edit-patient-provider.component.css']
})
export class EditPatientProviderComponent implements OnInit {
  @Input() patientId: number | undefined
  @Output() changeVisibility = new EventEmitter<string>()
  form: FormGroup;
  loadingProvider: boolean = false;
  isReferringSearchNotValid: boolean = false;
  referringSearchErrorMessage: string | undefined;

  providers: Provider[];
  constructor(private findPatientProviderService: FindPatientProviderService
    , private updatePatientProviderService: UpdatePatientProviderService
    , private kcAuthServiceService: KcAuthServiceService) { }

  ngOnInit(): void {
    this.getActionTaker()
    this.form = new FormGroup({
      'edit-provider': new FormGroup({
        'providerSearch': new FormControl(false),
        'referringSearchType': new FormControl("l-name"),
        'referringSearch': new FormControl(null),
        'providerSearchName': new FormControl(null),
        'providerName': new FormControl(null),
        'providerNPI': new FormControl(null),
        'referringEntity': new FormControl(null, [Validators.required])
      }),
    });
  }
  pickProvider(event: any) {
    this.form.get('edit-provider')?.get('providerName')?.setValue(event.split(':')[0]);
    this.form.get('edit-provider')?.get('providerNPI')?.setValue(event.split(':')[1]);
  }
  unpickProvider() {
    this.form.get('edit-provider')?.get('providerName')?.setValue(null);
    this.form.get('edit-provider')?.get('providerNPI')?.setValue(null);
  }
  search() {
    this.unpickProvider();
    var referringType: string = this.form.get('edit-provider')?.get('referringSearchType')?.value;
    var referringSearch: string = this.form.get('edit-provider')?.get('referringSearch')?.value;
    this.loadingProvider = true
    if (referringSearch === null || referringSearch === '') {
      this.isReferringSearchNotValid = true;
      this.referringSearchErrorMessage = 'Type Before hit'
      this.loadingProvider = false
    } else {
      switch (referringType) {
        case 'l-name':
          this.findPatientProviderService.findProviderByLastName(referringSearch)
            .subscribe(data => {
              this.loadingProvider = false
              var providers = data.body;
              if (providers === null) {
                this.form.get('edit-provider')?.get('providerName')?.setValue(null);
                this.form.get('edit-provider')?.get('providerNPI')?.setValue(null);
              } else {
                this.providers = providers;
              }
            })
          break;
        case 'f-name':
          this.findPatientProviderService.findProviderByFirstName(referringSearch)
            .subscribe(data => {
              this.loadingProvider = false
              var providers = data.body;
              if (providers === null) {
                this.form.get('edit-provider')?.get('providerName')?.setValue(null);
                this.form.get('edit-provider')?.get('providerNPI')?.setValue(null);
              } else {
                this.providers = providers
              }
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
            this.findPatientProviderService.findProviderByFullName(fullName[0], fullName[1])
              .subscribe(data => {
                this.loadingProvider = false
                var providers = data.body;
                if (providers === null) {
                  this.form.get('edit-provider')?.get('providerName')?.setValue(null);
                  this.form.get('edit-provider')?.get('providerNPI')?.setValue(null);
                } else {
                  this.providers = providers
                }
              })
            this.isReferringSearchNotValid = false;
            this.referringSearchErrorMessage = undefined;
          }
          break;
        case 'npi':
          var npi: number = Number(referringSearch);
          if (Number.isNaN(referringSearch)) {
            this.loadingProvider = false
            this.isReferringSearchNotValid = true;
            this.referringSearchErrorMessage = 'Doctor NPI must be numbers only'
          }
          else {
            this.findPatientProviderService.findProviderByNPI(Number(referringSearch))
              .subscribe(data => {
                var providers = data.body;
                this.loadingProvider = false
                if (providers === null) {
                  this.form.get('edit-provider')?.get('providerName')?.setValue(null);
                  this.form.get('edit-provider')?.get('providerNPI')?.setValue(null);
                } else {
                  this.providers = providers
                }
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
  update() {
    var patientProviderEditableRequest: PatientProviderEditableRequest = {
      patientId: this.patientId,
      actionTaker: this.getActionTaker(),
      referringProvider: {
        npi: this.form.get('edit-provider')?.get('providerNPI')?.value,
        name: this.form.get('edit-provider')?.get('providerName')?.value,
      }
    }
    this.updatePatientProviderService.update(patientProviderEditableRequest).subscribe(result => {
      this.changeVisibility.emit('close');
    })
  }

  private getActionTaker() :ActionTaker{
    var user: any = this.kcAuthServiceService.getLoggedUser()
    return  {
      uuid: user.sid,
      name: user.name,
      email: user.email,
      accountName: user.preferred_username
    }
    
  }
}

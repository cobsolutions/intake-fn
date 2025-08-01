import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { Agreements } from 'src/app/models/patient/agreements/agreements.model';
import { Patient } from 'src/app/models/patient/patient.model';
import { LocalService } from 'src/app/modules/common';
import { PatientAgreement } from '../../models/intake/patient.agreement';
import { PatientService } from '../../service/patient.service';
import { PatientStoreService } from '../../service/store/patient-store.service';
@Component({
  selector: 'app-aggreements',
  templateUrl: './aggreements.component.html',
  styleUrls: ['./aggreements.component.css']
})
export class AggreementsComponent implements OnInit {
  releaseInformationParagraph: string | null;
  FinancialResponsibilityParagraph: string | null;
  FinancialAgreementParagraph: string | null;
  InsuranceAgreementParagraph: string | null;
  HIPAAAcknowledgementParagraph: string | null;
  CuppingParagraph: string | null;
  PelvicParagraph: string | null;
  PhotoVideoParagraph: string | null;
  agreementHolder: AgreementHolder[] | null;
  patientName: string = ''
  model: Agreements
  patientAgreements?: PatientAgreement;
  nowDate = moment().format("MM.DD.YYYY");
  constructor(private sanitizer: DomSanitizer
    , private patientStoreService: PatientStoreService,
    private patientService: PatientService) { }

  ngOnInit(): void {
    if(this.patientStoreService.patientAgreements === undefined){
      this.patientAgreements = {}
    }else{
      this.patientAgreements = this.patientStoreService.patientAgreements;
    }
    this.patientService.getAgreement().subscribe(response => {
      this.agreementHolder = response.body
      this.agreementHolder?.forEach(element => {
        this.fillAggrement(element);
      });
    })
  }
  getReleaseInformationParagraph() {
    const paragraph = `<p style="font-family:Lucida ">${this.releaseInformationParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph)
  }
  getFinancialResponsibility() {
    const paragraph = `<p style="font-family:Lucida">
    ${this.FinancialResponsibilityParagraph}.</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph)
  }

  getFinancialAgreement() {
    const paragraph = `<p style="font-family:Lucida">
    ${this.FinancialAgreementParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph)
  }

  getInsurance() {
    const paragraph = `<p style="font-family:Lucida ">
    ${this.InsuranceAgreementParagraph}.</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }


  getHIPAAAcknowledgement() {
    const paragraph = `<p style="font-family:Lucida ">
    ${this.HIPAAAcknowledgementParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);

  }

  getCupping() {
    const paragraph = `<p style="font-family:Lucida ">
    ${this.CuppingParagraph}<p style="font-family:Lucida "></p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }

  getPelvic() {
    const paragraph = `<p style="font-family:Lucida">
    ${this.PelvicParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }

  getPhotoVideo() {
    const paragraph = `${this.PhotoVideoParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }

  fillAggrement(element: AgreementHolder) {
    if (element.agreementName === 'ReleaseInformation')
      this.releaseInformationParagraph = element.agreementText;
    if (element.agreementName === 'FinancialResponsibility')
      this.FinancialResponsibilityParagraph = element.agreementText;
    if (element.agreementName === 'FinancialAgreement')
      this.FinancialAgreementParagraph = element.agreementText;
    if (element.agreementName === 'Insurance')
      this.InsuranceAgreementParagraph = element.agreementText;
    if (element.agreementName === 'HIPAAAcknowledgement')
      this.HIPAAAcknowledgementParagraph = element.agreementText;
    if (element.agreementName === 'Cupping')
      this.CuppingParagraph = element.agreementText;
    if (element.agreementName === 'Pelvic')
      this.PelvicParagraph = element.agreementText;
    if (element.agreementName === 'PhotoVideo')
      this.PhotoVideoParagraph = element.agreementText;

  }
}

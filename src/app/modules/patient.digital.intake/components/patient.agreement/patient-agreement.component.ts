import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { PatientService } from 'src/app/modules/patient.questionnaire/service/patient.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-agreement',
  templateUrl: './patient-agreement.component.html',
  styleUrls: ['./patient-agreement.component.css']
})
export class PatientAgreementComponent implements OnInit {
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  @Input() form: FormGroup;
  agreementHolder: AgreementHolder[] | null;
  releaseInformationParagraph: string | null;
  FinancialResponsibilityParagraph: string | null;
  FinancialAgreementParagraph: string | null;
  InsuranceAgreementParagraph: string | null;
  HIPAAAcknowledgementParagraph: string | null;
  CuppingParagraph: string | null;
  PelvicParagraph: string | null;
  PhotoVideoParagraph: string | null;
  CancellationPolicyParagraph: string | null;
  CommunicationAttestationParagraph: string | null;
  AuthorizationToReleaseObtainInformationParagraph: string | null;
  ConsentToTreatmentParagraph: string | null;
  NoticeOfPrivacyPracticesParagraph: string | null;
  InsuranceEligibilityParagraph: string | null;
  AssignmentReleaseOfBenefitsParagraph: string | null;
  constructor(private sanitizer: DomSanitizer
    , private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    this.getAgreements();
  }
  private getAgreements() {
    this.digitalIntakeService.findAgreements().subscribe(response => {
      this.agreementHolder = response.body
      this.agreementHolder?.forEach(element => {
        this.fillAggrement(element);
      });
    })
  }
  private fillAggrement(element: AgreementHolder) {
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
    if (element.agreementName === 'CancellationPolicy')
      this.CancellationPolicyParagraph = element.agreementText;
    if (element.agreementName === 'CommunicationAttestation')
      this.CommunicationAttestationParagraph = element.agreementText;
    if (element.agreementName === 'Authorization-To-Release-Obtain-Information')
      this.AuthorizationToReleaseObtainInformationParagraph = element.agreementText;
    if (element.agreementName === 'Consent-To-Treatment')
      this.ConsentToTreatmentParagraph = element.agreementText;
    if (element.agreementName === 'Notice-Of-Privacy-Practices')
      this.NoticeOfPrivacyPracticesParagraph = element.agreementText;
    if (element.agreementName === 'Insurance-Eligibility')
      this.InsuranceEligibilityParagraph = element.agreementText;
    if (element.agreementName === 'Assignment-Release-Of-Benefits')
      this.AssignmentReleaseOfBenefitsParagraph = element.agreementText;
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
  getCancellationPolicy() {
    const paragraph = `${this.CancellationPolicyParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  getCommunicationAttestation() {
    const paragraph = `${this.CommunicationAttestationParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  getAuthorizationToReleaseObtainInformationParagraph() {
    const paragraph = `${this.AuthorizationToReleaseObtainInformationParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  getConsentToTreatmentParagraph() {
    const paragraph = `${this.ConsentToTreatmentParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  getNoticeOfPrivacyPracticesParagraph() {
    const paragraph = `${this.NoticeOfPrivacyPracticesParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  getInsuranceEligibilityParagraph() {
    const paragraph = `${this.InsuranceEligibilityParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  getAssignmentReleaseOfBenefitsParagraph() {
    const paragraph = `${this.AssignmentReleaseOfBenefitsParagraph}</p>
`;
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  next() {
    console.log(this.form.get('agreement')?.valid)
    if (this.form.get('agreement')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'agreement')
    }
  }
}

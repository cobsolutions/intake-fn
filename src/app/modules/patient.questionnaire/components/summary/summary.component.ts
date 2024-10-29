import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LocalService } from 'src/app/modules/common';
import { Patient } from '../../models/intake/patient';
import { PatientStoreService } from '../../service/store/patient-store.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  pateint: Patient
  constructor(private sanitizer: DomSanitizer, private patientStroeService: PatientStoreService) { }

  ngOnInit(): void {
    this.pateint = this.patientStroeService.getPatient();
  }

  getSummary() {
    const paragraph = this.getPatientBaisInfo() + this.getPatientAddress() + this.getPatientMedicalInfo() + this.getPatientInsuranceInformation();
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }

  getPatientBaisInfo() {
    const paragraph = `<u><h4 style="font-family:Lucida">Patient Basic Information</h4></u>
    <b style="font-family:Lucida">Name</b> : <i style="font-family:Lucida">${this.pateint.patientEssentialInformation?.patientName?.firstName} , ${this.pateint.patientEssentialInformation?.patientName?.middleName} , ${this.pateint.patientEssentialInformation?.patientName?.lastName} </i></br>
    <b style="font-family:Lucida">BirthDate </b> : <i >${moment(this.pateint.patientEssentialInformation?.birthDate_date).format("MM/DD/YYYY")} </i><br/>
    <b style="font-family:Lucida">Gender</b> : <i >${this.pateint.patientEssentialInformation?.gender} </i><br/>
    <b style="font-family:Lucida">Marital Status</b> : <i >${this.pateint.patientEssentialInformation?.maritalStatus} </i><br/>
    <b style="font-family:Lucida">Phone Type</b> : <i >${this.pateint.patientEssentialInformation?.patientPhone?.phoneType} </i><br/>
    <b style="font-family:Lucida">Phone Number</b> : <i >${this.pateint.patientEssentialInformation?.patientPhone?.phone} </i><br/>
    <b style="font-family:Lucida">Email</b> : <i >${this.pateint.patientEssentialInformation?.email} </i><br/>  
    <b style="font-family:Lucida">Emergency Name</b> : <i >${this.pateint.patientEssentialInformation?.patientEmergencyContact?.emergencyName} </i> <br/>
    <b style="font-family:Lucida">Emergency Phone</b> : <i > ${this.pateint.patientEssentialInformation?.patientEmergencyContact?.emergencyPhone} </i> <br/>
    <b style="font-family:Lucida">Employment Status</b> : <i >${this.pateint.patientEssentialInformation?.patientEmployment?.employmentStatus} </i> <br/>`
    return paragraph;
  }

  getPatientAddress() {
    const paragraph = `<br/><u><h4 style="font-family:Lucida">Patient Address Information</h4></u>
    <b style="font-family:Lucida">Address Type</b> : <i style="font-family:Lucida"> ${this.pateint.patientEssentialInformation!.patientAddress?.type} </i></br>
    <b style="font-family:Lucida">First Address </b> : <i style="font-family:Lucida"> ${this.pateint.patientEssentialInformation!.patientAddress?.first} </i></br>
    <b style="font-family:Lucida">Second Address </b> : <i style="font-family:Lucida"> ${this.pateint.patientEssentialInformation!.patientAddress?.second} </i></br>
    <b style="font-family:Lucida">Country</b> : <i style="font-family:Lucida"> ${this.pateint.patientEssentialInformation!.patientAddress?.country} </i></br>
    <b style="font-family:Lucida">Zip-Code</b> : <i style="font-family:Lucida"> ${this.pateint.patientEssentialInformation!.patientAddress?.zipCode} </i></br>`
    return paragraph;
  }

  getPatientMedicalInfo() {
    var paragraph = `<br/><u><h4 style="font-family:Lucida">Patient Medical Information</h4></u>`
    if (this.pateint.patientSource?.doctorSource) {
      paragraph +=
        `<b style="font-family:Lucida">Recommendation Doctor Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientSource?.doctorSource.doctorName} </i></br>
      </i></br>
      <b style="font-family:Lucida">Recommendation Doctor Fax</b> : <i style="font-family:Lucida"> ${this.pateint.patientSource?.doctorSource.doctorNPI} </i></br>`
    } else {
      paragraph +=
        `<b style="font-family:Lucida">- Recommendation Entity</b> : <i style="font-family:Lucida"> ${this.pateint.patientSource?.entitySource?.organizationName} </i></br>`
    }
    paragraph +=
      `<b style="font-family:Lucida">- Booking Appointment</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.appointmentBooking} </i></br>
    <b style="font-family:Lucida">- Primary Doctor</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.primaryDoctor} </i></br>
    
    <b style="font-family:Lucida">- Have you received physical therapy this year somewhere else?</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientPhysicalTherapy ? 'Yes' : 'No'} </i></br>`
    if (this.pateint.patientMedical?.patientPhysicalTherapy) {
      paragraph += `
      &#160 &#160 <b style="font-family:Lucida">Location</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientPhysicalTherapy.location} </i></br>
      &#160 &#160 <b style="font-family:Lucida">How many number of visits</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientPhysicalTherapy.numberOfVisit} </i></br>`
    }
    paragraph += `
    <b style="font-family:Lucida">- Height</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.height} </i></br>
    <b style="font-family:Lucida">- weight</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.weight} </i></br>
    <b style="font-family:Lucida">- What is your primary reason for today’s evaluation </b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.evaluationSubmission} </i></br>
    <b style="font-family:Lucida">- list any prescription or non-prescription medication you are taking </b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.medicationPrescription} </i></br>
    <b style="font-family:Lucida">- Condition(s) that you have been told you have (or had) </b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.patientCondition} </i></br>
    <b style="font-family:Lucida">- MRI, CT scan and X-Ray </b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.scanningTest ? 'Yes' : 'No'} </i></br>`
    if (this.pateint.patientMedical?.patientMedicalHistory?.scanningTest) {
      paragraph += `&#160 &#160 <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.scanningTestValue} </i></br>`
    }
    paragraph += `
    <b style="font-family:Lucida">pacemaker</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.pacemaker ? 'Yes' : 'No'} </i></br>
    <b style="font-family:Lucida">- Metal Implants</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.metalImplantation ? 'Yes' : 'No'} </i></br>
    <b style="font-family:Lucida">- list any Surgeries you may have had or any other conditions not listed above</b> : <i style="font-family:Lucida"> ${this.pateint.patientMedical?.patientMedicalHistory?.surgeriesList} </i></br>`
    return paragraph;
  }

  getPatientInsuranceInformation() {
    var paragraph = `<br/><u><h4 style="font-family:Lucida">Patient Insurance Information</h4></u>
    <b style="font-family:Lucida">- Patient Insurance Type?</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault ? 'Yes' : 'No'} </i></br>`
    if (this.pateint.patientInsurance?.patientInsuranceCompensationNoFault) {
      paragraph += `
      <b style="font-family:Lucida">- Worker Related Injury/Auto-Accident</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.injuryType} </i></br>
      <b style="font-family:Lucida">- Accident Date</b> : <i style="font-family:Lucida"> ${moment(this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.accidentDate_date).format("MM/DD/YYYY")} </i></br>
      <b style="font-family:Lucida">- Worker Status</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.workerStatus} </i></br>
      <b style="font-family:Lucida">- Address</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.address?.type} ,
      ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.address?.first},
      ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.address?.second},
      ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.address?.country},
      ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.address?.city},
      ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault.address?.zipCode} </i></br>
      <b style="font-family:Lucida">- Fax</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.fax} </i></br>
      <b style="font-family:Lucida">- Insurance Company Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.insuranceName} </i></br>
      <b style="font-family:Lucida">- Claim Number/ WC Case Number</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.claimNumber} </i></br>
      <b style="font-family:Lucida">- Adjuster Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.adjusterInfoName} </i></br>
      <b style="font-family:Lucida">- Adjuster Phone</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.adjusterInfoPhone} </i></br>
      <b style="font-family:Lucida">- Attorney Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.attorneyInfoName} </i></br>
      <b style="font-family:Lucida">- Attorney Phone</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.attorneyInfoPhone} </i></br>
      <b style="font-family:Lucida">- Case Status</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientInsuranceCompensationNoFault?.caseStatus} </i></br>`
    } else {
      paragraph += `
      <b style="font-family:Lucida">- Insurance Company Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.insuranceCompanyId} </i></br>
      <b style="font-family:Lucida">- Member ID</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.memberId} </i></br>
      <b style="font-family:Lucida">- Policy ID</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.policyId} </i></br>
      <b style="font-family:Lucida">- Policyholders Relationship</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.relationship} </i></br>`
      if (this.pateint.patientInsurance?.patientCommercialInsurance?.relationship !== 'Self') {
        paragraph += `
        <b style="font-family:Lucida">- Policy Holder’s First Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.patientRelationship?.patientRelationshipFirstName} </i></br>
        <b style="font-family:Lucida">- Policy Holder’s Middle Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.patientRelationship?.patientRelationshipMiddleName} </i></br>
        <b style="font-family:Lucida">- Policy Holder’s Last Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.patientRelationship?.patientRelationshipLastName} </i></br>
        <b style="font-family:Lucida">- Policy Holder’s Phone</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.patientRelationship?.patientRelationshipPhone} </i></br>
        <b style="font-family:Lucida">- Policy Holder’s Employer Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.patientRelationship?.employerName} </i></br>`
      }

      paragraph += `
      <b style="font-family:Lucida">- Do you have secondry insurance?</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance ? 'Yes' : 'No'} </i></br>`
      if (this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance) {
        paragraph += `
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s First Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance.policyHolderFirstName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s Middle Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance.policyHolderMiddleName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s Last Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance.policyHolderLastName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Insurance Company</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance.insuranceCompanyName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Member ID</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.secondaryInsurance.memberId} </i></br>`
      }
      paragraph += `
      <b style="font-family:Lucida">- Medicare Coverage?</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.medicareCoverage ? 'Yes' : 'No'} </i></br>`
      if (this.pateint.patientInsurance?.patientCommercialInsurance?.medicareCoverage) {
        paragraph += `
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s Employer First Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.medicareCoverage.employerFirstName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s Employer Middle Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.medicareCoverage.employerMiddleName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s Employer Last Name</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.medicareCoverage.employerLastName} </i></br>
        &#160 &#160 <b style="font-family:Lucida">- Policy Holder’s Employer Phone</b> : <i style="font-family:Lucida"> ${this.pateint.patientInsurance?.patientCommercialInsurance?.medicareCoverage.employerPhone} </i></br>`
      }
    }
    return paragraph;
  }
}

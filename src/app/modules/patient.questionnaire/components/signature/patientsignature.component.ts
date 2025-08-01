import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import { Patient } from 'src/app/models/patient/patient.model';
import { PatientSignature } from '../../models/patient/signature.model';
import { PatientStoreService } from '../../service/store/patient-store.service';

@Component({
  selector: 'app-patientsignature',
  templateUrl: './patientsignature.component.html',
  styleUrls: ['./patientsignature.component.css']
})
export class PatientsignatureComponent implements OnInit, AfterViewInit {
  signatureNeeded: boolean = true;
  signaturePad!: SignaturePad;
  signatureClass: string = "";
  patientFirstName: string;
  patientLastName: string;
  signatureType: number = 2;
  @ViewChild('canvas') canvasEl!: ElementRef;
  @ViewChild('patientsig') patientsig: ElementRef;
  signatureImg!: string;
  signatureImgTest: string | undefined = undefined;
  model: PatientSignature = new PatientSignature();
  faSignature = faSignature;
  screenTmp: ElementRef;
  constructor(private patientStorService: PatientStoreService) { }
  public panes = [
    { name: 'Generate Signature' },
    { name: 'Draw Signature' }
  ];

  activePane = 0;
  node: any;


  onTabChange($event: number) {
    this.signatureType = $event;
    this.activePane = $event;
  }
  ngOnInit(): void {
    this.patientFirstName = this.patientStorService.patientEssentialInformation?.patientName?.firstName!;
    this.patientLastName = this.patientStorService.patientEssentialInformation?.patientName?.lastName!;
  }
  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);

  }
  startDrawing(event: Event) {
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }
  clearPad() {
    this.signatureNeeded = true;
    this.signaturePad.clear();
  }

  draw() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
    }
    this.model.signature = this.signatureImg;
  }

  generate(): Promise<HTMLCanvasElement> {
    this.patientsig.nativeElement.name = 'patientsig'
    document.body.appendChild(this.patientsig.nativeElement);
    //var dd: HTMLElement = document.getElementById('sig')!;
    return html2canvas(this.patientsig.nativeElement, { backgroundColor: null });
  }

}

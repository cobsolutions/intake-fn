import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { Basic } from 'src/app/models/patient/basic.info.model';
import { EssentialInformation } from 'src/app/models/validation/new/essential.information';
import { PatientEssentialValidator } from 'src/app/validators/patient.validator/patient.essential.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { Relation } from '../../enums/emergency.relation';
import { PatientEssentialInformation } from '../../models/intake/essential/patient.essential.information';
import { PatientGrantor } from '../../models/intake/patient.grantor';
import { PatientStoreService } from '../../service/store/patient-store.service';
@Component({
  selector: 'app-essential-info',
  templateUrl: './essential-info.component.html',
  styleUrls: ['./essential-info.component.css']
})
export class EssentialInfoComponent implements OnInit {
  patientEssentialInformation?: PatientEssentialInformation;
  patientGrantor: PatientGrantor = {}
  relationShip = Relation;
  isPatientUnderage: boolean = false;
  imageFormData: FormData = new FormData();
  @Input() requiredFields?: EssentialInformation;
  constructor(private imageCompress: NgxImageCompressService,
    private patientStoreService: PatientStoreService) {
  }

  ngOnInit(): void {
    if (this.patientStoreService.patientEssentialInformation === undefined) {
      this.patientGrantor = {
        relation: ''
      }
      this.patientEssentialInformation = {
        patientName: {},
        patientEmergencyContact: {
          emergencyRelation: ''
        },
        patientEmployment: {
          employmentStatus: ''
        },
        patientPhone: {
          phoneType: ''
        },
        gender: '',
        maritalStatus: '',
      }
    } else {
      this.patientEssentialInformation = this.patientStoreService.patientEssentialInformation;
    }
  }
  isRequiredField(name: string): boolean {
    var field: boolean = false;
    Object.entries(this.requiredFields!)
      .forEach(([key, value]) => {
        if (key === name) {
          field = value;
        }
      })
    return field;
  }
  checkAge(event: any) {
    var patientAge = moment().diff(event, 'y')
    this.isPatientUnderage = patientAge < 18 ? true : false;
  }
  public onImageUpload(event: any, photoType: string) {

    var uploadedIDFrontImage: File = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      var localUrl = event.target.result;
      this.compressFile(localUrl, uploadedIDFrontImage['name'], photoType)

    }
    reader.readAsDataURL(uploadedIDFrontImage);

  }
  compressFile(image: any, fileName: any, fileSuffix: string) {
    var orientation = -1;
    var sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
    console.warn('Size in bytes is now:', sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        var imgResultAfterCompress = result;
        var sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024)
        console.warn('Size in bytes after compression:', sizeOFCompressedImage);
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(imgResultAfterCompress.split(',')[1]);
        //imageFile created below is the new compressed file which can be send to API in form data
        const imageFile = new File([imageBlob], imageName, {
          type: 'image/jpeg'
        });
        this.imageUploadAction(imageFile, fileSuffix);
      });
  }
  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {
      type: 'image/jpeg'
    });
    return blob;
  }
  imageUploadAction(uploadedImage: File, imageName: string) {
    this.imageFormData.append('files', uploadedImage, uploadedImage.name + ':' + imageName);
  }
  public validate(): ValidatorContainer {
    var patientValidator = new PatientEssentialValidator(this.requiredFields!, this.patientEssentialInformation || {});
    return patientValidator.validate();
  }
  formatDate() {
    this.patientEssentialInformation!.dateOfBirth = Number(moment(this.patientEssentialInformation?.birthDate_date).format("x"));
  }
}

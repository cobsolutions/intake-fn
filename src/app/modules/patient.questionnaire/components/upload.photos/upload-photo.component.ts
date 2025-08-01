import { Component, Input, OnInit } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PatientStoreService } from '../../service/store/patient-store.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  imageFormData: FormData = new FormData();
  isWorkerCompensationNoFault: boolean = false
  constructor(private imageCompress: NgxImageCompressService, private patientStoreService: PatientStoreService) { }

  ngOnInit(): void {
    if (this.patientStoreService.patientInsuranceCompensationNoFault !== undefined)
      this.isWorkerCompensationNoFault = true;
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
}

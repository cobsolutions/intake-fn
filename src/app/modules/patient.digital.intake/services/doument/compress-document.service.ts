import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class CompressDocumentService {
  fileMap: Map<string, File> = new Map();
  constructor(private imageCompress: NgxImageCompressService) { }
  public onImageUpload(event: any, photoType: string) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    //console.log(event.srcElement.files[0].name)
    const extension = event.srcElement.files[0]?.name?.split('.').pop().toLowerCase();
    if (!validExtensions.includes(extension))
      return false;
    var uploadedIDFrontImage: File = event.target.files[0];
    // if (uploadedIDFrontImage.size / (1024 * 1024) > 2)
    //   return false;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      var localUrl = event.target.result;
      this.compressFile(localUrl, uploadedIDFrontImage['name'], photoType)
    }
    reader.readAsDataURL(uploadedIDFrontImage);
  }
  public setuploadedImages(fileMap: Map<string, File>) {
    this.fileMap = fileMap;
  }
  private compressFile(image: any, fileName: any, fileSuffix: string) {
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
  private imageUploadAction(uploadedImage: File, imageName: string) {
    if (this.fileMap.has(imageName))
      this.fileMap.delete(imageName)
    this.fileMap.set(imageName, uploadedImage)
  }
}

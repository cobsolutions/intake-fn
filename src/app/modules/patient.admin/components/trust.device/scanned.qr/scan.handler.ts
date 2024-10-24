import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

export class ScanHandlerComponent {
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
    //   const scannedData = params['data'];
    //   this.makePostRequest(scannedData);
    });
  }

  makePostRequest(data: string) {
    const postUrl = 'https://your-backend-api.com/post-endpoint';
    this.http.post(postUrl, { scannedData: data }).subscribe(response => {
      console.log('POST request successful', response);
    }, error => {
      console.error('POST request failed', error);
    });
  }
}

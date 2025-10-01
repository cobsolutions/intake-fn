import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface UploadResponse {
  batchId: number;
  batchName: string;
  status: string;
  message: string;
  uploadedAt: string;
  totalEmails: number;
  fileSize?: number; // Add file size
}

export interface BatchStatusResponse {
  id: number;
  batchName: string;
  status: string;
  totalEmails: number;
  emailsSent: number;
  emailsFailed: number;
  uploadedAt: string;
  completedAt: string;
  errorMessage: string;
  fileSize?: number; // Add file size
}

@Injectable({
  providedIn: 'root'
})
export class EmailBatchService {
  private apiUrl = environment.baseURL + 'email-batches'
  constructor(private http: HttpClient) { }
  uploadExcelFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }
  getAllBatches(): Observable<BatchStatusResponse[]> {
    return this.http.get<BatchStatusResponse[]>(this.apiUrl);
  }

  getBatchById(id: number): Observable<BatchStatusResponse> {
    return this.http.get<BatchStatusResponse>(`${this.apiUrl}/${id}`);
  }
}

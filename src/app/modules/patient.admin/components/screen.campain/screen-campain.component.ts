import { Component, OnInit } from '@angular/core';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { BatchStatusResponse, EmailBatchService, UploadResponse } from '../../services/campaign/email-batch.service';
interface UploadedBatch {
  id: number;
  name: string;
  date: Date;
  status: string;
  totalEmails: number;
  emailsSent: number;
  emailsFailed: number;
  progress?: number;
  errorMessage?: string;
  fileSize?: number; // Add file size
  formattedSize?: string; // Add formatted size for display
}
@Component({
  selector: 'screen-campain',
  templateUrl: './screen-campain.component.html',
  styleUrls: ['./screen-campain.component.scss']
})
export class ScreenCampainComponent implements OnInit {
  uploadedBatches: UploadedBatch[] = [];
  isDragOver = false;
  isLoading = false;
  uploadMessage = '';
  uploadStatus: 'success' | 'error' | null = null;
  private refreshSubscription!: Subscription;
  constructor(private emailBatchService: EmailBatchService) { }
  ngOnInit(): void {
    this.loadBatches();
    this.startAutoRefresh();
  }
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  loadBatches(): void {
    this.emailBatchService.getAllBatches().subscribe({
      next: (batches) => {
        this.uploadedBatches = batches.map(batch => this.convertToUploadedBatch(batch));
      },
      error: (error) => {
        console.error('Error loading batches:', error);
      }
    });
  }
  startAutoRefresh(): void {
    this.refreshSubscription = interval(3000) // Refresh every 3 seconds
      .pipe(
        startWith(0),
        switchMap(() => this.emailBatchService.getAllBatches())
      )
      .subscribe({
        next: (batches) => {
          this.uploadedBatches = batches.map(batch => this.convertToUploadedBatch(batch));
        },
        error: (error) => {
          console.error('Error refreshing batches:', error);
        }
      });
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (this.isValidFileType(file)) {
        this.uploadFile(file);
      } else {
        this.showMessage('Please select a valid Excel file (.xlsx or .xls)', 'error');
      }
    }
  }

  private processFile(file: File): void {
    // Validate file type
    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      alert('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    // Create new batch entry
    const newBatch: UploadedBatch = {
      name: file.name,
      date: new Date(),
      status: 'Processing',
      formattedSize: this.formatFileSize(file.size),
      progress: 0,
      id: 0,
      totalEmails: 0,
      emailsSent: 0,
      emailsFailed: 0
    };

    this.uploadedBatches.unshift(newBatch);

    // Simulate upload progress
    this.simulateUploadProgress(newBatch);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private simulateUploadProgress(batch: UploadedBatch): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        batch.status = 'Completed';
        clearInterval(interval);
      }
      batch.progress = progress;
    }, 300);
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return '✓';
      case 'partially_completed': return '✓';
      case 'processing': return '⟳';
      case 'failed': return '✗';
      default: return '?';
    }
  }

  removeBatch(index: number): void {
    this.uploadedBatches.splice(index, 1);
  }

  retryUpload(batch: UploadedBatch): void {
    batch.status = 'Processing';
    batch.progress = 0;
    this.simulateUploadProgress(batch);
  }
  uploadFile(file: File): void {
    if (!this.isValidFileType(file)) {
      this.showMessage('Please select a valid Excel file (.xlsx or .xls)', 'error');
      return;
    }

    this.isLoading = true;
    this.showMessage('Uploading file...', 'success');

    this.emailBatchService.uploadExcelFile(file).subscribe({
      next: (response: UploadResponse) => {
        this.isLoading = false;
        this.showMessage(response.message, response.status === 'FAILED' ? 'error' : 'success');

        if (response.status !== 'FAILED') {
          // Reload batches to include the new one
          this.startAutoRefresh();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showMessage('Upload failed: ' + error.message, 'error');
        console.error('Upload error:', error);
      }
    });
  }
  private isValidFileType(file: File): boolean {
    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return validTypes.includes(fileExtension || '');
  }
  private showMessage(message: string, status: 'success' | 'error'): void {
    this.uploadMessage = message;
    this.uploadStatus = status;

    // Clear message after 5 seconds
    setTimeout(() => {
      this.uploadMessage = '';
      this.uploadStatus = null;
    }, 5000);
  }
  private convertToUploadedBatch(batch: BatchStatusResponse): UploadedBatch {
    console.log('batch.emailsSent ' + batch.recordsProcessed + '  batch.totalEmails ' + batch.totalRecords)
    const progress = batch.status === 'COMPLETED' ? 100 :
      batch.status === 'PROCESSING' ? Math.round((batch.recordsProcessed / batch.totalRecords) * 100) : 0;

    return {
      id: batch.id,
      name: batch.batchName,
      date: new Date(batch.uploadedAt),
      status: batch.status,
      totalEmails: batch.totalRecords,
      emailsSent: batch.recordsProcessed,
      emailsFailed: batch.recordsFailed,
      progress: progress,
      errorMessage: batch.errorMessage,
      fileSize: batch.fileSize,
      formattedSize: batch.fileSize ? this.formatFileSize(batch.fileSize) : 'N/A'
    };
  }
  getProgressColor(batch: UploadedBatch): string {
    if (batch.status === 'COMPLETED') return '#4CAF50';
    if (batch.status === 'FAILED') return '#f44336';
    return '#2196F3';
  }
}

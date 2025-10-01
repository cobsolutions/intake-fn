import { Component, OnInit } from '@angular/core';
interface UploadedBatch {
  name: string;
  date: Date;
  status: string;
  fileSize?: string;
  progress?: number;
}
@Component({
  selector: 'screen-campain',
  templateUrl: './screen-campain.component.html',
  styleUrls: ['./screen-campain.component.scss']
})
export class ScreenCampainComponent implements OnInit {
  ngOnInit(): void {
  }
  uploadedBatches: UploadedBatch[] = [
    {
      name: 'Patient_Records_Q1.xlsx',
      date: new Date('2023-03-15'),
      status: 'Completed',
      fileSize: '2.4 MB'
    },
    {
      name: 'Lab_Results_March.xlsx',
      date: new Date('2023-03-20'),
      status: 'Processing',
      fileSize: '1.8 MB',
      progress: 65
    },
    {
      name: 'Clinical_Data_Feb.xlsx',
      date: new Date('2023-02-28'),
      status: 'Failed',
      fileSize: '3.1 MB'
    }
  ];

  isDragOver = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.processFile(file);
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
      this.processFile(file);
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
      fileSize: this.formatFileSize(file.size),
      progress: 0
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
}

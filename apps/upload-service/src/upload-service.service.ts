import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor(
    @InjectQueue('file-upload-queue') private readonly fileUploadQueue: Queue,
  ) { }

  async handleFileUpload(file: any): Promise<string> {
    console.log('On service layer ------------>');
    console.log(file);
    try {
      const { createReadStream, filename } = await file.promise;

      if (!createReadStream || !filename) {
        throw new Error('Invalid file structure: Missing file stream or filename.');
      }

      const uploadDir = join(process.cwd(), 'uploads');

      // Create the upload directory if it does not exist
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, filename);

      // Create a new promise to handle the file stream and writing to disk
      await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => resolve(`File uploaded successfully: ${filename}`))
          .on('error', (err) => reject(`Failed to upload file: ${err.message}`));
      });

      // Add a job to the file upload queue for processing the uploaded file
      const job = await this.fileUploadQueue.add('process-data', { filePath });
      console.log('File added to job successfully ---- job --> ', job.data);

      return `File uploaded and job added: ${filename}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }
}

import { Process, Processor } from '@nestjs/bull'; 
import { Injectable } from '@nestjs/common'; 
import { Job } from 'bull';
import { VehicleEntity } from './entity/vehicle.entity'; 
import { DataSource } from 'typeorm'; 
import * as path from 'path'; 
import * as fs from 'fs'; // Import fs module for file system operations
import * as csv from 'csv-parser'; // Import csv-parser for parsing CSV files
import * as XLSX from 'xlsx'; // Import xlsx for parsing Excel files
import { NotificationGateway } from 'apps/notification-service/src/notification-service.gateway'; // Import NotificationGateway for sending notifications

@Injectable()
@Processor('file-upload-queue') // Define the queue processor for 'file-upload-queue'
export class ProcessService {
  constructor(
    private readonly dataSource: DataSource, // Inject DataSource for database operations
    private readonly notificationGateway: NotificationGateway, // Inject NotificationGateway for sending notifications
  ) { }

  private readonly NOTIFICATION_BATCH = 100; // Number of rows to send in notification batch

  @Process('process-data') // Define a method to process 'process-data' jobs from the queue
  async handleJob(job: Job) {
    try {
      console.log(job.data); // Log job data for debugging
      const filePath = job.data.filePath; // Get file path from job data
      const fileExtension = path.extname(filePath).toLowerCase(); // Get file extension and convert to lowercase
      let rows: any[] = []; // Initialize an array to store rows

      // Parse the file based on its extension
      if (fileExtension === '.csv') {
        rows = await this.parseCSVFile(filePath); // Parse CSV file
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        rows = await this.parseExcelFile(filePath); // Parse Excel file
      } else {
        console.error('Unsupported file type', fileExtension); // Log error for unsupported file types
        return;
      }

      console.log("All are done"); 
      await this.sendFirst100RowsAndCount(); // Send the first 100 rows and count

    } catch (error) {
      console.error('Error processing job:', error); // Log any errors during job processing
    }
  }

  // Parse CSV file and return the rows
  private async parseCSVFile(filePath: string): Promise<any[]> {
    const results: any[] = []; // Array to store parsed rows
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath) // Create a readable stream for the CSV file
        .pipe(csv()) // Pipe the stream to csv-parser
        .on('data', (row) => {
          // Calculate age of vehicle and add it to row
          row.age_of_vehicle = new Date().getFullYear() - new Date(row.manufactured_date).getFullYear();
          results.push(row); // Add row to results
        })
        .on('end', async () => {
          // When parsing is done, insert data into database
          if (results.length > 0) {
            await this.insertDataIntoDatabase(results);
          }
          resolve(results); // Resolve the promise with parsed results
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error); // Log any errors during CSV reading
          reject(error); // Reject the promise with the error
        });
    });
  }

  // Parse Excel file and return the rows
  private async parseExcelFile(filePath: string): Promise<any[]> {
    const results: any[] = []; // Array to store parsed rows
    try {
      const workbook = XLSX.readFile(filePath); // Read the Excel file
      const sheetName = workbook.SheetNames[0]; // Get the first sheet name
      const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON

      // Calculate age of vehicle for each row
      jsonData.forEach((row: any) => {
        row.age_of_vehicle = new Date().getFullYear() - new Date(row.manufactured_date).getFullYear();
      });

      await this.insertDataIntoDatabase(jsonData); // Insert data into database
      results.push(...jsonData); // Add parsed rows to results
    } catch (error) {
      console.error('Error reading Excel file:', error); // Log any errors during Excel reading
    }
    return results; // Return the parsed results
  }

  // Insert parsed data into the database
  private async insertDataIntoDatabase(data: any[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const batchInsertData = data.map(row => {
        const vehicleEntity = new VehicleEntity(); // Create a new VehicleEntity
        vehicleEntity.firstName = row.first_name;
        vehicleEntity.lastName = row.last_name;
        vehicleEntity.email = row.email;
        vehicleEntity.carMake = row.car_make;
        vehicleEntity.carModel = row.car_model;
        vehicleEntity.vin = row.vin;
        vehicleEntity.manufacturedDate = new Date(row.manufactured_date);
        vehicleEntity.ageOfVehicle = row.age_of_vehicle;
        return vehicleEntity; // Map row to VehicleEntity
      });

      try {
        await manager.save(VehicleEntity, batchInsertData); // Save data to database
        console.log(`Inserted ${batchInsertData.length} records into the database`); // Log success message
      } catch (error) {
        console.error('Error inserting batch into database:', error); // Log any errors during insertion
        throw error; // Rethrow error to handle it in the transaction
      }
    });
  }

  // Send the first 100 rows and count of rows in the database
  private async sendFirst100RowsAndCount(): Promise<void> {
    console.log("Fetching first 100 rows");

    const first100Rows = await this.dataSource
      .getRepository(VehicleEntity)
      .createQueryBuilder('vehicle')
      .orderBy('vehicle.id', 'ASC') // Order by vehicle ID
      .take(this.NOTIFICATION_BATCH) // Limit to first 100 rows
      .getMany(); // Fetch rows

    const totalRows = await this.dataSource.getRepository(VehicleEntity).count(); // Get total row count

    const pageCount = Math.ceil(totalRows / 100); // Calculate total page count

    console.log('First 100 Rows:', first100Rows); 
    console.log('Total Rows:', totalRows); 
    console.log('Page Count:', pageCount); 

    try {
      this.notificationGateway.sendNotification({
        first100Rows,
        totalRows,
        pageCount,
      }); // Send notification with fetched data
      console.log("Sent data to notification");
    } catch (error) {
      console.error('Error sending notification:', error); // Log any errors during notification sending
    }
  }
}

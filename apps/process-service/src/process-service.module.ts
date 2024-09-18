import { Module } from '@nestjs/common';
import { ProcessService } from './process-service.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entity/vehicle.entity';
import { NotificationGateway } from 'apps/notification-service/src/notification-service.gateway';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'vehicleDataHub',
      entities: [VehicleEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([VehicleEntity]),
  ],
  providers: [ProcessService, NotificationGateway],
})
export class ProcessServiceModule { }

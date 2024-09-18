import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesResolver } from './vehicles.resolver';
import { VehiclesService } from './vehicles.service';
import { VehicleEntity } from './entities/vehicleCrud.VehicleEntity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity])], 
  providers: [VehiclesResolver, VehiclesService],
})
export class VehiclesModule {}

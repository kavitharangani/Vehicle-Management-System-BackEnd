import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleInput } from './input/create-vehicle.input';
import { UpdateVehicleInput } from './input/update-vehicle.input';
import { DeleteVehicleInput } from './input/delete-vehicle.input';
import { VehicleEntity } from './entities/vehicleCrud.VehicleEntity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async createVehicle(createVehicleInput: CreateVehicleInput): Promise<VehicleEntity> {
    const newVehicle = this.vehicleRepository.create(createVehicleInput);
    await this.vehicleRepository.save(newVehicle);
    console.log("Vehicle saved to database");
    return newVehicle;
  }

  async updateVehicle(updateVehicleInput: UpdateVehicleInput): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { vehicleId: updateVehicleInput.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${updateVehicleInput.vehicleId} not found`);
    }

    
    Object.assign(vehicle, updateVehicleInput);
    await this.vehicleRepository.save(vehicle);
    console.log("Vehicle updated in database");
    return vehicle;
  }

  
  async getVehicle(vehicleId: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOne({ where: { vehicleId } });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    return vehicle;
  }

  
  async getVehicles(): Promise<VehicleEntity[]> {
    return this.vehicleRepository.find();
  }

 
  async deleteVehicle(deleteVehicleInput: DeleteVehicleInput): Promise<VehicleEntity> {
    console.log('Delete Vehicle Input:', deleteVehicleInput);

    const vehicle = await this.vehicleRepository.findOne({
      where: { vehicleId: deleteVehicleInput.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${deleteVehicleInput.vehicleId} not found`);
    }

    await this.vehicleRepository.remove(vehicle);
    console.log(`Vehicle with ID ${deleteVehicleInput.vehicleId} deleted from database`);
    return vehicle;
  }
}

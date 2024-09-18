import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleInput } from './input/create-vehicle.input';
import { UpdateVehicleInput } from './input/update-vehicle.input';
import { DeleteVehicleInput } from './input/delete-vehicle.input';
import { VehicleEntity } from './entities/vehicleCrud.VehicleEntity';

@Controller('vehicles')
export class VehiclesController {
  // Inject VehiclesService into the controller
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async createVehicle(@Body() createVehicleInput: CreateVehicleInput): Promise<VehicleEntity> {
    return this.vehiclesService.createVehicle(createVehicleInput);
  }

  @Put(':id')
  async updateVehicle(
    @Param('id') vehicleId: string,
    @Body() updateVehicleInput: UpdateVehicleInput
  ): Promise<VehicleEntity> {
    return this.vehiclesService.updateVehicle({ ...updateVehicleInput, vehicleId });
  }

  @Get(':id')
  async getVehicle(@Param('id') vehicleId: string): Promise<VehicleEntity> {
    return this.vehiclesService.getVehicle(vehicleId);
  }

  @Delete(':id')
  async deleteVehicle(@Param('id') vehicleId: string): Promise<VehicleEntity> {
    return this.vehiclesService.deleteVehicle({ vehicleId });
  }

  @Get()
  async getVehicles(): Promise<VehicleEntity[]> {
    return this.vehiclesService.getVehicles();
  }
}

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleInput } from './input/create-vehicle.input';
import { UpdateVehicleInput } from './input/update-vehicle.input';
import { DeleteVehicleInput } from './input/delete-vehicle.input';
import { VehicleEntity } from './entities/vehicleCrud.VehicleEntity';

@Resolver(() => VehicleEntity)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => VehicleEntity, { name: 'vehicle' })
  getVehicle(@Args('vehicleId') vehicleId: string): Promise<VehicleEntity> {
    return this.vehiclesService.getVehicle(vehicleId);
  }

  @Query(() => [VehicleEntity], { name: 'vehicles' })
  getVehicles(): Promise<VehicleEntity[]> {
    return this.vehiclesService.getVehicles();
  }

  @Mutation(() => VehicleEntity)
  createVehicle(@Args('createVehicleInput') createVehicleInput: CreateVehicleInput): Promise<VehicleEntity> {
    return this.vehiclesService.createVehicle(createVehicleInput);
  }

  @Mutation(() => VehicleEntity)
  updateVehicle(@Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput): Promise<VehicleEntity> {
    return this.vehiclesService.updateVehicle(updateVehicleInput);
  }

  @Mutation(() => VehicleEntity)
  deleteVehicle(@Args('deleteVehicleInput') deleteVehicleInput: DeleteVehicleInput): Promise<VehicleEntity> {
    return this.vehiclesService.deleteVehicle(deleteVehicleInput);
  }
}

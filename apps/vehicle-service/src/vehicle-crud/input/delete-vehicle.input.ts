import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteVehicleInput {
  @Field()
  @IsNotEmpty()
  vehicleId: string;
}

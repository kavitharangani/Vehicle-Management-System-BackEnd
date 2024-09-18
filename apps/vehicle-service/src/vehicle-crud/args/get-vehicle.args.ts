import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetVehicleArgs{
    @Field()
    @IsNotEmpty()

    vehicleId: string;

}
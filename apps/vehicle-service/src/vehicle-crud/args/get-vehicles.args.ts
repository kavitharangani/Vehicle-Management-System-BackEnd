import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";

@ArgsType()
export class GetVehiclesArgs {
    @Field(() => [String])
    @IsArray()
    vehiclesIds: string[];
}
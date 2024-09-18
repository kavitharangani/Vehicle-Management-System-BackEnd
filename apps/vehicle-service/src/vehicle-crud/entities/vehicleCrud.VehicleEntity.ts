import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('vehiclecrud')
export class VehicleEntity {
  @Field(() => ID) 
  @PrimaryGeneratedColumn('uuid')
  vehicleId: string;

  @Field() 
  @Column()
  first_name: string;

  @Field()
  @Column()
  last_name: string;

  @Field() 
  @Column()
  email: string;

  @Field() 
  @Column()
  car_make: string;

  @Field() 
  @Column()
  car_model: string;

  @Field() 
  @Column()
  vin: string;

  @Field() 
  @Column({ type: 'date' })
  manufactured_date: Date;

  @Field() 
  @Column()
  ageOfVehicle: number;
}

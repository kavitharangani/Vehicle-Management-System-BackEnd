import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { VehicleEntity } from './vehicle-crud/entities/vehicleCrud.VehicleEntity';
import { VehiclesModule } from './vehicle-crud/vehicles.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      csrfPrevention: false,
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
    VehiclesModule,
  ],

  controllers: [],
  providers: [],
  
})
export class AppModule {}

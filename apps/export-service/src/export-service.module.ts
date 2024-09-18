import { Module } from '@nestjs/common';
import { ExportService } from './export-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
      csrfPrevention: false,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'vehicleDataHub',
      entities: [Vehicle],
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  providers: [ExportService],
})
export class ExportServiceModule {}

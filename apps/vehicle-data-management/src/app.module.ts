import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    // Configure the GraphQLModule with Apollo Gateway driver
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        csrfPrevention: false,
      },
      gateway: {
        // Configure subgraphs with their names and URLs
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'upload-service', url: 'http://localhost:3002/graphql', },
            { name: 'vehicle-service', url: 'http://localhost:3008/graphql', },
          ]
        }),
      }
    })
  ],
  providers: [],
})
export class AppModule { }

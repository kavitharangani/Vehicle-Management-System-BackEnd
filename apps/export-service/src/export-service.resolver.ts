import { Args, Mutation, Query } from '@nestjs/graphql';
import { ExportService } from './export-service.service';
import { Resolver } from '@nestjs/graphql';
import { ResponseExport } from './dto/response-export.dto';
import { RequestExport } from './dto/request-export.dto';

@Resolver()
export class ExportServiceResolver {

  constructor(private readonly exportService: ExportService) {}

  @Query(() => String, { name: 'exportServiceHealthCheck' })
  exportServiceHealthCheck(): string {
      return "Export Service Health Check: OK";
  }

  @Mutation(() => ResponseExport)
  async exportData(@Args('requestExport') requestExport: RequestExport): Promise<ResponseExport> {
      console.log("hit export data endpoint on export service");
      return this.exportService.exportVehicleData(requestExport);
  }

}

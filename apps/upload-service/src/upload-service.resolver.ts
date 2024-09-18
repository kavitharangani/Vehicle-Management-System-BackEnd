import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UploadService } from "./upload-service.service";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";

@Resolver()
export class UploadServiceResolver {

    constructor(private readonly uploadService: UploadService) { }

    @Query(() => String, { name: 'uploadServiceHealthCheck' })
    uploadServiceHealthCheck(): string {
        return "Upload Service Health Check: OK";
    }

    @Mutation(() => String)
    async uploadFile(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload): Promise<string> {
        return this.uploadService.handleFileUpload(file);
    }
}
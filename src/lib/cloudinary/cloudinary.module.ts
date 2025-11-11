import { StorageContract } from "@/core/storage/contracts/storage.contract"
import { CloudinaryService } from "@/lib/cloudinary/cloudinary.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  providers: [{ provide: StorageContract, useClass: CloudinaryService }],
  exports: [StorageContract]
})
export class CloudinaryModule {}

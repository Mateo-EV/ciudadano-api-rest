import { StorageContract } from "@/core/storage/contracts/storage.contract"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"

@Injectable()
export class CloudinaryService implements StorageContract {
  private cloudinary: typeof cloudinary

  constructor(private configService: ConfigService) {
    this.cloudinary = cloudinary
    this.cloudinary.config({
      secure: true,
      api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get<string>("CLOUDINARY_API_SECRET"),
      cloud_name: this.configService.get<string>("CLOUDINARY_CLOUD_NAME")
    })
  }

  async uploadFile(
    file: Express.Multer.File
  ): Promise<{ url: string; key: string }> {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          if (error) {
            reject(new Error(`Upload failed: ${error.message}`))
            return
          }
          if (!uploadResult) {
            reject(new Error("Upload failed: no result returned"))
            return
          }
          resolve(uploadResult)
        })
        .end(file.buffer)
    })
    return { url: result.secure_url, key: result.public_id }
  }

  async deleteFile(key: string): Promise<void> {
    await this.cloudinary.uploader.destroy(key, error => {
      if (error) {
        throw new Error("Deletion failed")
      }
    })
  }
}

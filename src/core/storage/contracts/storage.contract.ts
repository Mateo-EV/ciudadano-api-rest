export abstract class StorageContract {
  abstract uploadFile(
    file: Express.Multer.File
  ): Promise<{ url: string; key: string }>
  abstract deleteFile(key: string): Promise<void>
}

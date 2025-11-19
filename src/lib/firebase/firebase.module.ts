import { FirebaseService } from "@/lib/firebase/firebase.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService]
})
export class FirebaseModule {}

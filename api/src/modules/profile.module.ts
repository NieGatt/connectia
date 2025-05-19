import { Module } from "@nestjs/common";
import { ProfileController } from "src/controllers/profile.controller";
import { ProfileService } from "src/services/profile.service";

@Module({
    controllers: [ProfileController],
    providers: [ProfileService]
})
export class ProfileModule {}
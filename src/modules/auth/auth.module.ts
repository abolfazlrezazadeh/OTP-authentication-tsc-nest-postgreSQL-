import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { OtpEntity } from "../user/entities/otp.entity";
import { authController } from "./auth.controller";
import { authService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity,OtpEntity])],
    controllers:[authController],
    providers:[authService,JwtService],
    exports:[authService,JwtService,TypeOrmModule]
})
export class AuthModule{}
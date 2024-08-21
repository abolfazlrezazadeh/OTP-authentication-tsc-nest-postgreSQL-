import { Body, Controller, Post } from "@nestjs/common";
import { authService } from "./auth.service";
import { checkOtpDto, sendOtpDto } from "./dto/auth.dto";


@Controller("auth")
export class authController{
    constructor(private readonly authService:authService ) { }
    @Post("/send-otp")
    sendOtp(@Body() otpDto:sendOtpDto){
        return this.authService.sendOtp(otpDto)
    }

    @Post("/check-otp")
    checkOtp(@Body() otpDto:checkOtpDto){
        return this.authService.checkOtp(otpDto)
    }
}
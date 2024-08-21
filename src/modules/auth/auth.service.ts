import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { checkOtpDto, sendOtpDto } from "./dto/auth.dto";
import { randomInt } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tokenPayload } from "./types/payload";

@Injectable()
export class authService {
    constructor(
        // user
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        //otp
        @InjectRepository(OtpEntity)
        private otpRepository: Repository<OtpEntity>,
        private jwtService: JwtService,
        private jwtConfigService: ConfigService
    ) { }

    async sendOtp(sendOtpDto: sendOtpDto) {
        const { phone } = sendOtpDto

        let user = await this.userRepository.findOneBy({ phone })
        if (!user) {
            user = this.userRepository.create({ phone })
            user = await this.userRepository.save(user)
        }
        await this.createOtpForUser(user)
        return {
            message: "code sent successfully ..."
        }
    }
    async checkOtp(otpDto: checkOtpDto) {
        const { code, phone } = otpDto
        // like populate in monggose
        const existUser = await this.userRepository.findOne({
            where: { phone },
            relations: {
                otp: true
            }
        })
        const now = new Date()
        if (!existUser || !existUser?.otp)
            throw new BadRequestException("please sign tour phone number")

        if (existUser?.otp?.code !== code)
            throw new UnauthorizedException("code is not correct")

        if (existUser?.otp?.expiresIn < now)
            throw new UnauthorizedException("code is expired please try again")
        if (!existUser.phoneVerify)
            await this.userRepository.update({ id: existUser.id }, { phoneVerify: true })
        const { accessToken, refreshToken } = await this.userTokens({ phone, id: existUser.id })
        return {
            message: "you logined successfully ...",
            accessToken,
            refreshToken
        }
    }
    async createOtpForUser(user: UserEntity) {
        //2 minuts
        const expiresIn = new Date(new Date().getTime() + (1000 * 60 * 2))
        //5 digits number
        const code: string = randomInt(10_000, 99_999).toString()
        let otp = await this.otpRepository.findOneBy({ userId: user.id })
        if (otp) {
            if (otp.expiresIn > new Date()) {
                throw new BadRequestException("please wait 2 minuts")
            }
            otp.code = code;
            otp.expiresIn = expiresIn
        } else {
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId: user.id
            })
        }
        await this.otpRepository.save(otp)
        user.otpId = otp.id
        await this.userRepository.save(user)
    }
    async userTokens(payload: tokenPayload) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.jwtConfigService.get("jwt.acessSecretKey"),
            expiresIn: "10d"
        })
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.jwtConfigService.get("jwt.refreshSecretKey"),
            expiresIn: "1y"
        })
        return {
            accessToken,
            refreshToken
        }
    }
    async valiadateAccessToken(token: string) {
        try {
            const payload = this.jwtService.verify<tokenPayload>(token, {
                secret: this.jwtConfigService.get("jwt.acessSecretKey")
            })
            if (typeof payload === "object" && payload?.id) {
                const user = await this.userRepository.findOneBy({ id: payload.id })
                if (!user)
                    throw new UnauthorizedException("login to your accoant ... ")
                return user
            }
            throw new UnauthorizedException("login to your accoant ... ")
        } catch (error) {
            throw new UnauthorizedException("login to your accoant ...")
        }
    }
}
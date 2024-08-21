import { IsMobilePhone, IsString, Length } from "class-validator";


export class sendOtpDto{
    @IsMobilePhone("fa-IR",{},{message:"phone number is invalid"})
    phone:string
    
}
export class checkOtpDto{
    @IsMobilePhone("fa-IR",{},{message:"phone number is invalid"})
    phone:string
    @IsString()
    @Length(5,5,{message:"incorrect code"})
    code:string
}
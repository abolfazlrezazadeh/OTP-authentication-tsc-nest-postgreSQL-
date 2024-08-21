import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity("otp")
export class OtpEntity{
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column()
    code:string;
    @Column()
    expiresIn:Date
    @Column()
    userId:string;
    @OneToOne(()=>UserEntity,(user)=>user.otp,{onDelete:"CASCADE"})
    user:UserEntity
}

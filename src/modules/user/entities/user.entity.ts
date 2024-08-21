import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable:true})
    firstName: string;
    @Column({nullable:true})
    lastName: string;
    @Column()
    phone: string;
    // is it verify phone or not
    @Column({ default: false })
    phoneVerify: boolean;
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
    @Column({nullable:true})
    otpId:string
    @OneToOne(() => OtpEntity, (otp) => otp.user)
    @JoinColumn({name:"otpId"})
    otp: OtpEntity
}

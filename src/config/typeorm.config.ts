import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";


@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory{
    constructor(private configService:ConfigService){}
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type:"postgres",
            port:this.configService.get("db.port"),
            host:this.configService.get("db.host"),
            username :this.configService.get("db.userName"),
            password:this.configService.get("db.password"),
            database:this.configService.get("db.dataBase"),
            synchronize:true,
            // load entity in static way
            entities:[
                "dist/**/**/**/*.entity{.ts,.js}",
                "dist/**/**/*.entity{.ts,.js}",
            ] 
        }
    }
}
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configurations } from "src/config/config";


@Module({
    imports:[
        ConfigModule.forRoot({
            // load is accespt array
            load:configurations,
            isGlobal:true
        })
    ]
})
export class customConfigModule{}
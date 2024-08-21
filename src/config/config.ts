import { registerAs } from "@nestjs/config";

export enum configKeys {
    APP = "app",
    DB = "db",
    JWT= "jwt"
}

const appConfig = registerAs(configKeys.APP, () => ({
    port: "3000"
}))
const jwtConfig = registerAs(configKeys.JWT, () => ({
    // random key generated
    acessSecretKey:"7b976b1556a165994382fddda573b695a67cacbe",
    refreshSecretKey:"7b976b1556a165994382fddda573b695a67cacbe",
}))
const dbConfig = registerAs(configKeys.DB, () => ({
    port: "5432",
    host:"localhost",
    userName:"postgres",
    password:"a1234",
    dataBase:"auth-otp",
}))

export const configurations = [appConfig,dbConfig,jwtConfig]
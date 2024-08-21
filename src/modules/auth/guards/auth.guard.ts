import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import { authService } from "../auth.service";


@Injectable()
export class authGuard implements CanActivate {
    constructor(private authService:authService){}
    async canActivate(context: ExecutionContext){
        const request: Request = context.switchToHttp().getRequest<Request>()
        const token = this.extractToken(request)
        
        request.user = await this.authService.valiadateAccessToken(token)
        return true
    }

    protected extractToken(request:Request){
        const { authorization } = request.headers
        if (!authorization || authorization?.trim() === "")
            throw new UnauthorizedException("login to you accoant")
        const [bearer, token] = authorization.split(" ")
        if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token))
            throw new UnauthorizedException("login to you accoant")
        return token
    }
}
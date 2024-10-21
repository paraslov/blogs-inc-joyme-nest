import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../settings/configuration'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationType>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const secret = this.configService.get('jwtSettings').ACCESS_JWT_SECRET

      try {
        const decoded = await this.jwtService.verify(token, { secret })

        req.user = { userId: decoded.sub, username: decoded.username }
      } catch (err) {
        console.error('Invalid token:', err.message)
      }
    }

    next()
  }
}

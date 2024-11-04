import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class DevicesService {
  constructor(private jwtService: JwtService) {}

  decodeRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken)

      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }
}
